'use client';

import { useState, useEffect } from 'react';
import { Filter, Calendar, Star } from 'lucide-react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Serie } from '@/types';

export default function SeriesPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Estados para as opções de filtro dinâmicas
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  // Estados para os filtros selecionados
  const [selectedGenre, setSelectedGenre] = useState<string>('todos');
  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  // Efeito para buscar as opções de filtro da API
  useEffect(() => {
    const loadFilterOptions = async () => {
      setIsLoadingFilters(true);
      try {
        const response = await realApi.getSerieFilters();
        setAvailableGenres(response.genres || []);
        setAvailableYears(response.years || []);
        setAvailableStatuses(response.statuses || []);
      } catch (error) {
        console.error('Erro ao carregar opções de filtros de séries:', error);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    loadFilterOptions();
  }, []);

  // Efeito para buscar as séries com base nos filtros selecionados
  useEffect(() => {
    const loadSeries = async () => {
      setIsLoading(true);
      try {
        const response = await realApi.getSeries({
          genero: selectedGenre === 'todos' ? undefined : selectedGenre,
          ano: selectedYear === 'todos' ? undefined : selectedYear,
          status: selectedStatus === 'todos' ? undefined : selectedStatus,
        });
        setSeries(response.results);
      } catch (error) {
        console.error('Erro ao carregar séries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeries();
  }, [selectedGenre, selectedYear, selectedStatus]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold orbe-text-primary mb-4">Séries</h1>
        <p className="text-muted-foreground text-lg">Explore um universo de séries, das mais populares aos clássicos.</p>
      </div>

      <div className="mb-8 space-y-4">
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

      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? 'Carregando...' : `${series.length} ${series.length === 1 ? 'série encontrada' : 'séries encontradas'}`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="loading-spinner h-8 w-8"></div></div>
      ) : series.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {series.map((serie) => (
            <MidiaCard key={serie.id} midia={serie} type="serie" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4"><Filter className="h-12 w-12 text-muted-foreground mx-auto" /></div>
          <h3 className="text-lg font-semibold orbe-text-primary mb-2">Nenhuma série encontrada</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros para encontrar mais resultados</p>
        </div>
      )}
    </div>
  );
}