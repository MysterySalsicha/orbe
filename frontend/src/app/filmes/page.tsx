'use client';

import { useState, useEffect } from 'react';
import { Filter, Grid, Calendar, Star, TrendingUp } from 'lucide-react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Filme } from '@/types';

export default function FilmesPage() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Estados para as opções de filtro dinâmicas
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  // Estados para os filtros selecionados
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'em_cartaz' | 'em_breve' | 'populares'>('todos');
  const [selectedGenre, setSelectedGenre] = useState<string>('todos');
  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  const filters = [
    { id: 'todos' as const, label: 'Todos os Filmes', icon: Grid },
    { id: 'em_cartaz' as const, label: 'Em Cartaz', icon: Calendar },
    { id: 'em_breve' as const, label: 'Em Breve', icon: TrendingUp },
    { id: 'populares' as const, label: 'Populares', icon: Star },
  ];

  // Efeito para buscar as opções de filtro da API
  useEffect(() => {
    const loadFilterOptions = async () => {
      setIsLoadingFilters(true);
      try {
        const response = await realApi.getFilmeFilters();
        setAvailableGenres(response.genres || []);
        setAvailableYears(response.years || []);
        setAvailableStatuses(response.statuses || []);
      } catch (error) {
        console.error('Erro ao carregar opções de filtros:', error);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    loadFilterOptions();
  }, []);

  // Efeito para buscar os filmes com base nos filtros selecionados
  useEffect(() => {
    const loadFilmes = async () => {
      setIsLoading(true);
      try {
        const response = await realApi.getFilmes({ 
          filtro: selectedFilter === 'todos' ? undefined : selectedFilter,
          genero: selectedGenre === 'todos' ? undefined : selectedGenre,
          ano: selectedYear === 'todos' ? undefined : selectedYear,
          status: selectedStatus === 'todos' ? undefined : selectedStatus,
        });
        setFilmes(response.results);
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilmes();
  }, [selectedFilter, selectedGenre, selectedYear, selectedStatus]);

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
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              disabled={isLoadingFilters}
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="todos">Todos os Gêneros</option>
              {availableGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={isLoadingFilters}
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="todos">Todos os Anos</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isLoadingFilters}
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="todos">Todos os Status</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status!}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? 'Carregando...' : `${filmes.length} ${filmes.length === 1 ? 'filme encontrado' : 'filmes encontrados'}`}
        </p>
      </div>

      {/* Grid de Filmes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner h-8 w-8"></div>
        </div>
      ) : filmes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filmes.map((filme) => (
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

