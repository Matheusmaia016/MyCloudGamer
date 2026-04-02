import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  AGENT_NAME: z.string().default('GameMirror Host Agent'),
  BACKEND_URL: z.string().url(),
  AGENT_PORT: z.coerce.number().default(7878),
  PAIRING_CODE: z.string().default(''),
  HOST_UNIQUE_KEY: z.string().min(4),
  HOST_OS: z.string().default(process.platform),
  HEARTBEAT_INTERVAL_MS: z.coerce.number().min(1000).default(5000),
  GAME_SCAN_DIRS: z.string().default('C:/Games;D:/Games'),
  GAME_EXTENSIONS: z.string().default('.exe;.lnk;.url'),
});

export const env = envSchema.parse(process.env);
