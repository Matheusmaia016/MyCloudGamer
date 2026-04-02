import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { env } from '../config/env.js';
import { logger } from '../logger/index.js';
import type { HostGame } from '../types/index.js';

const MAX_SCAN_DEPTH = 4;

const toGameId = (filePath: string) => createHash('md5').update(filePath).digest('hex').slice(0, 12);

const guessGenre = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('racing') || lower.includes('drift')) return 'Racing';
  if (lower.includes('arena') || lower.includes('shooter')) return 'Action';
  if (lower.includes('rpg') || lower.includes('quest')) return 'RPG';
  return 'General';
};

export class GamesService {
  private readonly scanDirs = env.GAME_SCAN_DIRS.split(';').map((item) => item.trim()).filter(Boolean);
  private readonly allowedExtensions = env.GAME_EXTENSIONS.split(';').map((item) => item.trim().toLowerCase()).filter(Boolean);

  private async walk(dir: string, depth = 0): Promise<string[]> {
    if (depth > MAX_SCAN_DEPTH) return [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files: string[] = [];

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          files.push(...(await this.walk(fullPath, depth + 1)));
          continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (this.allowedExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }

      return files;
    } catch {
      return [];
    }
  }

  public async listLibrary(): Promise<HostGame[]> {
    const executablePaths = (await Promise.all(this.scanDirs.map((dir) => this.walk(dir)))).flat();

    const games = executablePaths.map((executablePath) => {
      const basename = path.basename(executablePath, path.extname(executablePath));
      return {
        id: `game-${toGameId(executablePath)}`,
        title: basename,
        genre: guessGenre(basename),
        executablePath,
      } satisfies HostGame;
    });

    logger.info({ total: games.length, scanDirs: this.scanDirs }, 'Biblioteca detectada por diretórios configuráveis');

    return games;
  }
}
