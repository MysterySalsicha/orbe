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
 * @returns Uma lista de objetos de provedor com nome e ícone.
 */
export const getStreamingProviders = (item: Midia): { name: string; icon: string }[] => {
  const providerNames = item.plataformas_api?.map(p => normalizeProviderName(p.nome)) ?? [];
  const uniqueProviderNames = [...new Set(providerNames)];
  
  const providers = uniqueProviderNames.map(name => ({
      name: name,
      icon: name.toLowerCase().replace('+', 'plus').replace(/ /g, '-')
  }));

  // Lógica para "Nos Cinemas"
  if ('duracao' in item && providers.length === 0) { // 'duracao' sugere que é um Filme
    try {
      const releaseDate = new Date(item.data_lancamento_api);
      const today = new Date();
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(today.getDate() - 60);

      if (releaseDate > sixtyDaysAgo && releaseDate <= today) {
        return [{ name: 'Nos Cinemas', icon: 'cinema' }];
      }
    } catch (e) {
      // Ignora datas de lançamento inválidas
    }
  }

  return providers;
};

/**
 * Extrai uma lista única e padronizada de plataformas de um jogo.
 * @param item O objeto de jogo.
 * @returns Uma lista de objetos de plataforma com nome e ícone.
 */
export const getGamePlatforms = (item: Jogo): { name: string; icon: string }[] => {
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

  return Array.from(normalized).map(name => ({
    name: name,
    icon: name.toLowerCase().replace(/ /g, '-')
  }));
};

/**
 * Verifica se um anime possui dublagem em português.
 * A lógica foi robustecida para iterar sobre todos os personagens.
 * @param item O objeto de anime.
 * @returns "Dublado" ou "Legendado".
 */
export const getAnimeDubStatus = (item: Anime): 'Dublado' | 'Legendado' => {
  if (!item.personagens || item.personagens.length === 0) {
    return 'Legendado';
  }

  for (const character of item.personagens) {
    // A propriedade `pt` indica a presença de dublador brasileiro.
    if (character.dubladores?.pt) {
      return 'Dublado';
    }
  }

  return 'Legendado';
};

/**
 * Formata a nota de avaliação de um item de mídia para uma string (ex: "8.1").
 * @param item O objeto de mídia.
 * @param type O tipo da mídia ('filme', 'serie', 'anime').
 * @returns A nota formatada ou null se não houver nota.
 */
export const formatRating = (item: Midia, type: 'filme' | 'serie' | 'anime' | 'jogo'): string | null => {
  const rating = item.avaliacao; // Usando a propriedade 'avaliacao' da interface Midia
  if (typeof rating === 'number') {
    return (rating / 10).toFixed(1);
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
