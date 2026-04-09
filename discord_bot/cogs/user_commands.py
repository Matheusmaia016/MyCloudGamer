"""Comandos de usuário: setup, status, remover e fazer lições."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

import discord
from discord import app_commands
from discord.ext import commands

from queue_manager import AutomationJob

if TYPE_CHECKING:
    from bot import SpeakBot


LOGGER = logging.getLogger("user_commands")


class SetupModal(discord.ui.Modal, title="Configurar credenciais Speak"):
    login = discord.ui.TextInput(
        label="E-mail ou usuário",
        placeholder="seu@email.com",
        required=True,
        max_length=120,
    )
    password = discord.ui.TextInput(
        label="Senha",
        style=discord.TextStyle.short,
        placeholder="Sua senha",
        required=True,
        max_length=120,
    )

    def __init__(self, bot: "SpeakBot") -> None:
        super().__init__(timeout=300)
        self.bot = bot

    async def on_submit(self, interaction: discord.Interaction) -> None:
        assert interaction.user is not None
        encrypted = self.bot.crypto.encrypt(str(self.password))
        await self.bot.db.upsert_user_credentials(interaction.user.id, str(self.login), encrypted)
        await interaction.response.send_message(
            "✅ Credenciais salvas com segurança. Use `/fazer_licoes` para executar quando quiser.",
            ephemeral=True,
        )


class UserCommands(commands.Cog):
    def __init__(self, bot: "SpeakBot") -> None:
        self.bot = bot

    @app_commands.command(name="setup", description="Configura login e senha da Sala do Futuro/Speak")
    async def setup_slash(self, interaction: discord.Interaction) -> None:
        await interaction.response.send_modal(SetupModal(self.bot))

    @commands.command(name="setup")
    async def setup_prefix(self, ctx: commands.Context) -> None:
        await ctx.reply("Para segurança, use o slash command `/setup` (abre formulário privado).")

    @app_commands.command(name="status", description="Mostra estado do seu cadastro e última execução")
    async def status_slash(self, interaction: discord.Interaction) -> None:
        assert interaction.user is not None
        user = await self.bot.db.get_user(interaction.user.id)
        if not user:
            await interaction.response.send_message("Você ainda não possui credenciais salvas.", ephemeral=True)
            return

        msg = (
            "✅ Você tem credenciais salvas.\n"
            f"• Última execução: `{user.get('last_run_at') or 'nunca'}`\n"
            f"• Último status: `{user.get('last_status') or 'sem histórico'}`"
        )
        await interaction.response.send_message(msg, ephemeral=True)

    @app_commands.command(name="remover", description="Apaga suas credenciais salvas")
    async def remove_slash(self, interaction: discord.Interaction) -> None:
        assert interaction.user is not None
        await self.bot.db.delete_user(interaction.user.id)
        await interaction.response.send_message("🗑️ Suas credenciais foram removidas.", ephemeral=True)

    @app_commands.command(name="fazer_licoes", description="Executa agora a automação das suas lições")
    async def do_lessons_slash(self, interaction: discord.Interaction) -> None:
        assert interaction.user is not None
        user = await self.bot.db.get_user(interaction.user.id)
        if not user:
            await interaction.response.send_message(
                "Você precisa configurar suas credenciais primeiro com `/setup`.",
                ephemeral=True,
            )
            return

        await interaction.response.send_message("⏳ Sua automação entrou na fila.", ephemeral=True)

        async def _run() -> None:
            await self.bot.execute_for_user(interaction.user.id, requested_by=interaction.user.id)

        pos = await self.bot.automation_queue.enqueue(
            AutomationJob(user_id=interaction.user.id, source="manual", coro_factory=_run)
        )
        LOGGER.info("Usuário %s entrou na fila na posição %s", interaction.user.id, pos)

    @commands.command(name="fazer_licoes")
    async def do_lessons_prefix(self, ctx: commands.Context) -> None:
        await ctx.reply("Use o slash command `/fazer_licoes` para iniciar sua automação.")


async def setup(bot: "SpeakBot") -> None:
    await bot.add_cog(UserCommands(bot))
