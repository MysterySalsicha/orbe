/*
import { prisma } from './clients';
import { logger } from './logger';
import { Browser } from 'puppeteer';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function prismaUpdateWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 5,
  initialDelay = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      if (error.message.includes('Server has closed the connection')) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        const delayTime = initialDelay * Math.pow(2, attempt);
        logger.warn(`Prisma update failed due to connection loss. Retrying in ${delayTime}ms... (Attempt ${attempt}/${maxRetries})`);
        await delay(delayTime);
        // Reconnect Prisma client if necessary, though it often handles this internally
        await prisma.$disconnect();
        await prisma.$connect();
      } else {
        throw error;
      }
    }
  }
  throw new Error("Maximum retries reached for Prisma update.");
}

function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

async function runDetetive() {
  let browser: Browser | undefined;
  try {
    logger.info('--- Iniciando Detetive Digital ---');
    
    const startDate = new Date('2025-08-01');
    const endDate = new Date('2026-12-31');

    const targetMovies = await prisma.filme.findMany({
      where: {
        releaseDate: {
          gte: startDate,
          lte: endDate,
        },
        OR: [
          { voteCount: { gt: 25 } },
          { popularity: { gt: 10 } }
        ]
      },
    });

    logger.info(`Encontrados ${targetMovies.length} filmes para verificar.`);

    if (targetMovies.length === 0) return;

    browser = await puppeteer.launch();

    for (const filme of targetMovies) {
      try {
        if (!filme.title) {
          logger.info(`❌ Pulando filme ID ${filme.id} por falta de título.`);
          continue;
        }

        logger.info(`Verificando filme: "${filme.title}"`);
        
        const slug = slugify(filme.title);
        const directUrl = `https://www.ingresso.com/filme/${slug}`;

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        const response = await page.goto(directUrl, { waitUntil: 'networkidle2' });

        if (response && response.ok()) {
          const pageContent = await page.content();
          const hasNoSessionsText = pageContent.includes('Não há sessões disponíveis no momento.');

          const isPreSale = await page.evaluate(() => {
            const posterElement = document.querySelector('div[data-testid="movie-poster"]');
            if (!posterElement) {
              return false;
            }
            
            const style = window.getComputedStyle(posterElement, '::after');
            const content = style.getPropertyValue('content');
            
            return content.includes('pré-venda');
          });

          await prismaUpdateWithRetry(() => prisma.filme.update({
            where: { id: filme.id },
            data: {
              ingresso_link: directUrl,
              ultima_verificacao_ingresso: new Date(),
              em_prevenda: isPreSale,
              tem_sessoes: !hasNoSessionsText, // Adicionado
            },
          }));
          const logMessage = filme.ingresso_link
            ? `🔄 Link existente para "${filme.title}" (Pré-venda: ${isPreSale}, Sessões: ${!hasNoSessionsText}) revisitado.`
            : `✨ Novo link encontrado para "${filme.title}" (Pré-venda: ${isPreSale}, Sessões: ${!hasNoSessionsText}).`;
          logger.info(logMessage);
        } else {
           logger.info(`❌ Nenhum link direto encontrado para "${filme.title}"`);
        }
        await page.close();
      
      } catch (error: any) {
        if (error.message.includes('404')) {
          logger.info(`❌ Nenhum link direto encontrado para "${filme.title}" (Página 404).`);
        } else {
          logger.error(`Erro ao verificar o filme "${filme.title}":`, error.message);
        }
      } finally {
        await delay(3000);
      }
    }
  } catch (e: any) {
    logger.error("Erro fatal no Detetive Digital:", e.message);
  } finally {
    if (browser) {
      await browser.close();
    }
    await prisma.$disconnect();
    logger.info('--- Detetive Digital finalizado ---');
  }
}

runDetetive();
*/