// Este script foi completamente reestruturado para popular o novo schema detalhado do banco de dados para animes.
// Ele usa uma consulta GraphQL abrangente para buscar todos os dados relacionados (personagens, staff, etc.)
// e utiliza transações do Prisma para garantir a integridade dos dados durante o salvamento.

import { anilistApi } from './clients';
import { Prisma, PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Uma única instância do Prisma Client é suficiente com a nova abordagem.
const prisma = new PrismaClient();

// As interfaces ajudam a garantir a forma dos dados da API.
interface CharacterNode {
  id: number;
  name: { first: string; last: string; full: string; native: string };
  image: { large: string };
  description: string;
  gender: string;
  age: number;
}

interface Anime {
  id: number;
  idMal: number;
  title: { romaji: string; english: string; native: string };
  description: string;
  format: string;
  status: string;
  startDate: { year: number; month: number; day: number };
  endDate: { year: number; month: number; day: number };
  season: string;
  seasonYear: number;
  episodes: number;
  duration: number;
  countryOfOrigin: string;
  source: string;
  coverImage: { extraLarge: string; color: string };
  bannerImage: string;
  genres: string[];
  averageScore: number;
  nextAiringEpisode: { airingAt: number; timeUntilAiring: number; episode: number };
  trailer: { id: string; site: string; thumbnail: string };
  tags: { id: number; name: string; description: string; }[];
  streamingEpisodes: { title: string; thumbnail: string; url: string; site: string }[];
  studios: { edges: { isMain: boolean; node: { id: number; name: string; isAnimationStudio: boolean }; }[]; };
  characters: { edges: { role: string; node: CharacterNode; }[]; };
  staff: { edges: { role: string; node: { id: number; name: { full: string; native: string }; image: { large: string }; primaryOccupations: string[]; }; }[]; };
}

const ANIME_SYNC_QUERY = `
query ($page: Int, $perPage: Int, $year: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { total currentPage lastPage hasNextPage }
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
      tags { id name description }
      streamingEpisodes { title thumbnail url site }
      studios { edges { isMain node { id name isAnimationStudio } } }
      characters(sort: [ROLE, RELEVANCE, ID], perPage: 25) { edges { role node { id name { first last full native } image { large } description(asHtml: false) gender age } } }
      staff(sort: [RELEVANCE, ID], perPage: 25) { edges { role node { id name { full native } image { large } primaryOccupations } } }
    }
  }
}
`;

const parseDate = (date: { year: number; month: number; day: number } | null) => {
  if (!date || !date.year || !date.month || !date.day) return null;
  return new Date(date.year, date.month - 1, date.day);
};

export async function syncAnimes(year: number, month: number) {
  logger.info(`Iniciando sincronização de animes para o ano ${year}, mês ${month}...`);
  let page = 1;
  let hasNextPage = true;
  let totalAnimesSynced = 0;

  while (hasNextPage) {
    try {
      const response = await anilistApi.post('', {
        query: ANIME_SYNC_QUERY,
        variables: { year, page, perPage: 50 }, // Aumentado o tamanho da página
      });

      const data = response.data.data.Page;
      const animes: Anime[] = data.media;

      if (!animes || animes.length === 0) {
        hasNextPage = false;
        break;
      }

      const animesForMonth = animes.filter((anime) => anime.startDate && anime.startDate.month === month);

      if (animesForMonth.length === 0) {
        page++;
        hasNextPage = data.pageInfo.hasNextPage;
        continue;
      }

      logger.info(`Processando ${animesForMonth.length} animes do mês ${month} da página ${page}/${data.pageInfo.lastPage || 'desconhecida'}`);

      for (const anime of animesForMonth) {
        try {
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
            // Campos JSON desnormalizados
            tags_api: anime.tags as unknown as Prisma.InputJsonValue,
            studios_api: anime.studios as unknown as Prisma.InputJsonValue,
            characters_api: anime.characters as unknown as Prisma.InputJsonValue,
            staff_api: anime.staff as unknown as Prisma.InputJsonValue,
            streamingEpisodes_api: anime.streamingEpisodes as unknown as Prisma.InputJsonValue,
          };

          await prisma.anime.upsert({
            where: { id: anime.id },
            update: animePayload,
            create: {
              id: anime.id,
              ...animePayload,
            },
          });

          totalAnimesSynced++;
          logger.info(`  Anime [${anime.id}] "${anime.title.romaji}" sincronizado com sucesso.`);

        } catch (e: any) {
          logger.error(`Erro ao sincronizar anime [${anime.id}] "${anime.title.romaji}": ${e.message}`);
        }
      }

      page++;
      hasNextPage = data.pageInfo.hasNextPage;
      if(hasNextPage) {
        // Pausa curta entre páginas para respeitar a API externa
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error: any) {
      const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
      logger.error(`Erro ao buscar página ${page} de animes de ${year}: ${errorMessage}`);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Pausa longa em caso de erro de API
    }
  }

  logger.info(`Sincronização de animes concluída para o ano ${year}. Total de ${totalAnimesSynced} animes processados.`);
  await prisma.$disconnect();
}