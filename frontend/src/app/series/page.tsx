'use client';

import { useState, useEffect } from 'react';
import { realApi } from '@/data/realApi';
import MidiaCard from '@/components/media/MidiaCard';
import type { Serie } from '@/types';

export default function SeriesPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSeries = async () => {
      setIsLoading(true);
      try {
        const response = await realApi.getSeries();
        setSeries(response.results);
      } catch (error) {
        console.error('Erro ao carregar séries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeries();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando séries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold orbe-text-primary mb-2">Séries</h1>
            <p className="orbe-text-secondary">Explore nossa coleção completa de séries</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {series.map((serie) => (
              <MidiaCard
                key={`serie-${serie.id}`}
                midia={serie}
                type="serie"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

