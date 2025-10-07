'use client';

import { useState, useEffect } from 'react';
import MediaCarousel from '@/components/ui/MediaCarousel';
import AnimeCarousel from '@/components/media/AnimeCarousel';
import MidiaCardSkeleton from '@/components/media/MidiaCardSkeleton';
import type { Midia, Anime } from '@/types';

const fetchMediaByYear = async (mediaType: 'filmes' | 'series' | 'jogos') => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const [currentYearResponse, nextYearResponse] = await Promise.all([
    fetch(`/api/${mediaType}/by-year?year=${currentYear}`),
    fetch(`/api/${mediaType}/by-year?year=${nextYear}`)
  ]);

  if (!currentYearResponse.ok || !nextYearResponse.ok) {
    console.warn(`Failed to fetch some data for ${mediaType}`);
  }

  const currentYearData: Midia[] = currentYearResponse.ok ? await currentYearResponse.json() : [];
  const nextYearData: Midia[] = nextYearResponse.ok ? await nextYearResponse.json() : [];

  const combinedData = [...currentYearData, ...nextYearData];
  return combinedData.sort((a, b) => new Date(a.data_lancamento_api).getTime() - new Date(b.data_lancamento_api).getTime());
};

const fetchInitialAnimeData = async () => {
    const getSeason = (date: Date) => {
        const month = date.getMonth();
        if (month >= 0 && month <= 2) return 'WINTER';
        if (month >= 3 && month <= 5) return 'SPRING';
        if (month >= 6 && month <= 8) return 'SUMMER';
        return 'FALL';
    };
    const year = new Date().getFullYear();
    const season = getSeason(new Date());

    const response = await fetch(`/api/animes/by-season?year=${year}&season=${season}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch animes`);
    }
    return response.json();
}

const calculateStartIndex = (data: Midia[]) => {
    if (!data || data.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const index = data.findIndex(item => new Date(item.data_lancamento_api) >= today);
    return index > -1 ? index : data.length - 1;
}

const CarouselSkeleton = () => (
  <div className="overflow-hidden">
    <div className="flex -ml-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="relative min-w-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
          <MidiaCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const [initialData, setInitialData] = useState<{ filmes: Midia[], series: Midia[], jogos: Midia[], animes: Anime[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [filmes, series, jogos, animes] = await Promise.all([
          fetchMediaByYear('filmes'),
          fetchMediaByYear('series'),
          fetchMediaByYear('jogos'),
          fetchInitialAnimeData(),
        ]);
        setInitialData({ filmes, series, jogos, animes });
      } catch (error) {
        console.error("Failed to load initial carousel data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  return (
    <div className="bg-background">
      <main className="container mx-auto py-8 space-y-12">
        
        <section>
          <h2 className="text-xl font-bold mb-4 text-center">Filmes</h2>
          {isLoading || !initialData ? <CarouselSkeleton /> : <MediaCarousel mediaType="filmes" initialData={initialData.filmes} startIndex={calculateStartIndex(initialData.filmes)} />}
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-4 text-center">Animes</h2>
          {isLoading || !initialData ? <CarouselSkeleton /> : <AnimeCarousel initialData={initialData.animes} />}
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-4 text-center">Séries</h2>
          {isLoading || !initialData ? <CarouselSkeleton /> : <MediaCarousel mediaType="series" initialData={initialData.series} startIndex={calculateStartIndex(initialData.series)} />}
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-4 text-center">Jogos</h2>
          {isLoading || !initialData ? <CarouselSkeleton /> : <MediaCarousel mediaType="jogos" initialData={initialData.jogos} startIndex={calculateStartIndex(initialData.jogos)} />}
        </section>

      </main>
    </div>
  );
}
