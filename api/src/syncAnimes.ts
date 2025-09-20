import { anilistApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const truncateString = (str: string | null | undefined, maxLength: number): string | null => {
  if (str === null || str === undefined) {
    return null;
  }
  return str.length > maxLength ? str.substring(0, maxLength) : str;
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
            description
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
            studios {
              nodes {
                name
              }
            }
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
        perPage: 100,
      };

      const response = await anilistApi.post('', { query, variables });
      const data = response.data.data.Page;
      const animes = data.media;

      if (animes.length === 0) {
        hasNextPage = false;
        break;
      }

      for (const anime of animes) {
        const truncatedRomajiTitle = truncateString(anime.title.romaji || '', 255) as string;
        const truncatedEnglishTitle = truncateString(anime.title.english, 255);
        const truncatedDescription = truncateString(anime.description, 1000);

        await prisma.anime.upsert({
          where: { externalId: String(anime.id) },
          update: {
            title: truncatedRomajiTitle,
            englishTitle: truncatedEnglishTitle,
            description: truncatedDescription,
            imageUrl: anime.coverImage.extraLarge,
            releaseDate: (anime.startDate && anime.startDate.year && anime.startDate.month && anime.startDate.day)
              ? new Date(`${anime.startDate.year}-${String(anime.startDate.month).padStart(2, '0')}-${String(anime.startDate.day).padStart(2, '0')}`)
              : null,
            averageScore: anime.averageScore,
            genres: anime.genres,
            studio: anime.studios.nodes.length > 0 ? anime.studios.nodes[0].name : null,
          },
          create: {
            externalId: String(anime.id),
            title: truncatedRomajiTitle,
            englishTitle: truncatedEnglishTitle,
            description: truncatedDescription,
            imageUrl: anime.coverImage.extraLarge,
            releaseDate: (anime.startDate && anime.startDate.year && anime.startDate.month && anime.startDate.day)
              ? new Date(`${anime.startDate.year}-${String(anime.startDate.month).padStart(2, '0')}-${String(anime.startDate.day).padStart(2, '0')}`)
              : null,
            averageScore: anime.averageScore,
            genres: anime.genres,
            studio: anime.studios.nodes.length > 0 ? anime.studios.nodes[0].name : null,
          },
        });
      }
      totalAnimesSynced += animes.length;
      logger.info(`  Página ${page}/${data.pageInfo.lastPage}: ${animes.length} animes sincronizados. Datas: ${animes.map((a: any) => `${a.startDate.year}-${a.startDate.month}-${a.startDate.day}`).join(', ')}`);

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
    logger.error(`Erro ao sincronizar animes de ${year}: ${error.message || error}`);
  }
}

syncAnimes(2025).catch(console.error);