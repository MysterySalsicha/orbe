'use client';

import { useState, useEffect } from 'react';
import { Filter, Gamepad2, Cpu, Star } from 'lucide-react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Jogo } from '@/types';

export default function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Estados para as opções de filtro dinâmicas
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [availableGameModes, setAvailableGameModes] = useState<string[]>([]);

  // Estados para os filtros selecionados
  const [selectedGenre, setSelectedGenre] = useState<string>('todos');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todos');
  const [selectedGameMode, setSelectedGameMode] = useState<string>('todos');

  // Efeito para buscar as opções de filtro da API
  useEffect(() => {
    const loadFilterOptions = async () => {
      setIsLoadingFilters(true);
      try {
        const response = await realApi.getJogoFilters();
        setAvailableGenres(response.genres || []);
        setAvailablePlatforms(response.platforms || []);
        setAvailableGameModes(response.gameModes || []);
      } catch (error) {
        console.error('Erro ao carregar opções de filtros de jogos:', error);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    loadFilterOptions();
  }, []);

  // Efeito para buscar os jogos com base nos filtros selecionados
  useEffect(() => {
    const loadJogos = async () => {
      setIsLoading(true);
      try {
        const response = await realApi.getJogos({
          genero: selectedGenre === 'todos' ? undefined : selectedGenre,
          plataforma: selectedPlatform === 'todos' ? undefined : selectedPlatform,
          modo: selectedGameMode === 'todos' ? undefined : selectedGameMode,
        });
        setJogos(response.results);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJogos();
  }, [selectedGenre, selectedPlatform, selectedGameMode]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold orbe-text-primary mb-4">Jogos</h1>
        <p className="text-muted-foreground text-lg">Explore o vasto universo dos games, dos indies aos blockbusters.</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Gênero */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} disabled={isLoadingFilters} className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
              <option value="todos">Todos os Gêneros</option>
              {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {/* Plataforma */}
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} disabled={isLoadingFilters} className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
              <option value="todos">Todas as Plataformas</option>
              {availablePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {/* Modo de Jogo */}
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <select value={selectedGameMode} onChange={(e) => setSelectedGameMode(e.target.value)} disabled={isLoadingFilters} className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
              <option value="todos">Todos os Modos</option>
              {availableGameModes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? 'Carregando...' : `${jogos.length} ${jogos.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="loading-spinner h-8 w-8"></div></div>
      ) : jogos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {jogos.map((jogo) => (
            <MidiaCard key={jogo.id} midia={jogo} type="jogo" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4"><Filter className="h-12 w-12 text-muted-foreground mx-auto" /></div>
          <h3 className="text-lg font-semibold orbe-text-primary mb-2">Nenhum jogo encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros para encontrar mais resultados</p>
        </div>
      )}
    </div>
  );
}