import { anilistApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const truncate = (str: string | null | undefined, num: number) => {
  if (!str) return null;
  return str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
};

export async function syncAnimes(year: number) {
  try {
    const query = `
      query ($page: Int, $perPage: Int, $year: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
          media(seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
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
                name
              }
            }
            source
          }
        }
      }
    `;

    let page = 1;
    let totalAnimesSynced = 0;
    let hasNextPage = true;

    while (hasNextPage) {
      const variables = {
        year,
        page,
        perPage: 50, // Anilist limit
      };

      const response = await anilistApi.post('', { query, variables });
      const data = response.data.data.Page;
      const animes = data.media;

      if (animes.length === 0) {
        hasNextPage = false;
        break;
      }

      for (const anime of animes) {
        const releaseDate = (anime.startDate && anime.startDate.year && anime.startDate.month && anime.startDate.day)
          ? new Date(anime.startDate.year, anime.startDate.month - 1, anime.startDate.day)
          : null;

        const studio = anime.studios.nodes.length > 0 ? anime.studios.nodes[0].name : null;

        await prisma.anime.upsert({
          where: { id: anime.id },
          update: {
            titulo_api: truncate(anime.title.english || anime.title.romaji, 255),
            titulo_curado: truncate(anime.title.romaji || anime.title.english, 255)!,
            sinopse_api: anime.description,
            poster_url_api: anime.coverImage.extraLarge,
            data_lancamento_api: releaseDate,
            generos_api: anime.genres,
            estudio: studio,
            fonte: anime.source,
            avaliacao_api: anime.averageScore,
          },
          create: {
            id: anime.id,
            titulo_api: truncate(anime.title.english || anime.title.romaji, 255),
            titulo_curado: truncate(anime.title.romaji || anime.title.english, 255)!,
            sinopse_api: anime.description,
            sinopse_curada: anime.description,
            poster_url_api: anime.coverImage.extraLarge,
            data_lancamento_api: releaseDate,
            data_lancamento_curada: releaseDate,
            generos_api: anime.genres,
            plataformas_api: [],
            plataformas_curadas: [],
            estudio: studio,
            fonte: anime.source,
            avaliacao_api: anime.averageScore,
          },
        });
      }
      totalAnimesSynced += animes.length;
      logger.info(`  Página ${page}/${data.pageInfo.lastPage}: ${animes.length} animes sincronizados.`);

      page++;
      hasNextPage = data.pageInfo.hasNextPage;
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (totalAnimesSynced > 0) {
      logger.info(`${totalAnimesSynced} animes de ${year} sincronizados com sucesso.`);
    } else {
      logger.info(`Nenhum anime encontrado para ${year}.`);
    }
  } catch (error: any) {
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    logger.error(`Erro ao sincronizar animes de ${year}: ${errorMessage}`);
  }
}