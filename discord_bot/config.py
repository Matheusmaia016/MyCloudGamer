"""Configurações centrais do bot."""

from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(slots=True)
class Settings:
    discord_token: str = os.getenv("DISCORD_TOKEN", "")
    guild_id: int | None = int(os.getenv("DISCORD_GUILD_ID", "0")) or None
    database_path: str = os.getenv("DATABASE_PATH", "discord_bot/data.db")
    encryption_key_path: str = os.getenv("ENCRYPTION_KEY_PATH", "discord_bot/.secret.key")
    timezone: str = os.getenv("BOT_TIMEZONE", "America/Sao_Paulo")
    playwright_auto_install: bool = os.getenv("PLAYWRIGHT_AUTO_INSTALL", "1") == "1"
    headless: bool = os.getenv("PLAYWRIGHT_HEADLESS", "1") == "1"


settings = Settings()
