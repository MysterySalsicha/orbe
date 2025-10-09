import { Router, Request, Response, NextFunction, json } from 'express';
import { prisma } from './clients';
import crypto from 'crypto';
import { logger } from './logger';


const router = Router();

const WEBHOOK_SECRET = process.env.IGDB_WEBHOOK_SECRET || 'um-segredo-muito-dificil-de-adivinhar';

// Middleware para verificar a assinatura do webhook usando o corpo bruto (raw body)
const verifyWebhookSignature = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.header('Twitch-Eventsub-Message-Signature');
  const messageId = req.header('Twitch-Eventsub-Message-Id');
  const timestamp = req.header('Twitch-Eventsub-Message-Timestamp');
  
  // req.body aqui é um Buffer, graças ao express.raw()
  const rawBody = (req as any).rawBody;

  if (!signature || !messageId || !timestamp || !rawBody) {
    logger.warn('Requisição de webhook da IGDB recebida sem headers de assinatura ou corpo.');
    return res.status(403).send('Assinatura inválida.');
  }

  const computedSignature = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(messageId + timestamp + rawBody)
    .digest('hex');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
    next();
  } else {
    logger.warn('Assinatura de webhook da IGDB inválida.');
    res.status(403).send('Falha na verificação da assinatura.');
  }
};

// Endpoint que recebe as notificações do IGDB
router.post('/webhooks/igdb', json({ verify: (req: any, res, buf) => { req.rawBody = buf } }), (req, res, next) => {
  // A primeira chamada do IGDB é um desafio de verificação
  if (req.header('Twitch-Eventsub-Message-Type') === 'webhook_callback_verification') {
    const challenge = req.body.challenge;
    logger.info('Recebido desafio de verificação de webhook da IGDB. Respondendo com sucesso.');
    return res.status(200).send(challenge);
  }

  // Para todas as outras chamadas (notificações), verificar a assinatura primeiro
  verifyWebhookSignature(req, res, next);
}, async (req, res) => {
  const notification = req.body;

  // Se for uma notificação de revogação, apenas logamos
  if (req.header('Twitch-Eventsub-Message-Type') === 'revocation') {
    logger.warn('Webhook da IGDB foi revogado!', notification.subscription);
    return res.status(200).send('OK');
  }

  // Processar a notificação de atualização do jogo
  if (notification.event && notification.subscription.type === 'games.update') {
    const gameData = notification.event.game;
    logger.info(`Webhook da IGDB recebido para o jogo ID: ${gameData.id}`);

    try {
      // Aqui, teríamos que mapear os dados do webhook para o nosso schema do Prisma
      // e então usar o prisma.jogo.upsert()
      // Exemplo simplificado:
      /*
      await prisma.jogo.upsert({
        where: { igdbId: gameData.id },
        update: { name: gameData.name, summary: gameData.summary },
        create: { igdbId: gameData.id, name: gameData.name, summary: gameData.summary },
      });
      */
      logger.info(`Jogo ID: ${gameData.id} processado via webhook com sucesso.`);

      // TODO: Disparar notificação interna via WebSocket para o frontend

    } catch (error) {
      logger.error(`Erro ao processar webhook da IGDB para o jogo ID ${gameData.id}:`, error);
    }
  }

  res.status(200).send('OK');
});

export default router;
