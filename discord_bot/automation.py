"""Automação Playwright para concluir lições do Speak dentro da Sala do Futuro."""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

from playwright.async_api import Page, TimeoutError as PlaywrightTimeoutError, async_playwright


LOGGER = logging.getLogger("automation")


@dataclass(slots=True)
class AutomationResult:
    success: bool
    message: str
    screenshots: list[Path] = field(default_factory=list)
    steps: list[str] = field(default_factory=list)


class SpeakAutomation:
    """Classe com o fluxo principal de automação web."""

    def __init__(self, headless: bool = True, screenshots_dir: str = "discord_bot/temp_screenshots") -> None:
        self.headless = headless
        self.screenshots_dir = Path(screenshots_dir)
        self.screenshots_dir.mkdir(parents=True, exist_ok=True)

    async def run_for_user(self, discord_user_id: int, login: str, password: str) -> AutomationResult:
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        user_dir = self.screenshots_dir / f"{discord_user_id}_{stamp}"
        user_dir.mkdir(parents=True, exist_ok=True)

        steps: list[str] = []
        screenshots: list[Path] = []

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=self.headless)
                context = await browser.new_context(locale="pt-BR")
                page = await context.new_page()

                await self._open_portal(page, steps, screenshots, user_dir)
                await self._login(page, login, password, steps, screenshots, user_dir)
                await self._go_to_speak(page, steps, screenshots, user_dir)
                await self._do_weekly_lessons(page, steps, screenshots, user_dir)

                await context.close()
                await browser.close()

            msg = "Lições processadas com sucesso."
            return AutomationResult(True, msg, screenshots, steps)
        except PlaywrightTimeoutError:
            msg = "Tempo esgotado durante a automação (possível lentidão/CAPTCHA)."
            steps.append(msg)
            return AutomationResult(False, msg, screenshots, steps)
        except Exception as exc:  # noqa: BLE001
            LOGGER.exception("Erro inesperado na automação")
            msg = f"Erro inesperado: {exc}"
            steps.append(msg)
            return AutomationResult(False, msg, screenshots, steps)

    async def _open_portal(self, page: Page, steps: list[str], shots: list[Path], folder: Path) -> None:
        await page.goto("https://saladofuturo.educacao.sp.gov.br/", wait_until="domcontentloaded")
        steps.append("Portal Sala do Futuro aberto.")
        shots.append(await self._shot(page, folder, "01_portal"))

    async def _login(
        self,
        page: Page,
        login: str,
        password: str,
        steps: list[str],
        shots: list[Path],
        folder: Path,
    ) -> None:
        # Seletores robustos com fallback por texto/atributos mais comuns.
        await page.get_by_role("textbox").first.fill(login)
        await page.get_by_label("Senha", exact=False).fill(password)
        await page.get_by_role("button", name="Entrar", exact=False).click()
        await page.wait_for_load_state("networkidle")

        # Tentativa simples de detectar CAPTCHA ou erro de login.
        content = await page.content()
        if "captcha" in content.lower():
            raise RuntimeError("CAPTCHA detectado. Resolva manualmente e tente novamente.")
        if "senha inválida" in content.lower() or "credenciais inválidas" in content.lower():
            raise RuntimeError("Login falhou: usuário/senha inválidos.")

        steps.append("Login realizado.")
        shots.append(await self._shot(page, folder, "02_logado"))

    async def _go_to_speak(self, page: Page, steps: list[str], shots: list[Path], folder: Path) -> None:
        # A plataforma pode variar de nome (Speak / SPeak / EF English Live etc.).
        selectors = [
            "text=Speak",
            "text=SPeak",
            "text=Education First",
            "text=Inglês",
        ]
        clicked = False
        for selector in selectors:
            locator = page.locator(selector)
            if await locator.count() > 0:
                await locator.first.click()
                clicked = True
                break

        if not clicked:
            raise RuntimeError("Não foi possível localizar o card/link da plataforma Speak.")

        await page.wait_for_load_state("networkidle")
        steps.append("Navegação para a plataforma Speak concluída.")
        shots.append(await self._shot(page, folder, "03_speak_home"))

    async def _do_weekly_lessons(self, page: Page, steps: list[str], shots: list[Path], folder: Path) -> None:
        # Estratégia genérica para aulas semanais com múltiplas atividades.
        lesson_buttons = page.locator("text=/Continuar|Iniciar lição|Start lesson/i")
        count = await lesson_buttons.count()
        if count == 0:
            steps.append("Nenhuma lição pendente encontrada (possivelmente já concluída).")
            shots.append(await self._shot(page, folder, "04_sem_pendencias"))
            return

        for idx in range(count):
            await lesson_buttons.nth(idx).click()
            await page.wait_for_load_state("domcontentloaded")
            steps.append(f"Lição {idx + 1} iniciada.")
            shots.append(await self._shot(page, folder, f"05_licao_{idx + 1}_inicio"))
            await self._complete_current_lesson(page, steps, shots, folder, idx + 1)

    async def _complete_current_lesson(
        self,
        page: Page,
        steps: list[str],
        shots: list[Path],
        folder: Path,
        lesson_number: int,
    ) -> None:
        # Loop defensivo: tenta avançar até finalizar.
        for activity in range(1, 16):
            # 1) múltipla escolha (clica primeira opção válida)
            choice = page.locator("button, [role='button']").filter(has_text="A")
            if await choice.count() > 0:
                await choice.first.click()

            # 2) lacunas simples
            text_inputs = page.locator("input[type='text']")
            if await text_inputs.count() > 0:
                for i in range(await text_inputs.count()):
                    await text_inputs.nth(i).fill("ok")

            # 3) speaking/listening -> tentativa mínima para avançar
            for name in ["Pular", "Skip", "Continuar", "Next", "Avançar", "Finalizar"]:
                btn = page.get_by_role("button", name=name, exact=False)
                if await btn.count() > 0:
                    await btn.first.click()
                    await asyncio.sleep(0.7)

            steps.append(f"Lição {lesson_number}: atividade {activity} processada.")
            if activity in {1, 5, 10, 15}:
                shots.append(await self._shot(page, folder, f"06_licao_{lesson_number}_atividade_{activity}"))

            done = page.locator("text=/concluíd|completed|parabéns/i")
            if await done.count() > 0:
                shots.append(await self._shot(page, folder, f"07_licao_{lesson_number}_concluida"))
                steps.append(f"Lição {lesson_number} concluída.")
                break

            await asyncio.sleep(1)

    async def _shot(self, page: Page, folder: Path, name: str) -> Path:
        file_path = folder / f"{name}.png"
        await page.screenshot(path=str(file_path), full_page=True)
        return file_path
