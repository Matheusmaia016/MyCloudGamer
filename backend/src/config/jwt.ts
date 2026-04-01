import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from './env.js';

export const jwtConfig = {
  secret: env.JWT_ACCESS_SECRET,
};

export const signAccessToken = async (reply: FastifyReply, payload: { sub: string; email: string }) =>
  reply.jwtSign(payload, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    sign: { key: env.JWT_ACCESS_SECRET },
  });

export const signRefreshToken = async (reply: FastifyReply, payload: { sub: string }) =>
  reply.jwtSign(payload, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    sign: { key: env.JWT_REFRESH_SECRET },
  });

export const verifyRefreshToken = async (request: FastifyRequest) => {
  const auth = request.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    throw new Error('Refresh token ausente');
  }

  const token = auth.slice('Bearer '.length);
  return request.server.jwt.verify<{ sub: string }>(token, { key: env.JWT_REFRESH_SECRET });
};
