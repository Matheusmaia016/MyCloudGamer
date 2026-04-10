"""Arquivo principal do bot Discord para automação Speak."""

from __future__ import annotations

import asyncio
import logging
import subprocess
from pathlib import Path

import discord
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from discord.ext import commands

from automation import SpeakAutomation
from config import settings
from database import Database
from queue_manager import AutomationJob, AutomationQueue
from security import CryptoManager, load_or_create_key


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
LOGGER = logging.getLogger("bot")


class SpeakBot(commands.Bot):
    def __init__(self) -> None:
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(command_prefix="!", intents=intents)

        self.db = Database(settings.database_path)
        key = load_or_create_key(settings.encryption_key_path)
        self.crypto = CryptoManager(key)
        self.automation = SpeakAutomation(headless=settings.headless)
        self.automation_queue = AutomationQueue()
        self.scheduler = AsyncIOScheduler(timezone=settings.timezone)

    async def setup_hook(self) -> None:
        await self.db.init()
        await self._ensure_playwright_install()
        await self.automation_queue.start()

        await self.load_extension("cogs.user_commands")
        await self.load_extension("cogs.admin_commands")

        self.scheduler.add_job(
            self.enqueue_weekly_jobs,
            trigger=CronTrigger(day_of_week="mon", hour=8, minute=0, timezone=settings.timezone),
            id="weekly_lessons",
            replace_existing=True,
        )
        self.scheduler.start()

        synced = await self.tree.sync(guild=discord.Object(id=settings.guild_id)) if settings.guild_id else await self.tree.sync()
        LOGGER.info("Slash commands sincronizados: %s", len(synced))

    async def on_ready(self) -> None:
        LOGGER.info("Bot online como %s (%s)", self.user, self.user.id if self.user else "sem-id")

    async def _ensure_playwright_install(self) -> None:
        if not settings.playwright_auto_install:
            return
        LOGGER.info("Verificando browsers do Playwright...")
        cmd = ["python", "-m", "playwright", "install", "chromium"]
        await asyncio.to_thread(subprocess.run, cmd, check=False)

    async def enqueue_weekly_jobs(self) -> None:
        users = await self.db.get_all_users()
        LOGGER.info("Agendamento semanal iniciado para %s usuário(s)", len(users))
        for user in users:
            user_id = int(user["user_id"])

            async def _run(uid: int = user_id) -> None:
                await self.execute_for_user(uid, requested_by=None)

            await self.automation_queue.enqueue(AutomationJob(user_id=user_id, source="weekly", coro_factory=_run))

    async def execute_for_user(self, user_id: int, requested_by: int | None) -> None:
        user = await self.db.get_user(user_id)
        if not user:
            LOGGER.warning("Usuário %s sem cadastro ao executar.", user_id)
            return

        login = user["login"]
        password = self.crypto.decrypt(user["encrypted_password"])

        result = await self.automation.run_for_user(user_id=user_id, login=login, password=password)
        await self.db.update_run_status(user_id, result.message)

        await self._notify_user(user_id, result, requested_by)
        await self._send_logs_channel(user_id, result)

    async def _notify_user(self, user_id: int, result, requested_by: int | None) -> None:
        user = await self.fetch_user(user_id)
        if not user:
            return

        title = "✅ Automação concluída" if result.success else "⚠️ Automação finalizada com erro"
        description = result.message
        if requested_by and requested_by == user_id:
            description = f"(Execução manual) {description}"

        embed = discord.Embed(title=title, description=description, color=discord.Color.blue())
        if result.steps:
            embed.add_field(name="Resumo", value="\n".join(result.steps[-8:])[:1024], inline=False)

        files = [discord.File(path) for path in result.screenshots[:10] if Path(path).exists()]
        await user.send(embed=embed, files=files)

    async def _send_logs_channel(self, user_id: int, result) -> None:
        log_channel_id = await self.db.get_config("log_channel_id")
        if not log_channel_id:
            return

        channel = self.get_channel(int(log_channel_id))
        if channel is None or not isinstance(channel, discord.TextChannel):
            return

        status = "SUCESSO" if result.success else "ERRO"
        content = f"[{status}] user_id={user_id} | {result.message}"
        await channel.send(content)


def main() -> None:
    if not settings.discord_token:
        raise RuntimeError("Defina DISCORD_TOKEN no arquivo .env")

    Path("discord_bot/temp_screenshots").mkdir(parents=True, exist_ok=True)
    bot = SpeakBot()
    bot.run(settings.discord_token)


if __name__ == "__main__":
    main()
