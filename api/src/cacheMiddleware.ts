import { Request, Response, NextFunction } from 'express';
import redisClient from './redisClient';
import { logger } from './logger';

const cacheMiddleware = (duration: number) => async (req: Request, res: Response, next: NextFunction) => {
  // Usar a URL original como chave de cache
  const key = `cache:${req.originalUrl}`;

  try {
    const cachedResponse = await redisClient.get(key);

    if (cachedResponse) {
      logger.info(`Cache HIT para a chave: ${key}`);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Cache', 'HIT');
      return res.send(cachedResponse);
    }

    logger.info(`Cache MISS para a chave: ${key}`);
    res.setHeader('X-Cache', 'MISS');

    // Sobrescrever res.send para interceptar a resposta
    const originalSend = res.send.bind(res);
    res.send = (body: any): Response<any> => {
      try {
        // Salvar a resposta no Redis com o tempo de expiração (TTL)
        redisClient.set(key, body, 'EX', duration);
        logger.info(`Resposta para a chave ${key} armazenada no cache por ${duration} segundos.`);
      } catch (err) {
        logger.error(`Erro ao salvar no cache: ${err}`);
      }
      return originalSend(body);
    };

    next();

  } catch (err) {
    logger.error(`Erro no middleware de cache: ${err}`);
    // Se o Redis falhar, simplesmente prosseguir sem cache
    next();
  }
};

export default cacheMiddleware;
