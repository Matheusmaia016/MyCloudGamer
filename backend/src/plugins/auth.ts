import fp from 'fastify-plugin';

export const authPlugin = fp(async (app) => {
  app.decorate('authenticate', async function authenticate(request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      return reply.unauthorized('Token inválido ou expirado');
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}
