'use client';

import { useState, useEffect } from 'react';
import { Filter, Award, Calendar } from 'lucide-react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Filme, Serie, Anime, Jogo } from '@/types';

interface AwardItem extends Filme, Serie, Anime, Jogo {
  type: 'filme' | 'serie' | 'anime' | 'jogo';
}

export default function PremiosPage() {
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAwardName, setSelectedAwardName] = useState<string>('todos');
  const [selectedYear, setSelectedYear] = useState<string>('todos');

  // TODO: Buscar nomes de prêmios e anos disponíveis da API
  const availableAwardNames = ['todos', 'Oscar', 'Globo de Ouro', 'The Game Awards'];
  const availableYears = ['todos', 2024, 2023, 2022];

  useEffect(() => {
    const loadAwards = async () => {
      setIsLoading(true);
      try {
        const response = await realApi.getAwards({
          awardName: selectedAwardName === 'todos' ? undefined : selectedAwardName,
          year: selectedYear === 'todos' ? undefined : parseInt(selectedYear),
        });
        setAwards(response);
      } catch (error) {
        console.error('Erro ao carregar premiações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAwards();
  }, [selectedAwardName, selectedYear]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold orbe-text-primary mb-4">Premiações</h1>
        <p className="text-muted-foreground text-lg">Explore os vencedores e indicados dos maiores prêmios da indústria.</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtro por Nome do Prêmio */}
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <select value={selectedAwardName} onChange={(e) => setSelectedAwardName(e.target.value)} className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="todos">Todos os Prêmios</option>
              {availableAwardNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          {/* Filtro por Ano */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="todos">Todos os Anos</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? 'Carregando...' : `${awards.length} ${awards.length === 1 ? 'premiação encontrada' : 'premiações encontradas'}`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="loading-spinner h-8 w-8"></div></div>
      ) : awards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {awards.map((awardItem) => (
            <MidiaCard key={`${awardItem.type}-${awardItem.id}`} midia={awardItem} type={awardItem.type} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4"><Award className="h-12 w-12 text-muted-foreground mx-auto" /></div>
          <h3 className="text-lg font-semibold orbe-text-primary mb-2">Nenhuma premiação encontrada</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros para encontrar mais resultados</p>
        </div>
      )}
    </div>
  );
}