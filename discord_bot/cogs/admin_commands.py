"""Comandos administrativos (ex.: canal de logs)."""

from __future__ import annotations

from typing import TYPE_CHECKING

import discord
from discord import app_commands
from discord.ext import commands

if TYPE_CHECKING:
    from bot import SpeakBot


class AdminCommands(commands.Cog):
    def __init__(self, bot: "SpeakBot") -> None:
        self.bot = bot

    @app_commands.command(name="config_logs", description="Define o canal para logs do bot")
    @app_commands.checks.has_permissions(administrator=True)
    async def config_logs(self, interaction: discord.Interaction, canal: discord.TextChannel) -> None:
        await self.bot.db.set_config("log_channel_id", str(canal.id))
        await interaction.response.send_message(
            f"✅ Canal de logs configurado para {canal.mention}.",
            ephemeral=True,
        )


async def setup(bot: "SpeakBot") -> None:
    await bot.add_cog(AdminCommands(bot))
