import { logger } from '../logger/index.js';
import type { HostGame } from '../types/index.js';

/**
 * Base preparada para Sunshine:
 * - hoje retorna biblioteca mock
 * - no futuro, substituir por scanner real de jogos instalados e integração com launcher/encoder
 */
export class GamesService {
  private readonly games: HostGame[] = [
    { id: 'game-cyber', title: 'Cyber Sprint 2077', genre: 'RPG', executablePath: 'C:/Games/CyberSprint2077/cyber.exe' },
    { id: 'game-shadow', title: 'Shadow Arena', genre: 'Action', executablePath: 'D:/Games/ShadowArena/shadow.exe' },
    { id: 'game-skyline', title: 'Skyline Drift', genre: 'Racing', executablePath: 'D:/Games/SkylineDrift/drift.exe' },
  ];

  public listLibrary(): HostGame[] {
    logger.info({ total: this.games.length }, 'Biblioteca mock carregada');
    return this.games;
  }
}
