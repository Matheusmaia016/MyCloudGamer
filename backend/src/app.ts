import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import sensible from '@fastify/sensible';
import websocket from '@fastify/websocket';

import { env } from './config/env.js';
import { jwtConfig } from './config/jwt.js';
import { authPlugin } from './plugins/auth.js';
import { prismaPlugin } from './plugins/prisma.js';
import { authRoutes } from './modules/auth/routes.js';
import { userRoutes } from './modules/users/routes.js';
import { deviceRoutes } from './modules/devices/routes.js';
import { hostRoutes } from './modules/hosts/routes.js';
import { pairingRoutes } from './modules/pairing/routes.js';
import { gameRoutes } from './modules/games/routes.js';
import { libraryRoutes } from './modules/library/routes.js';
import { favoriteRoutes } from './modules/favorites/routes.js';
import { sessionRoutes } from './modules/sessions/routes.js';
import { connectionProfileRoutes } from './modules/connection-profiles/routes.js';
import { presenceRoutes } from './modules/presence/routes.js';
import { websocketRuntimePlugin } from './realtime/ws-plugin.js';
import { AppError } from './utils/http-errors.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    },
  });

  await app.register(cors, { origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN });
  await app.register(sensible);
  await app.register(jwt, jwtConfig);
  await app.register(websocket);
  await app.register(prismaPlugin);
  await app.register(authPlugin);
  await app.register(websocketRuntimePlugin);

  app.get('/health', async () => ({ ok: true, service: 'gamemirror-backend' }));

  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(deviceRoutes);
  await app.register(hostRoutes);
  await app.register(pairingRoutes);
  await app.register(gameRoutes);
  await app.register(libraryRoutes);
  await app.register(favoriteRoutes);
  await app.register(sessionRoutes);
  await app.register(connectionProfileRoutes);
  await app.register(presenceRoutes);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    if ('issues' in (error as any)) {
      return reply.status(400).send({ message: 'Payload inválido', details: (error as any).issues });
    }

    app.log.error(error);
    return reply.status(500).send({ message: 'Erro interno do servidor' });
  });

  return app;
}
