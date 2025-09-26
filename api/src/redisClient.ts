import Redis from 'ioredis';
import { logger } from './logger';

// A URL de conexão deve ser armazenada em variáveis de ambiente em um ambiente de produção
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redisClient = new Redis(redisUrl);

redisClient.on('connect', () => {
  logger.info('Conectado ao Redis com sucesso.');
});

redisClient.on('error', (err) => {
  logger.error('Não foi possível conectar ao Redis:', err);
});

export default redisClient;
