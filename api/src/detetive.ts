import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from './logger';
import axios from 'axios';

const prisma = new PrismaClient();

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
};

async function validateIngressoLink(movie: { id: number; title: string }): Promise<string | null> {
    const slug = slugify(movie.title);
    const url = `https://www.ingresso.com/filme/${slug}`;
    try {
        // Usamos um HEAD request para ser mais rápido e economizar dados
        await axios.head(url, { timeout: 5000 });
        logger.info(`Link da Ingresso.com validado para "${movie.title}": ${url}`);
        return url;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            logger.warn(`Link da Ingresso.com não encontrado para "${movie.title}" (404).`);
        } else {
            logger.error(`Erro ao validar link da Ingresso.com para "${movie.title}":`, error.message);
        }
        return null;
    }
}

export async function runDetetiveDigital() {
  logger.info('Iniciando Detetive Digital: Validação de links da Ingresso.com...');

  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

  try {
    const moviesToValidate = await prisma.filme.findMany({
      where: {
        ingresso_link: null,
        data_lancamento_api: {
          lte: twoMonthsFromNow,
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      } as Prisma.FilmeWhereInput,
      select: { id: true, tmdbId: true, title: true, releaseDate: true },
    });

    if (moviesToValidate.length === 0) {
      logger.info('Nenhum filme encontrado para validar links da Ingresso.com.');
      return;
    }

    for (const movie of moviesToValidate) {
      const ingressoLink = await validateIngressoLink(movie);
      if (ingressoLink) {
        await prisma.filme.update({
          where: { id: movie.id },
          data: {
            ingresso_link: ingressoLink,
            ultima_verificacao_ingresso: new Date(),
          },
        });
        logger.info(`Link da Ingresso.com salvo para "${movie.title}".`);
      } else {
        // Criar notificação para o admin
        await prisma.notification.create({
          data: {
            userId: 1, // Assumindo que o admin tem userId = 1
            type: 'FALHA_LINK_INGRESSO',
            message: `Link do Ingresso.com não encontrado para: "${movie.title}" (TMDB ID: ${movie.tmdbId})`,
            relatedMediaId: movie.tmdbId,
            relatedMediaType: 'filme',
          },
        });
        logger.warn(`Notificação de falha de link criada para "${movie.title}".`);
      }
      await delay(500); // Pausa para não sobrecarregar o ingresso.com
    }

    logger.info('Detetive Digital: Validação de links concluída.');

  } catch (error) {
    logger.error('Erro no Detetive Digital (validação de links):', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runDetetiveDigital();
}
