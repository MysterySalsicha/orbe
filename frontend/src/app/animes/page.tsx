'use client';

import { useState, useEffect } from 'react';
import { mockApi } from '@/data/mockData';
import MidiaCard from '@/components/media/MidiaCard';
import type { Anime } from '@/types';

export default function AnimesPage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnimes = async () => {
      setIsLoading(true);
      try {
        const data = await mockApi.getAnimes();
        setAnimes(data);
      } catch (error) {
        console.error('Erro ao carregar animes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimes();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando animes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold orbe-text-primary mb-2">Animes</h1>
            <p className="orbe-text-secondary">Explore nossa coleção completa de animes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animes.map((anime) => (
              <MidiaCard
                key={`anime-${anime.id}`}
                midia={anime}
                type="anime"
                showCountdown={true}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

