import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { logger } from './logger';
import { tmdb, tmdbApi } from './clients';
import { Cast, Crew } from 'moviedb-promise';
import { PrismaClient } from '@prisma/client';
import { prisma } from './clients';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function tmdbApiWithRetry<T>(fn: () => Promise<T>, maxApiRetries = 5, maxNetworkRetries = Infinity, initialDelay = 1000): Promise<T> {
    let apiAttempt = 0;
    let networkAttempt = 0;
    while (true) { // Loop infinito, será interrompido em caso de sucesso ou erro não-rede
        try {
            return await fn();
        } catch (error: any) {
            const isNetworkError = error.code === 'ENOTFOUND' || error.code === 'ECONNRESET';
            const isRateLimitError = error.response && error.response.status === 429;

            if (isNetworkError) {
                networkAttempt++;
                if (networkAttempt > maxNetworkRetries) {
                    logger.error(`❌ Erro de rede persistente após ${maxNetworkRetries} tentativas. Abortando.`);
                    throw error;
                }
                const delayTime = initialDelay * Math.pow(2, networkAttempt);
                logger.warn(`⚠️ Erro de rede (Tentativa ${networkAttempt}). Tentando novamente em ${delayTime}ms...`);
                await delay(delayTime);
                continue; // Continua o loop infinito
            } else if (isRateLimitError) {
                apiAttempt++;
                if (apiAttempt > maxApiRetries) {
                    logger.error(`❌ Limite de requisições excedido após ${maxApiRetries} tentativas. Abortando.`);
                    throw error;
                }
                const delayTime = initialDelay * Math.pow(2, apiAttempt);
                logger.warn(`⏳ Limite de requisições (Tentativa ${apiAttempt}). Tentando novamente em ${delayTime}ms...`);
                await delay(delayTime);
                continue; // Continua o loop infinito
            } else {
                throw error; // Outros erros, relança imediatamente
            }
        }
    }
}


async function fetchMovieIdsForPeriod(startDate: string, endDate: string): Promise<number[]> {
  logger.info(`Buscando IDs de filmes lançados entre ${startDate} e ${endDate}...`);
  const movieIds = new Set<number>();
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          'primary_release_date.gte': startDate,
          'primary_release_date.lte': endDate,
          page,
          region: 'BR', // Filtrar por lançamentos no Brasil
          sort_by: 'primary_release_date.asc',
          with_release_type: '2|3|4', // 2: Theatrical (limited), 3: Theatrical (wide), 4: Digital
        },
      });

      if (response.data.results) {
        for (const movie of response.data.results) {
          if (movie.id && !movie.adult) {
            movieIds.add(movie.id);
          }
        }
      }

      totalPages = response.data.total_pages || 1;
      page++;
      await delay(250); // Pausa para respeitar o rate limit
    } while (page <= totalPages && page <= 500);
    
    logger.info(`Total de ${movieIds.size} IDs de filmes encontrados para o período.`);
    return Array.from(movieIds);
  } catch (error) {
    logger.error(`Erro ao buscar IDs de filmes para o período: ${error}`);
    return [];
  }
}

async function processMovieBatch(movieIds: number[], prisma: PrismaClient): Promise<{ successCount: number, errorCount: number, skippedCount: number }> {
  let successCount = 0, errorCount = 0, skippedCount = 0;

  for (const id of movieIds) {
    try {
      const movieDetails = await tmdbApiWithRetry(() => tmdb.movieInfo({
        id,
        language: 'pt-BR',
        append_to_response: 'credits,videos,watch/providers,release_dates',
      })) as any;



      const brReleases = movieDetails.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'BR');
      let releaseDate: Date | null = null;
      let relevantRelease: any = undefined;

      if (brReleases && brReleases.release_dates.length > 0) {
        relevantRelease = brReleases.release_dates.find((rd: any) => rd.type === 3);
        if (!relevantRelease) relevantRelease = brReleases.release_dates.find((rd: any) => rd.type === 2);
        if (!relevantRelease) relevantRelease = brReleases.release_dates.find((rd: any) => rd.type === 4);
        if (!relevantRelease) relevantRelease = brReleases.release_dates[0];
        releaseDate = new Date(relevantRelease.release_date);
      }

      if (!releaseDate) {
        skippedCount++;
        continue;
      }

      const genres = movieDetails.genres?.map((g: any) => g.name) || [];
      const excludedGenres = ['Documentário', 'Música', 'Família', 'Kids'];
      if (genres.some((genre: string) => excludedGenres.includes(genre))) {
        skippedCount++;
        continue;
      }

      const titleKeywordsToExclude = ['Lollapalooza', 'Concerto', 'Show', 'Festival', 'Live', 'Ao Vivo', 'Turnê', 'Tour', 'ABC', 'Alfabeto', 'Crianças', 'Infantil', 'Desenho', 'Brincadeira', 'Aprender', 'Diana', 'Roma', 'Diana e Roma', 'Música', 'Musical', 'Performance', 'Jazzopen', 'Summerjam', 'Bardentreffen', 'Euro Classic', 'Baroque', 'Orchestra', 'Symphony', 'Philharmonic'];
      if (titleKeywordsToExclude.some(keyword => movieDetails.title?.toLowerCase().includes(keyword.toLowerCase()))) {
        skippedCount++;
        continue;
      }

      const scalarData = {
        tmdbId: movieDetails.id,
        title: movieDetails.title!,
        originalTitle: movieDetails.original_title,
        overview: movieDetails.overview,
        releaseDate: releaseDate,
        runtime: movieDetails.runtime,
        budget: BigInt(movieDetails.budget || 0),
        revenue: BigInt(movieDetails.revenue || 0),
        popularity: movieDetails.popularity,
        voteAverage: movieDetails.vote_average,
        voteCount: movieDetails.vote_count,
        status: movieDetails.status,
        tagline: movieDetails.tagline,
        homepage: movieDetails.homepage,
        posterPath: movieDetails.poster_path,
        backdropPath: movieDetails.backdrop_path,
        imdbId: movieDetails.imdb_id,
        releaseType: relevantRelease?.type ? String(relevantRelease.type) : null,
        collection: movieDetails.belongs_to_collection ? {
          connectOrCreate: {
            where: { id: movieDetails.belongs_to_collection.id },
            create: {
              id: movieDetails.belongs_to_collection.id,
              name: movieDetails.belongs_to_collection.name,
              posterPath: movieDetails.belongs_to_collection.poster_path,
              backdropPath: movieDetails.belongs_to_collection.backdrop_path,
            }
          }
        } : undefined
      };

      const relationalData = {
        genres: {
          create: movieDetails.genres?.map((genre: any) => ({ genero: { connectOrCreate: { where: { tmdbId: genre.id }, create: { tmdbId: genre.id, name: genre.name } } } }))
        },
        companies: {
          create: movieDetails.production_companies?.map((company: any) => ({ company: { connectOrCreate: { where: { tmdbId: company.id }, create: { tmdbId: company.id, name: company.name } } } }))
        },
        countries: {
            create: movieDetails.production_countries?.map((country: any) => ({ country: { connectOrCreate: { where: { iso: country.iso_3166_1 }, create: { iso: country.iso_3166_1, name: country.name } } } }))
        },
        languages: {
            create: movieDetails.spoken_languages?.map((lang: any) => ({ language: { connectOrCreate: { where: { iso: lang.iso_639_1 }, create: { iso: lang.iso_639_1, name: lang.english_name } } } }))
        },
        cast: {
          create: movieDetails.credits?.cast?.slice(0, 20).map((person: Cast) => ({ character: person.character, order: person.order, pessoa: { connectOrCreate: { where: { tmdbId: person.id }, create: { tmdbId: person.id, name: person.name, profilePath: person.profile_path } } } }))
        },
        crew: {
          create: movieDetails.credits?.crew?.filter((p: Crew) => ['Director', 'Screenplay', 'Writer'].includes(p.job || '')).map((person: Crew) => ({ job: person.job, department: person.department, pessoa: { connectOrCreate: { where: { tmdbId: person.id }, create: { tmdbId: person.id, name: person.name, profilePath: person.profile_path } } } }))
        },
        videos: {
            create: movieDetails.videos?.results?.filter((v: any) => v.site === 'YouTube').map((video: any) => ({ tmdbId: video.id, key: video.key, name: video.name, site: video.site, type: video.type, official: video.official }))
        },
        streamingProviders: {
            create: movieDetails['watch/providers']?.results?.BR?.flatrate?.map((provider: any) => ({ provider: { connectOrCreate: { where: { tmdbId: provider.provider_id }, create: { tmdbId: provider.provider_id, name: provider.provider_name, logoPath: provider.logo_path } } } }))
        }
      };



      await prisma.filme.upsert({
        where: { tmdbId: id },
        update: scalarData,
        create: { ...scalarData, ...relationalData },
      });

      successCount++;
      logger.info(`✅ Filme [${id}] "${movieDetails.title}" (Release Type: ${relevantRelease?.type}) sincronizado.`);

    } catch (error) {
      errorCount++;
      logger.error(`❌ Erro ao processar o filme ID ${id}. Pulando: ${error}`);
    }
  }

  logger.info(`--- Resumo do Lote (Filmes) --- Sucesso: ${successCount}, Erros: ${errorCount}, Pulados: ${skippedCount}`);
  return { successCount, errorCount, skippedCount };
}


export async function syncMovies(prisma: PrismaClient, startDate: string, endDate: string, limit?: number) {
  let currentStartDate = new Date(startDate);
  const finalEndDate = new Date(endDate);

  logger.info(`Iniciando busca e sincronização de filmes por mês, de ${startDate} a ${endDate}.`);

  if (limit) {
    logger.warn(`O parâmetro limit (${limit}) será aplicado para cada mês, não para o total.`);
  }

  while (currentStartDate <= finalEndDate) {
    const startStr = currentStartDate.toISOString().split('T')[0];

    // Lógica correta para obter o último dia do mês corrente
    const endOfMonth = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + 1, 0);
    const endStr = (endOfMonth > finalEndDate ? finalEndDate : endOfMonth).toISOString().split('T')[0];

    logger.info(`Buscando IDs de filmes lançados entre ${startStr} e ${endStr}...`);
    
    let monthlyIds = await fetchMovieIdsForPeriod(startStr, endStr);
    
    if (monthlyIds.length > 0) {
        if (limit) {
            monthlyIds = monthlyIds.slice(0, limit);
            logger.info(`Limitando a sincronização deste mês a ${limit} itens.`);
        }

        const batchSize = 10;
        for (let i = 0; i < monthlyIds.length; i += batchSize) {
            const batch = monthlyIds.slice(i, i + batchSize);
            logger.info(`Processando lote de filmes do período ${startStr} a ${endStr}: ${i + 1}-${Math.min(i + batchSize, monthlyIds.length)} de ${monthlyIds.length}`);
            await processMovieBatch(batch, prisma);
        }
    }

    // Lógica correta para avançar para o primeiro dia do próximo mês
    currentStartDate.setMonth(currentStartDate.getMonth() + 1);
    currentStartDate.setDate(1);
  }
  
  logger.info(`Sincronização de filmes concluída para o período de ${startDate} a ${endDate}.`);
}

const main = async () => {
  
  const startDate = process.argv[2];
  const endDate = process.argv[3];
  const limit = process.argv[4] ? parseInt(process.argv[4]) : undefined;

  if (!startDate || !endDate) {
    console.error('Uso: ts-node src/syncMovies.ts <startDate> <endDate> [limit]');
    process.exit(1);
  }

  try {
    await syncMovies(prisma, startDate, endDate, limit);
  } catch (error) {
    logger.error(`Erro fatal na sincronização de filmes: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  main();
}