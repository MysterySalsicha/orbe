'use client';

import { useState, useEffect } from 'react';
import { mockApi } from '@/data/mockData';
import MidiaCard from '@/components/media/MidiaCard';
import type { Jogo } from '@/types';

export default function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJogos = async () => {
      setIsLoading(true);
      try {
        const data = await mockApi.getJogos();
        setJogos(data);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJogos();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold orbe-text-primary mb-2">Jogos</h1>
            <p className="orbe-text-secondary">Explore nossa coleção completa de jogos</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {jogos.map((jogo) => (
              <MidiaCard
                key={`jogo-${jogo.id}`}
                midia={jogo}
                type="jogo"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

