import { anilistApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

// Keep the truncate helper function
const truncate = (str: string | null | undefined, num: number): string | null => {
  if (!str) return null;
  // Make sure it doesn't cut in the middle of a multibyte character
  const char_array = [...str];
  if (char_array.length > num) {
    return char_array.slice(0, num > 3 ? num - 3 : num).join('') + '...';
  }
  return str;
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
            source
            studios(isMain: true) {
              nodes {
                id
                name
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
            characters(sort: [ROLE, RELEVANCE], perPage: 25) {
              edges {
                node {
                  id
                  name {
                    full
                  }
                  image {
                    large
                  }
                }
                voiceActors(language: JAPANESE) {
                  id
                  name {
                    full
                  }
                  image {
                    large
                  }
                  languageV2
                }
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
        perPage: 10, // Reduced perPage to avoid API rate limits with the heavier query
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

        // Filter characters to only include those with a Japanese voice actor, as the schema requires it.
        const charactersWithVoiceActors = anime.characters.edges.filter(
          (edge: any) => edge.voiceActors && edge.voiceActors.length > 0
        );

        await prisma.anime.upsert({
          where: { id: anime.id },
          update: {
            titulo_api: truncate(anime.title.english || anime.title.romaji, 255),
            titulo_curado: truncate(anime.title.romaji || anime.title.english, 255),
            sinopse_api: anime.description,
            poster_url_api: anime.coverImage.extraLarge,
            data_lancamento_api: releaseDate,
            generos_api: anime.genres,
            fonte: anime.source,
            avaliacao_api: anime.averageScore,
          },
          create: {
            id: anime.id,
            titulo_api: truncate(anime.title.english || anime.title.romaji, 255),
            titulo_curado: truncate(anime.title.romaji || anime.title.english, 255),
            sinopse_api: anime.description,
            sinopse_curada: anime.description,
            poster_url_api: anime.coverImage.extraLarge,
            data_lancamento_api: releaseDate,
            data_lancamento_curada: releaseDate,
            generos_api: anime.genres,
            plataformas_api: [],
            plataformas_curadas: [],
            fonte: anime.source,
            avaliacao_api: anime.averageScore,

            // --- Relational data ---
            estudios: {
              create: anime.studios.nodes.map((studio: any) => ({
                estudio: {
                  connectOrCreate: {
                    where: { id: studio.id },
                    create: { id: studio.id, nome: studio.name },
                  },
                },
              })),
            },
            staff: {
              create: anime.staff.edges.map((edge: any) => ({
                funcao: edge.role,
                staff: {
                  connectOrCreate: {
                    where: { id: edge.node.id },
                    create: {
                      id: edge.node.id,
                      nome: edge.node.name.full,
                      foto_url: edge.node.image.large,
                    },
                  },
                },
              })),
            },
            personagens: {
              create: charactersWithVoiceActors.map((edge: any) => ({
                personagem: {
                  connectOrCreate: {
                    where: { id: edge.node.id },
                    create: {
                      id: edge.node.id,
                      nome: edge.node.name.full,
                      foto_url: edge.node.image.large,
                    },
                  },
                },
                dublador: {
                  connectOrCreate: {
                    where: { id: edge.voiceActors[0].id },
                    create: {
                      id: edge.voiceActors[0].id,
                      nome: edge.voiceActors[0].name.full,
                      foto_url: edge.voiceActors[0].image.large,
                      idioma: edge.voiceActors[0].languageV2,
                    },
                  },
                },
              })),
            },
          },
        });
      }
      totalAnimesSynced += animes.length;
      logger.info(`  Página ${page}/${data.pageInfo.lastPage}: ${animes.length} animes sincronizados.`);

      page++;
      hasNextPage = data.pageInfo.hasNextPage;
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Increased delay for heavier query
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
    // Log the full error object for better debugging if it's not a response error
    if (!error.response) {
      console.error(error);
    }
  }
}