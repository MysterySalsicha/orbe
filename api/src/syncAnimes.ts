// Este script foi completamente reestruturado para popular o novo schema detalhado do banco de dados para animes.
// Ele usa uma consulta GraphQL abrangente para buscar todos os dados relacionados (personagens, staff, etc.)
// e utiliza transações do Prisma para garantir a integridade dos dados durante o salvamento.

import { anilistApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const ANIME_SYNC_QUERY = `
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
      idMal
      title { romaji english native }
      description(asHtml: false)
      format
      status
      startDate { year month day }
      endDate { year month day }
      season
      seasonYear
      episodes
      duration
      countryOfOrigin
      source
      coverImage { extraLarge color }
      bannerImage
      genres
      averageScore
      nextAiringEpisode { airingAt timeUntilAiring episode }
      trailer { id site thumbnail }
      tags { id name description isSpoiler }
      streamingEpisodes { title thumbnail url site }
      studios {
        edges {
          isMain
          node { id name isAnimationStudio }
        }
      }
      characters(sort: [ROLE, RELEVANCE, ID], perPage: 25) {
        edges {
          role
          node {
            id
            name { first last full native }
            image { large }
            description(asHtml: false)
            gender
            age
            voiceActors {
              id
              name { full native }
              image { large }
              languageV2
            }
          }
        }
      }
      staff(sort: [RELEVANCE, ID], perPage: 25) {
        edges {
          role
          node {
            id
            name { full native }
            image { large }
            primaryOccupations
          }
        }
      }
    }
  }
}
`;

const parseDate = (date: { year: number; month: number; day: number } | null) => {
  if (!date || !date.year || !date.month || !date.day) return null;
  return new Date(date.year, date.month - 1, date.day);
};

export async function syncAnimes(year: number) {
  logger.info(`Iniciando sincronização completa de animes para o ano ${year}...`);
  let page = 1;
  let hasNextPage = true;
  let totalAnimesSynced = 0;

  while (hasNextPage) {
    try {
      const response = await anilistApi.post('', {
        query: ANIME_SYNC_QUERY,
        variables: { year, page, perPage: 15 }, // Keep perPage lower due to query complexity
      });

      const data = response.data.data.Page;
      const animes = data.media;

      if (animes.length === 0) {
        hasNextPage = false;
        break;
      }

      logger.info(`Processando ${animes.length} animes da página ${page}/${data.pageInfo.lastPage || 'desconhecida'}`);

      for (const anime of animes) {
        try {
          await prisma.$transaction(async (tx) => {
            // 1. Upsert entidades independentes
            for (const tag of anime.tags) {
              await tx.tag.upsert({
                where: { id: tag.id },
                update: { name: tag.name, description: tag.description, isSpoiler: tag.isSpoiler },
                create: { id: tag.id, name: tag.name, description: tag.description, isSpoiler: tag.isSpoiler },
              });
            }
            for (const studioEdge of anime.studios.edges) {
              const studio = studioEdge.node;
              await tx.studio.upsert({
                where: { id: studio.id },
                update: { name: studio.name, isAnimationStudio: studio.isAnimationStudio },
                create: { id: studio.id, name: studio.name, isAnimationStudio: studio.isAnimationStudio },
              });
            }
            for (const staffEdge of anime.staff.edges) {
                const staff = staffEdge.node;
                await tx.staff.upsert({
                    where: { id: staff.id },
                    update: { name_api: staff.name, image_api: staff.image, primaryOccupations_api: staff.primaryOccupations },
                    create: { id: staff.id, name_api: staff.name, image_api: staff.image, primaryOccupations_api: staff.primaryOccupations, name_curado: staff.name?.full },
                });
            }

            for (const charEdge of anime.characters.edges) {
              const character = charEdge.node;
              for (const va of character.voiceActors) {
                await tx.voiceActor.upsert({
                  where: { id: va.id },
                  update: { name_api: va.name, image_api: va.image },
                  create: { id: va.id, name_api: va.name, image_api: va.image, name_curado: va.name?.full },
                });
              }
              await tx.character.upsert({
                where: { id: character.id },
                update: { name_api: character.name, image_api: character.image, description_api: character.description, gender_api: character.gender, age_api: character.age },
                create: { id: character.id, name_api: character.name, image_api: character.image, description_api: character.description, gender_api: character.gender, age_api: character.age },
              });
            }

            // 2. Upsert o Anime principal
            const animePayload = {
              idMal: anime.idMal,
              title_api: anime.title,
              format_api: anime.format,
              status_api: anime.status,
              description_api: anime.description,
              startDate_api: parseDate(anime.startDate),
              endDate_api: parseDate(anime.endDate),
              season_api: anime.season,
              seasonYear_api: anime.seasonYear,
              episodes_api: anime.episodes,
              duration_api: anime.duration,
              countryOfOrigin_api: anime.countryOfOrigin,
              source_api: anime.source,
              coverImage_api: anime.coverImage,
              bannerImage_api: anime.bannerImage,
              nextAiringEpisode_api: anime.nextAiringEpisode,
              trailer_api: anime.trailer,
              avaliacao_api: anime.averageScore,
              genres_api: anime.genres,
            };

            await tx.anime.upsert({
              where: { id: anime.id },
              update: animePayload,
              create: {
                id: anime.id,
                ...animePayload,
                title_curado: anime.title,
                genres_curado: anime.genres,
              },
            });

            // 3. Limpar e recriar relacionamentos para garantir a sincronia
            await tx.animeCharacter.deleteMany({ where: { animeId: anime.id } });
            await tx.animeStaff.deleteMany({ where: { animeId: anime.id } });
            await tx.animeStudio.deleteMany({ where: { animeId: anime.id } });
            await tx.streamingEpisode.deleteMany({ where: { animeId: anime.id } });

            // Recriar
            await tx.anime.update({
                where: { id: anime.id },
                data: {
                    tags: { connect: anime.tags.map((t: any) => ({ id: t.id })) },
                }
            });

            for (const ep of anime.streamingEpisodes) {
                await tx.streamingEpisode.create({
                    data: { animeId: anime.id, url_api: ep.url, title_api: ep.title, thumbnail_api: ep.thumbnail, site_api: ep.site },
                });
            }
            for (const studioEdge of anime.studios.edges) {
                await tx.animeStudio.create({
                    data: { animeId: anime.id, studioId: studioEdge.node.id },
                });
            }
            for (const staffEdge of anime.staff.edges) {
                await tx.animeStaff.create({
                    data: { animeId: anime.id, staffId: staffEdge.node.id, role: staffEdge.role },
                });
            }
            for (const charEdge of anime.characters.edges) {
                await tx.animeCharacter.create({
                    data: { animeId: anime.id, characterId: charEdge.node.id, role: charEdge.role },
                });
                for (const va of charEdge.node.voiceActors) {
                    await tx.characterVoiceActor.upsert({
                        where: { characterId_voiceActorId_language: { characterId: charEdge.node.id, voiceActorId: va.id, language: va.languageV2 } },
                        update: {},
                        create: { characterId: charEdge.node.id, voiceActorId: va.id, language: va.languageV2 },
                    });
                }
            }

            logger.info(`  Anime [${anime.id}] "${anime.title.romaji}" sincronizado com sucesso.`);
          }, {
            maxWait: 15000, // 15 seconds
            timeout: 30000, // 30 seconds
          });
          totalAnimesSynced++;
        } catch (e: any) {
          logger.error(`Erro na transação para o anime [${anime.id}] "${anime.title.romaji}": ${e.message}`);
        }
      }

      page++;
      hasNextPage = data.pageInfo.hasNextPage;
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa mais longa entre páginas complexas
      }

    } catch (error: any) {
      const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
      logger.error(`Erro ao buscar página ${page} de animes de ${year}: ${errorMessage}`);
      // Pausa longa em caso de erro de API para evitar rate limit
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  logger.info(`Sincronização concluída para o ano ${year}. Total de ${totalAnimesSynced} animes processados.`);
}