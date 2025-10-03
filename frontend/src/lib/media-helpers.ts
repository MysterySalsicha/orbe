import { Midia, Filme, Serie, Anime, Jogo, Character } from '@/types';

/**
 * Normaliza o nome de um provedor de streaming para um valor padrão.
 * @param name O nome original do provedor.
 * @returns O nome padronizado.
 */
export const normalizeProviderName = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('netflix')) return 'Netflix';
  if (lowerName.includes('max')) return 'Max';
  if (lowerName.includes('prime video')) return 'Prime Video';
  if (lowerName.includes('disney')) return 'Disney+';
  if (lowerName.includes('crunchyroll')) return 'Crunchyroll';
  if (lowerName.includes('star+')) return 'Star+';
  if (lowerName.includes('apple tv')) return 'Apple TV+';
  return name;
};

/**
 * Extrai uma lista única e normalizada de provedores de streaming de um item de mídia.
 * @param item O objeto de mídia (filme, série ou anime).
 * @returns Uma lista de nomes de provedores.
 */
export const getStreamingProviders = (item: Midia): string[] => {
  const providers = item.plataformas_api?.map(p => normalizeProviderName(p.nome)) ?? [];
  return [...new Set(providers)]; // Retorna apenas nomes únicos
};

/**
 * Extrai uma lista única e padronizada de plataformas de um jogo.
 * @param item O objeto de jogo.
 * @returns Uma lista de nomes de plataformas.
 */
export const getGamePlatforms = (item: Jogo): string[] => {
  const platformNames = item.plataformas_jogo?.map(p => p.nome) ?? [];
  const normalized = new Set<string>();

  platformNames.forEach(name => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('playstation')) {
      normalized.add('PlayStation');
    } else if (lowerName.includes('xbox')) {
      normalized.add('Xbox');
    } else if (lowerName.includes('pc') || lowerName.includes('windows')) {
      normalized.add('PC');
    } else if (lowerName.includes('switch')) {
      normalized.add('Nintendo Switch');
    } else {
      normalized.add(name);
    }
  });

  return Array.from(normalized);
};

/**
 * Verifica se um anime possui dublagem em português.
 * @param item O objeto de anime.
 * @returns "Dublado" ou "Legendado".
 */
export const getAnimeDubStatus = (item: Anime): 'Dublado' | 'Legendado' => {
  const hasDub = item.personagens?.some(character => 
    character.dubladores?.pt
  );
  return hasDub ? 'Dublado' : 'Legendado';
};

/**
 * Formata a nota de avaliação de um item de mídia para uma string (ex: "8.1").
 * @param item O objeto de mídia.
 * @param type O tipo da mídia ('filme', 'serie', 'anime').
 * @returns A nota formatada ou null se não houver nota.
 */
export const formatRating = (item: Midia, type: 'filme' | 'serie' | 'anime' | 'jogo'): string | null => {
  if (type === 'filme' || type === 'serie') {
    const voteAverage = (item as any).voteAverage;
    if (typeof voteAverage === 'number') {
      return voteAverage.toFixed(1);
    }
  } else if (type === 'anime') {
    const averageScore = (item as any).averageScore;
    if (typeof averageScore === 'number') {
      return (averageScore / 10).toFixed(1);
    }
  }
  return null;
};

/**
 * Extrai e formata os links de lojas digitais de um objeto de jogo.
 * @param item O objeto de jogo.
 * @returns Uma lista de objetos de loja com nome, ícone e URL.
 */
export const getGameStores = (item: Jogo): { name: string; icon: string; url: string }[] => {
  const storeMap: Record<number, { name: string; icon: string }> = {
    13: { name: 'Steam', icon: 'steam' },
    16: { name: 'Epic Games', icon: 'epic' }, // Ícone precisa ser criado/adicionado
    26: { name: 'GOG', icon: 'gog' }, // Ícone precisa ser criado/adicionado
    36: { name: 'PlayStation Store', icon: 'playstation' },
    37: { name: 'Microsoft Store', icon: 'xbox' },
    54: { name: 'Nintendo eShop', icon: 'nintendo' },
  };

  if (!item.websites) return [];

  return item.websites
    .filter(website => storeMap[website.category])
    .map(website => ({
      ...storeMap[website.category],
      url: website.url,
    }));
};
