import { logger } from './logger';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const getCrewMember = (crew: any[], job: string) => {
  const member = crew?.find((c: any) => c.job === job);
  return member ? member.pessoa.name : null;
};

const formatDuration = (minutes: number | null) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const mapFilmeToMidia = (filme: any) => {
  const mappedFilme = {
    id: filme.tmdbId,
    titulo_api: filme.title,
    titulo_original: filme.originalTitle,
    sinopse: filme.overview,
    poster_url_api: filme.posterPath ? `${TMDB_IMAGE_BASE_URL}${filme.posterPath}` : null,
    data_lancamento_api: filme.releaseDate,
    duracao: formatDuration(filme.runtime),
    diretor: getCrewMember(filme.crew, 'Director'),
    escritor: getCrewMember(filme.crew, 'Writer'),
    generos_api: filme.genres?.map((g: any) => g.genero.name) ?? [],
    plataformas_api: filme.streamingProviders?.map((p: any) => ({ nome: p.provider.name })) ?? [],
    elenco: filme.cast?.map((c: any) => ({ id: c.pessoa.tmdbId, nome: c.pessoa.name, personagem: c.character, foto_url: c.pessoa.profilePath ? `${TMDB_IMAGE_BASE_URL}${c.pessoa.profilePath}` : null })) ?? [],
    videos: filme.videos?.map((v: any) => ({ key: v.key, site: v.site, nome: v.name })) ?? [],
    homepage: filme.homepage, // Adicionado para o botão Assistir
    trailer_key: filme.videos?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key || filme.videos?.[0]?.key || null, // Extrai a chave do trailer
    em_prevenda: filme.em_prevenda, // Adicionado para o status de pré-venda
  };
  return mappedFilme;
};

export const mapSerieToMidia = (serie: any) => ({
  id: serie.tmdbId,
  titulo_api: serie.name,
  titulo_original: serie.originalName,
  sinopse: serie.overview,
  poster_url_api: serie.posterPath ? `${TMDB_IMAGE_BASE_URL}${serie.posterPath}` : null,
  data_lancamento_api: serie.firstAirDate,
  numero_temporadas: serie.numberOfSeasons,
  numero_episodios: serie.numberOfEpisodes,
  generos_api: serie.genres?.map((g: any) => g.genero.name) ?? [],
  plataformas_api: serie.streamingProviders?.map((p: any) => ({ nome: p.provider.name })) ?? [],
  criadores: serie.createdBy?.map((c: any) => ({ id: c.pessoa.tmdbId, nome: c.pessoa.name, foto_url: c.pessoa.profilePath ? `${TMDB_IMAGE_BASE_URL}${c.pessoa.profilePath}` : null })) ?? [],
  elenco: serie.cast?.map((c: any) => ({ id: c.pessoa.tmdbId, nome: c.pessoa.name, personagem: c.character, foto_url: c.pessoa.profilePath ? `${TMDB_IMAGE_BASE_URL}${c.pessoa.profilePath}` : null })) ?? [],
  videos: serie.videos?.map((v: any) => ({ key: v.key, site: v.site, nome: v.name })) ?? [],
  temporadas: serie.seasons?.map((s: any) => ({ numero: s.seasonNumber, episodios: s.episodeCount, nome: s.name, poster_url: s.posterPath ? `${TMDB_IMAGE_BASE_URL}${s.posterPath}` : null })) ?? [],
});

export const mapAnimeToMidia = (anime: any) => {
  const hasPtBrDub = anime.characters?.some((c: any) => c.dublador?.language === 'Portuguese (Brazil)');

  const nextAiringEpisode = anime.airingSchedule?.nodes
    ?.filter((node: any) => node.airingAt * 1000 > Date.now())
    .sort((a: any, b: any) => a.episode - b.episode)[0];

  return {
    id: anime.anilistId,
    titulo_api: anime.titleRomaji,
    titulo_ingles: anime.titleEnglish,
    sinopse: anime.description,
    poster_url_api: anime.coverImage,
    data_lancamento_api: anime.startDate,
    numero_episodios: anime.episodes,
    estudio: anime.studios?.[0]?.studio.name,
    fonte: anime.source,
    dublagem_info: hasPtBrDub ? 'Sim' : 'Não',
    mal_link: anime.malId ? `https://myanimelist.net/anime/${anime.malId}` : null,
    trailer_key: anime.videos?.find((v: any) => v.site === 'YouTube')?.key,
    generos_api: anime.genres?.map((g: any) => g.genero.name) ?? [],
    tags_api: anime.tags?.map((t: any) => t.tag.name) ?? [],
    plataformas_api: anime.streamingLinks?.map((l: any) => ({ nome: l.site })) ?? [],
    proximo_episodio: nextAiringEpisode ? new Date(nextAiringEpisode.airingAt * 1000).toISOString() : null,
    numero_episodio_atual: nextAiringEpisode ? nextAiringEpisode.episode : null,
    personagens: anime.characters?.map((c: any) => ({
      id: c.character.anilistId,
      nome: c.character.name,
      foto_url: c.character.image,
      dubladores: {
        jp: c.dublador?.language === 'JAPANESE' ? { id: c.dublador.anilistId, nome: c.dublador.name, foto_url: c.dublador.image } : null,
        pt: c.dublador?.language === 'Portuguese (Brazil)' ? { id: c.dublador.anilistId, nome: c.dublador.name, foto_url: c.dublador.image } : null,
      }
    })) ?? [],
    staff: anime.staff?.map((s: any) => ({ id: s.staff.anilistId, nome: s.staff.name, funcao: s.role, foto_url: s.staff.image })) ?? [],
    relations: [
      ...(anime.sourceRelations?.map((rel: any) => ({
        relationType: rel.type,
        node: { id: rel.relatedAnime.anilistId, title: { romaji: rel.relatedAnime.titleRomaji } }
      })) ?? []),
      ...(anime.relatedRelations?.map((rel: any) => ({
        relationType: rel.type,
        node: { id: rel.sourceAnime.anilistId, title: { romaji: rel.sourceAnime.titleRomaji } }
      })) ?? []),
    ],
    airingSchedule: anime.airingSchedule, // Adicionado para o carrossel de animes
    format: anime.format, // Adicionado para filtro de formato
    isAdult: anime.isAdult, // Adicionado para filtro de conteúdo adulto
  };
};

export const mapJogoToMidia = (jogo: any) => ({
  id: jogo.igdbId,
  titulo_api: jogo.name,
  sinopse: jogo.summary,
  poster_url_api: jogo.cover,
  data_lancamento_api: jogo.firstReleaseDate,
  avaliacao: jogo.rating,
  trailer_key: jogo.videos?.find((v: any) => v.name?.toLowerCase().includes('trailer'))?.key || null,
  generos_api: jogo.genres?.map((g: any) => g.genero.name) ?? [],
  plataformas_api: jogo.platforms?.map((p: any) => ({ nome: p.plataforma.name })) ?? [],
  desenvolvedores: jogo.companies?.filter((c: any) => c.developer).map((c: any) => c.company.name) ?? [],
  publicadoras: jogo.companies?.filter((c: any) => c.publisher).map((c: any) => c.company.name) ?? [],
  temas: jogo.themes?.map((t: any) => t.theme.name) ?? [],
  perspectivas: jogo.playerPerspectives?.map((p: any) => p.perspective.name) ?? [],
  screenshots: jogo.screenshots?.map((s: any) => s.url) ?? [],
  artworks: jogo.artworks?.map((a: any) => a.url) ?? [],
  videos: jogo.videos?.map((v: any) => ({ key: v.key, site: v.site, nome: v.name })) ?? [],
  websites: jogo.websites?.map((w: any) => ({ category: w.category, url: w.url })) ?? [],
});
