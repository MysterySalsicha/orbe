import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { anilistApi } from './clients';
import { logger } from './logger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function anilistApiWithRetry(query: string, variables: any, maxRetries = 5, initialDelay = 1000) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await anilistApi.post('', { query, variables });
        } catch (error: any) {
            const isRateLimitError = error.response && error.response.status === 429;
            const isNetworkError = error.code === 'ENOTFOUND' || error.code === 'ECONNRESET';

            if (isRateLimitError || isNetworkError) {
                attempt++;
                if (attempt >= maxRetries) {
                    throw error; 
                }
                const delayTime = initialDelay * Math.pow(2, attempt);
                logger.info(`Tentativa ${attempt} falhou com erro ${isRateLimitError ? '429' : 'de rede'}. Tentando novamente em ${delayTime}ms...`);
                await delay(delayTime);
            } else {
                throw error;
            }
        }
    }
    throw new Error("Número máximo de tentativas atingido");
}

const truncate = (str: string | null | undefined, num: number): string | null => {
  if (!str) return null;
  if (str.length <= num) return str;
  return str.slice(0, num - 3) + '...';
};

async function fetchAllAnimeIdsForSeasons(year: number, seasons: string[]): Promise<number[]> {
    const animeIds = new Set<number>();
    const query = `
      query ($page: Int, $perPage: Int, $year: Int, $season: MediaSeason) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
          }
          media(seasonYear: $year, season: $season, type: ANIME, sort: POPULARITY_DESC) {
            id
          }
        }
      }
    `;

    for (const season of seasons) {
        logger.info(`Buscando todos os IDs de animes para a temporada ${season} de ${year}...`);
        let page = 1;
        let hasNextPage = true;

        try {
            while (hasNextPage) {
                const variables = { year, season, page, perPage: 50 };
                const response = await anilistApiWithRetry(query, variables);
                const data = response.data.data.Page;

                if (data.media) {
                    for (const anime of data.media) {
                        if (anime.id) {
                            animeIds.add(anime.id);
                        }
                    }
                }

                hasNextPage = data.pageInfo.hasNextPage;
                page++;
                await delay(670); // Respect Anilist rate limit (90 req/min -> ~670ms/req)
            }
        } catch (error: any) {
            const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
            logger.error(`Erro ao buscar IDs de animes para a temporada ${season}: ${errorMessage}`);
        }
    }
    
    logger.info(`Total de ${animeIds.size} IDs de animes únicos encontrados para as temporadas selecionadas.`);
    return Array.from(animeIds);
}

async function processAnimeBatch(animeIds: number[], year: number): Promise<void> {
    const detailQuery = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
          }
          description(asHtml: false)
          coverImage {
            extraLarge
          }
          startDate {
            year
            month
            day
          }
          averageScore
          genres
          studios(isMain: true) {
            nodes {
              id
              name
            }
          }
          source
          characters(sort: ROLE, perPage: 25) {
            edges {
              role
              node {
                id
                name {
                  full
                }
                image {
                  large
                }
              }
              voiceActors(language: JAPANESE, sort: RELEVANCE) {
                id
                name {
                  full
                }
                image {
                  large
                }
              }
            }
          }
          staff(sort: RELEVANCE, perPage: 25) {
            edges {
              role
              node {
                id
                name {
                  full
                }
                image {
                  large
                }
              }
            }
          }
          streamingEpisodes {
            url
            site
            thumbnail
          }
        }
      }
    `;

    for (const id of animeIds) {
        try {
            const response = await anilistApiWithRetry(detailQuery, { id });
            const anime = response.data.data.Media;

            if (!anime) {
                logger.info(`Anime com ID ${id} não encontrado.`);
                continue;
            }

            const releaseDate = (anime.startDate && anime.startDate.year)
                ? new Date(anime.startDate.year, (anime.startDate.month || 1) - 1, anime.startDate.day || 1)
                : null;

            const studio = anime.studios?.nodes?.[0];

            const charactersData = anime.characters?.edges
                ?.filter((edge: any) => edge.voiceActors && edge.voiceActors.length > 0)
                .map((edge: any) => ({
                    role: edge.role,
                    character: {
                        connectOrCreate: {
                            where: { anilistId: edge.node.id },
                            create: { anilistId: edge.node.id, name: edge.node.name.full, image: edge.node.image?.large }
                        }
                    },
                    dublador: {
                        connectOrCreate: {
                            where: { anilistId: edge.voiceActors[0].id },
                            create: { anilistId: edge.voiceActors[0].id, name: edge.voiceActors[0].name.full, image: edge.voiceActors[0].image?.large, language: 'JAPANESE' }
                        }
                    }
                })) ?? [];

            const uniqueStaff = anime.staff?.edges?.reduce((acc: any[], current: any) => {
                if (!acc.find(item => item.node.id === current.node.id && item.role === current.role)) {
                    acc.push(current);
                }
                return acc;
            }, []) ?? [];

            await prisma.anime.upsert({
                where: { anilistId: id },
                update: {
                    titleEnglish: truncate(anime.title.english, 255) || undefined,
                    titleRomaji: truncate(anime.title.romaji, 255) || undefined,
                    coverImage: anime.coverImage?.extraLarge || undefined,
                },
                create: {
                    anilistId: anime.id,
                    titleEnglish: truncate(anime.title.english, 255),
                    titleRomaji: truncate(anime.title.romaji, 255)!,
                    description: anime.description,
                    coverImage: anime.coverImage?.extraLarge,
                    startDate: releaseDate,
                    source: anime.source,
                    averageScore: anime.averageScore,
                    genres: {
                        create: anime.genres?.map((name: string) => ({
                            genero: { connectOrCreate: { where: { name }, create: { name } } }
                        })) ?? []
                    },
                    studios: studio ? {
                        create: {
                            studio: { connectOrCreate: { where: { anilistId: studio.id }, create: { anilistId: studio.id, name: studio.name } } }
                        }
                    } : undefined,
                    characters: {
                        create: charactersData
                    },
                    staff: {
                        create: uniqueStaff.map((edge: any) => ({
                            role: edge.role,
                            staff: {
                                connectOrCreate: {
                                    where: { anilistId: edge.node.id },
                                    create: { anilistId: edge.node.id, name: edge.node.name.full, image: edge.node.image?.large }
                                }
                            }
                        }))
                    },
                    streamingLinks: {
                        create: anime.streamingEpisodes?.map((link: any) => ({
                            url: link.url,
                            site: link.site,
                            thumbnail: link.thumbnail,
                        })) ?? []
                    }
                }
            });
            logger.info(`✅ Anime [${id}] "${anime.title.romaji || anime.title.english}" sincronizado.`);

        } catch (error: any) {
            const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
            logger.error(`❌ Erro ao processar o anime ID ${id}. Pulando: ${errorMessage}`);
        } finally {
            await delay(670);
        }
    }
}

export async function syncAnimes(year: number, seasons: string[]) {
  const allAnimeIds = await fetchAllAnimeIdsForSeasons(year, seasons);

  const existingAnimes = await prisma.anime.findMany({
    select: {
      anilistId: true,
    },
  });
  const existingAnimeIds = new Set(existingAnimes.map(a => a.anilistId));

  const newAnimeIds = allAnimeIds.filter(id => !existingAnimeIds.has(id));

  logger.info(`Encontrados ${allAnimeIds.length} animes no total. ${newAnimeIds.length} animes novos para sincronizar.`);

  const batchSize = 10;

  for (let i = 0; i < newAnimeIds.length; i += batchSize) {
    const batch = newAnimeIds.slice(i, i + batchSize);
    logger.info(`Processando lote de animes: ${i + 1}-${Math.min(i + batchSize, newAnimeIds.length)} de ${newAnimeIds.length}`);
    await processAnimeBatch(batch, year);
  }
}