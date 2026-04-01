import { AgentService } from './services/agent.service.js';
import { logger } from './logger/index.js';

const agent = new AgentService();

const bootstrap = async () => {
  try {
    await agent.start();
  } catch (error) {
    logger.error({ error }, 'Falha ao iniciar host-agent');
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  logger.info('Recebido SIGINT, encerrando host-agent...');
  await agent.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Recebido SIGTERM, encerrando host-agent...');
  await agent.stop();
  process.exit(0);
});

void bootstrap();
