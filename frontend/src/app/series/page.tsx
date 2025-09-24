'use client';

import { useState, useEffect } from 'react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Serie } from '@/types';

import { useState, useEffect } from 'react';
import { Filter, Grid, Star } from 'lucide-react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Serie } from '@/types';

export default function SeriesPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'populares'>('todas');
  const [selectedGenre, setSelectedGenre] = useState<string>('todos');

  const filters = [
    { id: 'todas' as const, label: 'Todas as Séries', icon: Grid },
    { id: 'populares' as const, label: 'Populares', icon: Star },
  ];

  const genres = [
    'todos', 'ação', 'aventura', 'comédia', 'drama', 'ficção científica', 
    'terror', 'thriller', 'romance', 'animação', 'documentário'
  ];

  useEffect(() => {
    const loadSeries = async () => {
      setIsLoading(true);
      try {
        const response = await realApi.getSeries({
          filtro: selectedFilter === 'todas' ? undefined : selectedFilter,
          genero: selectedGenre === 'todos' ? undefined : selectedGenre
        });
        setSeries(response.results);
      } catch (error) {
        console.error('Erro ao carregar séries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeries();
  }, [selectedFilter, selectedGenre]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold orbe-text-primary mb-4">Séries</h1>
        <p className="text-muted-foreground text-lg">Explore nossa coleção completa de séries</p>
      </div>

      <div className="mb-8 space-y-4">
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
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? 'Carregando...' : `${series.length} ${series.length === 1 ? 'série encontrada' : 'séries encontradas'}`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner h-8 w-8"></div>
        </div>
      ) : series.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {series.map((serie) => (
            <MidiaCard
              key={serie.id}
              midia={serie}
              type="serie"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold orbe-text-primary mb-2">Nenhuma série encontrada</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros.</p>
        </div>
      )}
    </div>

