import type { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { AppError } from '../../utils/http-errors.js';

const confirmSchema = z.object({
  code: z.string().length(6),
  hostName: z.string().min(2),
  os: z.string().min(2),
  uniqueKey: z.string().min(4),
});

export async function pairingRoutes(app: FastifyInstance) {
  app.post('/pairing/start', { preHandler: [app.authenticate] }, async (request: any, reply) => {
    const code = nanoid(6).toUpperCase();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    const pairing = await app.prisma.pairingCode.create({
      data: {
        userId: request.user.sub,
        code,
        expiresAt,
      },
    });

    return reply.status(201).send({ pairingId: pairing.id, code: pairing.code, expiresAt: pairing.expiresAt });
  });

  app.post('/pairing/confirm', async (request, reply) => {
    const body = confirmSchema.parse(request.body);

    const pairing = await app.prisma.pairingCode.findUnique({ where: { code: body.code } });
    if (!pairing) throw new AppError('Código inválido', 404);
    if (pairing.consumedAt) throw new AppError('Código já utilizado', 409);
    if (pairing.expiresAt < new Date()) throw new AppError('Código expirado', 410);

    const existingHost = await app.prisma.hostDevice.findUnique({ where: { uniqueKey: body.uniqueKey } });
    if (existingHost && existingHost.userId !== pairing.userId) {
      throw new AppError('Este host já está pareado com outro usuário', 409);
    }

    const host = existingHost
      ? await app.prisma.hostDevice.update({
          where: { id: existingHost.id },
          data: { name: body.hostName, os: body.os, userId: pairing.userId, isOnline: true, lastSeenAt: new Date() },
        })
      : await app.prisma.hostDevice.create({
          data: {
            userId: pairing.userId,
            name: body.hostName,
            os: body.os,
            uniqueKey: body.uniqueKey,
            isOnline: true,
            lastSeenAt: new Date(),
          },
        });

    await app.prisma.pairingCode.update({ where: { id: pairing.id }, data: { consumedAt: new Date(), hostId: host.id } });

    app.websocketServer.broadcastToUser(pairing.userId, {
      type: 'host.paired',
      payload: { hostId: host.id, hostName: host.name },
    });

    return reply.send({ host });
  });
}
