'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, Grid, List, Calendar, Star, TrendingUp } from 'lucide-react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Filme } from '@/types';

export default function FilmesPage() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [filteredFilmes, setFilteredFilmes] = useState<Filme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'em_cartaz' | 'em_breve' | 'populares'>('todos');
  const [selectedGenre, setSelectedGenre] = useState<string>('todos');

  const filters = [
    { id: 'todos' as const, label: 'Todos os Filmes', icon: Grid },
    { id: 'em_cartaz' as const, label: 'Em Cartaz', icon: Calendar },
    { id: 'em_breve' as const, label: 'Em Breve', icon: TrendingUp },
    { id: 'populares' as const, label: 'Populares', icon: Star },
  ];

  const genres = [
    'todos', 'ação', 'aventura', 'comédia', 'drama', 'ficção científica', 
    'terror', 'thriller', 'romance', 'animação', 'documentário'
  ];

  useEffect(() => {
    loadFilmes();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...filmes];

    // Filtro por categoria
    switch (selectedFilter) {
      case 'em_cartaz':
        filtered = filtered.filter(filme => filme.em_cartaz);
        break;
      case 'em_breve':
        filtered = filtered.filter(filme => !filme.em_cartaz && new Date(filme.data_lancamento_curada || filme.data_lancamento_api) > new Date());
        break;
      case 'populares':
        filtered = filtered.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0));
        break;
    }

    // Filtro por gênero
    if (selectedGenre !== 'todos') {
      filtered = filtered.filter(filme => {
        const generos = filme.generos_curados || filme.generos_api;
        return generos?.some(genero => 
          genero.name.toLowerCase().includes(selectedGenre.toLowerCase())
        );
      });
    }

    setFilteredFilmes(filtered);
  }, [filmes, selectedFilter, selectedGenre]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadFilmes = async () => {
    setIsLoading(true);
    try {
      const response = await realApi.getFilmes();
      setFilmes(response.results);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header da Página */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold orbe-text-primary mb-4">Filmes</h1>
        <p className="text-muted-foreground text-lg">
          Descubra os melhores filmes em cartaz, lançamentos e clássicos do cinema
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-4">
        {/* Filtros Principais */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted orbe-text-primary hover:bg-muted/80'
              }`}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Filtros Secundários */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtro de Gênero */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === 'todos' ? 'Todos os Gêneros' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Modo de Visualização */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted orbe-text-primary hover:bg-muted/80'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted orbe-text-primary hover:bg-muted/80'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? 'Carregando...' : `${filteredFilmes.length} ${filteredFilmes.length === 1 ? 'filme encontrado' : 'filmes encontrados'}`}
        </p>
      </div>

      {/* Grid de Filmes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner h-8 w-8"></div>
        </div>
      ) : filteredFilmes.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredFilmes.map((filme) => (
            <MidiaCard
              key={filme.id}
              midia={filme}
              type="filme"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
          </div>
          <h3 className="text-lg font-semibold orbe-text-primary mb-2">
            Nenhum filme encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros para encontrar mais resultados
          </p>
        </div>
      )}
    </div>
  );
}

