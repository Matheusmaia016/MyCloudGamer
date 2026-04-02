import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../config/jwt.js';
import { AppError } from '../../utils/http-errors.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/signup', async (request, reply) => {
    const body = signupSchema.parse(request.body);

    const exists = await app.prisma.user.findUnique({ where: { email: body.email } });
    if (exists) throw new AppError('E-mail já cadastrado', 409);

    const user = await app.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash: hashPassword(body.password),
      },
    });

    const accessToken = await signAccessToken(reply, { sub: user.id, email: user.email });
    const refreshToken = await signRefreshToken(reply, { sub: user.id });

    return reply.status(201).send({ user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken });
  });

  app.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await app.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !verifyPassword(body.password, user.passwordHash)) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const accessToken = await signAccessToken(reply, { sub: user.id, email: user.email });
    const refreshToken = await signRefreshToken(reply, { sub: user.id });

    return reply.send({ user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken });
  });

  app.post('/auth/refresh', async (request, reply) => {
    const payload = await verifyRefreshToken(request);
    const user = await app.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new AppError('Usuário não encontrado', 404);

    const accessToken = await signAccessToken(reply, { sub: user.id, email: user.email });
    const refreshToken = await signRefreshToken(reply, { sub: user.id });

    return reply.send({ accessToken, refreshToken });
  });
}
