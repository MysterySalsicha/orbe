// api/src/syncMovies.ts

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
import { tmdb } from './clients';
import { MovieDb } from 'moviedb-promise';

const prisma = new PrismaClient();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function syncMovies() {
  logger.info('🎬 Iniciando sincronização de filmes...');
  try {
    const upcomingMovies = await tmdb.movieUpcoming({ page: 1 });
    const moviesToProcess = upcomingMovies.results || [];
    const totalMovies = moviesToProcess.length;

    logger.info(`Encontrados ${totalMovies} filmes para processar.`);

    let processedCount = 0;
    for (const movieSummary of moviesToProcess) {
      processedCount++;
      try {
        if (!movieSummary.id) {
          logger.warn(`Filme sem ID encontrado, pulando. Título: ${movieSummary.title}`);
          continue;
        }

        logger.info(
          `(${processedCount}/${totalMovies}) Processando filme ID: ${movieSummary.id} - "${movieSummary.title}"`,
        );

        const movieDetails = await tmdb.movieInfo({
          id: movieSummary.id,
          append_to_response: 'credits',
        });

        const validCast = movieDetails.credits?.cast?.filter(p => p.id && p.name) ?? [];
        const crewData = movieDetails.credits?.crew?.filter(p => p.id && p.name && p.job) ?? [];

        // **A CORREÇÃO PRINCIPAL ESTÁ AQUI**
        // Removemos membros duplicados da equipe (mesma pessoa com a mesma função).
        // Isso garante que a chave única (filme_id, pessoa_id, funcao) não seja violada.
        const uniqueCrew = crewData.reduce((acc, current) => {
          const key = `${current.id}-${current.job}`;
          if (!acc.find(item => `${item.id}-${item.job}` === key)) {
            acc.push(current);
          }
          return acc;
        }, [] as typeof crewData);


        await prisma.filme.upsert({
          where: { id: movieDetails.id },
          update: {
            titulo_api: movieDetails.title,
            poster_url_api: movieDetails.poster_path,
            data_lancamento_api: movieDetails.release_date ? new Date(movieDetails.release_date) : null,
            sinopse_api: movieDetails.overview,
            avaliacao_api: movieDetails.vote_average,
            // A lógica de update não precisa recriar relações, apenas os campos do filme
          },
          create: {
            id: movieDetails.id!,
            titulo_api: movieDetails.title,
            poster_url_api: movieDetails.poster_path,
            data_lancamento_api: movieDetails.release_date ? new Date(movieDetails.release_date) : null,
            sinopse_api: movieDetails.overview,
            generos_api: movieDetails.genres,
            duracao: movieDetails.runtime,
            avaliacao_api: movieDetails.vote_average,

            elenco: {
              create: validCast.map(ator => ({
                personagem: ator.character ?? 'N/A',
                pessoa: {
                  connectOrCreate: {
                    where: { id: ator.id! },
                    create: {
                      id: ator.id!,
                      nome: ator.name!,
                      foto_url: ator.profile_path,
                    },
                  },
                },
              })),
            },

            // Usamos a lista de equipe já filtrada e sem duplicatas
            equipe: {
              create: uniqueCrew.map(membro => ({
                funcao: membro.job!,
                pessoa: {
                  connectOrCreate: {
                    where: { id: membro.id! },
                    create: {
                      id: membro.id!,
                      nome: membro.name!,
                      foto_url: membro.profile_path,
                    },
                  },
                },
              })),
            },
          },
        });

        logger.info(
          `✅ Filme [${movieDetails.id}] "${movieDetails.title}" sincronizado.`,
        );

        await delay(250);

      } catch (error) {
        logger.error(
          `❌ Erro ao processar o filme ID ${movieSummary.id}. Pulando.`,
          error,
        );
      }
    }

    logger.info('✅ Sincronização de filmes concluída!');
  } catch (error) {
    logger.error('🚨 Erro fatal durante a sincronização de filmes:', error);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncMovies();