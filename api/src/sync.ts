import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from './clients';


import { syncMovies } from './syncMovies';
import { syncSeries } from './syncSeries';
import { syncAnimes } from './syncAnimes';
import { syncGames } from './syncGames';
import { logger } from './logger';

const main = async () => {
  const startDate = process.argv[2];
  const endDate = process.argv[3];
  const limit = process.argv[4] && process.argv[4] !== 'undefined' ? parseInt(process.argv[4]) : undefined;
  const specificSeason = process.argv[5] as 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' | undefined;

  if (!startDate || !endDate) {
    logger.error('Uso: ts-node src/sync.ts <startDate> <endDate> [limit] [season]');
    process.exit(1);
  }

  logger.info(`Iniciando sincronização de dados de ${startDate} a ${endDate}...`);

  try {
    logger.info(`

------------- FILMES ----------
`);
    await syncMovies(prisma, startDate, endDate, limit);
    logger.info(`--- Sincronização de FILMES concluída ---\n\n`);

    logger.info(`

------------- SÉRIES ----------
`);
    await syncSeries(prisma, startDate, endDate, limit);
    logger.info(`--- Sincronização de SÉRIES concluída ---\n\n`);

    logger.info(`

------------- ANIMES ----------
`);
    const seasonsToSync = specificSeason ? [specificSeason] : ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    for (let year = startYear; year <= endYear; year++) {
        logger.info(`Sincronizando animes para o ano ${year} (Estações: ${seasonsToSync.join(', ')})...`);
        await syncAnimes(year, seasonsToSync, limit);
    }
    logger.info(`--- Sincronização de ANIMES concluída ---\n\n`);

    logger.info(`

------------- JOGOS ----------
`);
    await syncGames(prisma, startDate, endDate, limit);
    logger.info(`--- Sincronização de JOGOS concluída ---\n\n`);

    logger.info(`

✅ Sincronização de dados completa.
`);
  } catch (error) {
    logger.error(`Erro fatal na sincronização: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  main();
}