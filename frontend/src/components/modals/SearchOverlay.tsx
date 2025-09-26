'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import MidiaCard from '@/components/media/MidiaCard';
import type { SearchResultItem, Filme, Serie, Anime, Jogo } from '@/types';
import { realApi } from '@/data/realApi';

const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useAppStore();

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSearchResults([]);
    closeSearch();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'filmes' | 'series' | 'animes' | 'jogos'>('todos');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [trendingContent, setTrendingContent] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const displayContent = useMemo(() => {
    if (searchQuery.trim()) return searchResults;
    return trendingContent;
  }, [searchQuery, searchResults, trendingContent]);

  const groupedContent = useMemo(() => {
    const groups = {
      filmes: displayContent.filter(item => item.type === 'filme'),
      series: displayContent.filter(item => item.type === 'serie'),
      animes: displayContent.filter(item => item.type === 'anime'),
      jogos: displayContent.filter(item => item.type === 'jogo'),
    };

    if (selectedCategory === 'todos') return groups;
    
    return {
      filmes: selectedCategory === 'filmes' ? groups.filmes : [],
      series: selectedCategory === 'series' ? groups.series : [],
      animes: selectedCategory === 'animes' ? groups.animes : [],
      jogos: selectedCategory === 'jogos' ? groups.jogos : [],
    };

  }, [displayContent, selectedCategory]);

  const allItems = useMemo(() => {
    const filmesItems: SearchResultItem[] = groupedContent.filmes.length > 0 ? groupedContent.filmes : [];
    const seriesItems: SearchResultItem[] = groupedContent.series.length > 0 ? groupedContent.series : [];
    const animesItems: SearchResultItem[] = groupedContent.animes.length > 0 ? groupedContent.animes : [];
    const jogosItems: SearchResultItem[] = groupedContent.jogos.length > 0 ? groupedContent.jogos : [];

    return filmesItems.concat(seriesItems, animesItems, jogosItems);
  }, [groupedContent]);

  const totalResults = Object.values(groupedContent).reduce((acc, group) => acc + group.length, 0);

  if (!isSearchOpen) return null;

  const renderGroup = (title: string, items: SearchResultItem[], baseIndex: number) => {
    if (items.length === 0) return null;
    return (
      <div key={title} className="space-y-3">
        <h3 className="text-xl font-semibold orbe-text-primary border-b border-border pb-2">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => {
            const itemIndex = baseIndex + index;
            return (
              <MidiaCard 
                key={`${item.type}-${item.id}`} 
                ref={el => { cardRefs.current[itemIndex] = el; }}
                midia={item} 
                type={item.type} 
                isFocused={itemIndex === focusedIndex}
              />
            );
          })}
        </div>
      </div>
    );
  };

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
          <div className="space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide pr-4 -mr-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold orbe-text-primary">{searchQuery.trim() ? 'Resultados da Pesquisa' : 'Em Alta'}</h3>
              {totalResults > 0 && (<span className="text-sm text-muted-foreground">{totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}</span>)}
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : totalResults > 0 ? (
              <div className="space-y-6">
                {renderGroup('Filmes', groupedContent.filmes, 0)}
                {renderGroup('Séries', groupedContent.series, groupedContent.filmes.length)}
                {renderGroup('Animes', groupedContent.animes, groupedContent.filmes.length + groupedContent.series.length)}
                {renderGroup('Jogos', groupedContent.jogos, groupedContent.filmes.length + groupedContent.series.length + groupedContent.animes.length)}
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
