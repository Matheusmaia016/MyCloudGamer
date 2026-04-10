"""Fila de automações para processar usuários sem travar o bot."""

from __future__ import annotations

import asyncio
import contextlib
import logging
from dataclasses import dataclass
from typing import Awaitable, Callable


LOGGER = logging.getLogger("queue")


@dataclass(slots=True)
class AutomationJob:
    user_id: int
    source: str
    coro_factory: Callable[[], Awaitable[None]]


class AutomationQueue:
    def __init__(self) -> None:
        self.queue: asyncio.Queue[AutomationJob] = asyncio.Queue()
        self.worker_task: asyncio.Task | None = None

    async def start(self) -> None:
        if self.worker_task and not self.worker_task.done():
            return
        self.worker_task = asyncio.create_task(self._worker_loop(), name="automation-worker")

    async def stop(self) -> None:
        if self.worker_task:
            self.worker_task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self.worker_task

    async def enqueue(self, job: AutomationJob) -> int:
        await self.queue.put(job)
        return self.queue.qsize()

    async def _worker_loop(self) -> None:
        LOGGER.info("Worker da fila iniciado")
        while True:
            job = await self.queue.get()
            LOGGER.info("Executando job user=%s source=%s", job.user_id, job.source)
            try:
                await job.coro_factory()
            except Exception:  # noqa: BLE001
                LOGGER.exception("Falha ao processar job user=%s", job.user_id)
            finally:
                self.queue.task_done()
