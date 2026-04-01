import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { AppError } from '../../utils/http-errors.js';

const wsMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('subscribe.presence'), payload: z.object({ userId: z.string().min(1) }) }),
  z.object({ type: z.literal('host.heartbeat'), payload: z.object({ hostId: z.string().min(1), latencyMs: z.number().int().nonnegative() }) }),
]);

export async function presenceRoutes(app: FastifyInstance) {
  app.get('/ws/presence', { websocket: true }, (connection) => {
    let currentUserId: string | null = null;

    connection.on('message', async (raw) => {
      try {
        const data = wsMessageSchema.parse(JSON.parse(raw.toString()));

        if (data.type === 'subscribe.presence') {
          currentUserId = data.payload.userId;
          app.websocketServer.subscribeUser(currentUserId, connection.socket);
          connection.send(JSON.stringify({ type: 'presence.subscribed', payload: { userId: currentUserId } }));
          return;
        }

        const host = await app.prisma.hostDevice.findUnique({ where: { id: data.payload.hostId } });
        if (!host) throw new AppError('Host não encontrado', 404);

        await app.prisma.hostDevice.update({
          where: { id: host.id },
          data: { isOnline: true, lastSeenAt: new Date() },
        });

        app.websocketServer.broadcastToUser(host.userId, {
          type: 'host.presence.updated',
          payload: { hostId: host.id, isOnline: true, latencyMs: data.payload.latencyMs },
        });
      } catch (error) {
        connection.send(
          JSON.stringify({
            type: 'error',
            payload: { message: error instanceof Error ? error.message : 'Erro de websocket' },
          }),
        );
      }
    });

    connection.on('close', () => {
      if (currentUserId) {
        app.websocketServer.unsubscribeUser(currentUserId, connection.socket);
      }
    });
  });
}
