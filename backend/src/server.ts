import { buildApp } from './app.js';
import { env } from './config/env.js';

const bootstrap = async () => {
  const app = await buildApp();
  await app.listen({ host: env.HOST, port: env.PORT });
  app.log.info(`GameMirror backend running on ${env.HOST}:${env.PORT}`);
};

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
