"""Utilitários de criptografia para armazenar credenciais com segurança."""

from __future__ import annotations

from pathlib import Path

from cryptography.fernet import Fernet


def load_or_create_key(path: str) -> bytes:
    """Carrega uma chave existente ou cria uma nova no primeiro boot."""
    key_path = Path(path)
    key_path.parent.mkdir(parents=True, exist_ok=True)

    if key_path.exists():
        return key_path.read_bytes()

    key = Fernet.generate_key()
    key_path.write_bytes(key)
    return key


class CryptoManager:
    """Wrapper simples para encriptar/decriptar texto com Fernet."""

    def __init__(self, key: bytes) -> None:
        self._fernet = Fernet(key)

    def encrypt(self, raw_text: str) -> str:
        return self._fernet.encrypt(raw_text.encode("utf-8")).decode("utf-8")

    def decrypt(self, encrypted_text: str) -> str:
        return self._fernet.decrypt(encrypted_text.encode("utf-8")).decode("utf-8")
