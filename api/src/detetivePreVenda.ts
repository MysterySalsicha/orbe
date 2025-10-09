import { prisma } from './clients';
import { logger } from './logger';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { broadcast } from './index';



async function checkPreSaleStatus() {
  logger.info('Iniciando Detetive Digital: Verificação de status de pré-venda...');

  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const moviesToCheck = await prisma.filme.findMany({
      where: {
        ingresso_link: { not: null },
        releaseDate: { 
          lte: oneMonthFromNow, // Filmes que lançam em até 1 mês
          gte: today, // E que ainda não lançaram
        },
      },
      select: { id: true, tmdbId: true, title: true, ingresso_link: true, em_prevenda: true, releaseDate: true },
    });

    if (moviesToCheck.length === 0) {
      logger.info('Nenhum filme encontrado para verificar status de pré-venda.');
      return;
    }

    for (const movie of moviesToCheck) {
      if (!movie.ingresso_link) continue; // Garantir que o link existe

      try {
        const response = await axios.get(movie.ingresso_link, { timeout: 10000 });
        const $ = cheerio.load(response.data);

        // TODO: Este seletor é um exemplo e precisa ser ajustado para o HTML real do ingresso.com
        // Exemplo: verificar se um botão de compra está ativo ou se um texto de pré-venda existe
        const isPreSaleElement = $('button.buy-ticket-button:not([disabled])').length > 0 || $('span:contains("Pré-venda")').length > 0;
        const newPreSaleStatus = isPreSaleElement;

        if (newPreSaleStatus !== movie.em_prevenda) {
          await prisma.filme.update({
            where: { id: movie.id },
            data: {
              em_prevenda: newPreSaleStatus,
              ultima_verificacao_ingresso: new Date(),
            },
          });
          logger.info(`Status de pré-venda para "${movie.title}" atualizado para: ${newPreSaleStatus}.`);

          // Notificar usuários se a pré-venda foi ativada
          if (newPreSaleStatus === true) {
            // TODO: Criar notificação para usuários que favoritaram o filme
            broadcast({ type: 'PRE_VENDA_DISPONIVEL', mediaType: 'filme', data: movie });
          }
        } else {
            await prisma.filme.update({
                where: { id: movie.id },
                data: {
                    ultima_verificacao_ingresso: new Date(),
                },
            });
        }

      } catch (error: any) {
        logger.error(`Erro ao verificar pré-venda para "${movie.title}" (${movie.ingresso_link}):`, error.message);
      }
    }

    // Lógica para desativar pré-venda se a data de lançamento já passou
    const releasedMovies = await prisma.filme.findMany({
        where: {
            em_prevenda: true,
            releaseDate: { lte: today },
        },
        select: { id: true, title: true },
    });

    for (const movie of releasedMovies) {
        await prisma.filme.update({
            where: { id: movie.id },
            data: { em_prevenda: false },
        });
        logger.info(`Pré-venda para "${movie.title}" desativada (data de lançamento passada).`);
    }

    logger.info('Detetive Digital: Verificação de status de pré-venda concluída.');

  } catch (error) {
    logger.error('Erro no Detetive Digital (verificação de pré-venda):', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  checkPreSaleStatus();
}
