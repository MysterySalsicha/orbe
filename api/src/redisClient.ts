import Redis from 'ioredis';
import { logger } from './logger';

// A URL de conexão deve ser armazenada em variáveis de ambiente em um ambiente de produção
const redisUrl = process.env.REDIS_URL;

let redisClient: Redis | null = null;

if (redisUrl) {
  redisClient = new Redis(redisUrl);

  redisClient.on('connect', () => {
    logger.info('Conectado ao Redis com sucesso.');
  });

  redisClient.on('error', (err) => {
    logger.error('Não foi possível conectar ao Redis:', err);
    redisClient = null; // Definir como null em caso de erro de conexão
  });
} else {
  logger.warn('REDIS_URL não está definido. O cache Redis será desabilitado.');
}

export default redisClient;
