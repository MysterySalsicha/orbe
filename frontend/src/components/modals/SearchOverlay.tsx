'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Search } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import MidiaCard from '@/components/media/MidiaCard';
import type { SearchResultItem, Filme, Serie, Anime, Jogo } from '@/types';
import { realApi } from '@/data/realApi';

const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'filmes' | 'series' | 'animes' | 'jogos'>('todos');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [trendingContent, setTrendingContent] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'todos' as const, label: 'Todos' },
    { id: 'filmes' as const, label: 'Filmes' },
    { id: 'series' as const, label: 'Séries' },
    { id: 'animes' as const, label: 'Animes' },
    { id: 'jogos' as const, label: 'Jogos' },
  ];

  const popularSearches = ['Duna', 'Attack on Titan', 'The Last of Us', "Baldur's Gate 3", 'House of the Dragon', 'Demon Slayer', 'Oppenheimer', 'Zelda'];

  const performSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const results = await realApi.search(query, selectedCategory === 'todos' ? undefined : selectedCategory);
      const flatResults: SearchResultItem[] = [
        ...results.filmes.map((item: Filme) => ({ ...item, type: 'filme' as const })),
        ...results.series.map((item: Serie) => ({ ...item, type: 'serie' as const })),
        ...results.animes.map((item: Anime) => ({ ...item, type: 'anime' as const })),
        ...results.jogos.map((item: Jogo) => ({ ...item, type: 'jogo' as const })),
      ];
      setSearchResults(flatResults);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const loadTrendingContent = async () => {
      setIsLoading(true);
      try {
        const trending = await realApi.getTrending();
        setTrendingContent(trending);
      } catch (error) {
        console.error('Erro ao carregar conteúdo em alta:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSearchOpen && trendingContent.length === 0) {
      loadTrendingContent();
    }
  }, [isSearchOpen, trendingContent.length]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce de 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, performSearch]);

  const handlePopularSearchClick = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSearchResults([]);
    closeSearch();
  };

  const displayContent = useMemo(() => {
    if (searchQuery.trim()) return searchResults;
    return trendingContent;
  }, [searchQuery, searchResults, trendingContent]);

  const filteredContent = useMemo(() => {
    if (selectedCategory === 'todos') return displayContent;
    const type = selectedCategory.slice(0, -1);
    return displayContent.filter(item => item.type === type);
  }, [displayContent, selectedCategory]);

  if (!isSearchOpen) return null;

  return (
    <div className="search-overlay">
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold orbe-text-primary">Pesquisar</h2>
          <button onClick={handleClose} className="p-2 orbe-text-primary hover:orbe-text-secondary transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="search-layout">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" placeholder="Digite o nome do filme, série, anime ou jogo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary orbe-text-primary placeholder:text-muted-foreground" autoFocus />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium orbe-text-secondary">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted orbe-text-primary hover:bg-muted/80'}`}>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium orbe-text-secondary">{searchQuery.trim() ? 'Sugestões' : 'Buscas Populares da Semana'}</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button key={search} onClick={() => handlePopularSearchClick(search)} className="px-3 py-2 bg-muted orbe-text-primary hover:bg-muted/80 rounded-md text-sm transition-colors">
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold orbe-text-primary">{searchQuery.trim() ? 'Resultados da Pesquisa' : 'Em Alta'}</h3>
              {filteredContent.length > 0 && (<span className="text-sm text-muted-foreground">{filteredContent.length} {filteredContent.length === 1 ? 'resultado' : 'resultados'}</span>)}
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : filteredContent.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
                {filteredContent.map((item) => (
                  <MidiaCard key={`${item.type}-${item.id}`} midia={item} type={item.type} showCountdown={item.type === 'anime'} onClick={() => console.log('Abrir Super Modal para:', item)} />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum resultado encontrado para <strong>{searchQuery}</strong></p>
                <p className="text-sm text-muted-foreground mt-2">Tente pesquisar por outro termo ou categoria</p>
              </div>
            ) : (
              <div className="text-center py-12"><p className="text-muted-foreground">Carregando conteúdo em alta...</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
