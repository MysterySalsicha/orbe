'use client';

import { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Carousel from '@/components/media/Carousel';
import { realApi } from '@/data/realApi';
import type { Filme, Serie, Anime, Jogo } from '@/types';

export default function Home() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs para os carrosséis
  const filmesCarouselRef = useRef<HTMLDivElement>(null);
  const animesCarouselRef = useRef<HTMLDivElement>(null);
  const seriesCarouselRef = useRef<HTMLDivElement>(null);
  const jogosCarouselRef = useRef<HTMLDivElement>(null);

  // Estados para navegação temporal
  const [currentFilmesMonth, setCurrentFilmesMonth] = useState(new Date());
  const [currentSeriesMonth, setCurrentSeriesMonth] = useState(new Date());
  const [currentJogosYear] = useState(new Date().getFullYear());

  // Carrega dados reais da API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [filmesData, seriesData, animesData, jogosData] = await Promise.all([
          realApi.getFilmes('populares', undefined, 1),
          realApi.getSeries(undefined, 1),
          realApi.getAnimes(undefined, 1),
          realApi.getJogos(undefined, 1)
        ]);

        setFilmes(filmesData.results);
        setSeries(seriesData.results);
        setAnimes(animesData.results);
        setJogos(jogosData.results);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setFilmes([]);
        setSeries([]);
        setAnimes([]);
        setJogos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Funções para gerar títulos dinâmicos
  const getFilmesTitle = () => {
    const monthName = format(currentFilmesMonth, 'MMMM', { locale: ptBR });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `Filmes que estreiam em ${capitalizedMonth}`;
  };

  const getSeriesTitle = () => {
    const monthName = format(currentSeriesMonth, 'MMMM', { locale: ptBR });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `Séries que estreiam em ${capitalizedMonth}`;
  };

  const getAnimesTitle = () => {
    const currentMonth = new Date().getMonth();
    let season = '';

    if (currentMonth >= 2 && currentMonth <= 4) season = 'Primavera';
    else if (currentMonth >= 5 && currentMonth <= 7) season = 'Verão';
    else if (currentMonth >= 8 && currentMonth <= 10) season = 'Outono';
    else season = 'Inverno';

    return `Animes da Temporada de ${season}`;
  };

  const getJogosTitle = () => {
    return `Estreias de jogos de ${currentJogosYear}`;
  };

  // Handlers para navegação temporal
  const handleFilmesNavigate = (direction: 'prev' | 'next') => {
    setCurrentFilmesMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const handleSeriesNavigate = (direction: 'prev' | 'next') => {
    setCurrentSeriesMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  // Handlers para reset (clique no título)
  const handleFilmesTitleClick = () => {
    // setCurrentFilmesMonth(new Date()); // Comentado para teste de performance
    filmesCarouselRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  };

  const handleAnimesTitleClick = () => {
    // console.log('Reset animes carousel'); // Comentado para teste de performance
    animesCarouselRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  };

  const handleSeriesTitleClick = () => {
    // setCurrentSeriesMonth(new Date()); // Comentado para teste de performance
    seriesCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleJogosTitleClick = () => {
    // console.log('Reset jogos carousel'); // Comentado para teste de performance
    jogosCarouselRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  };

  // Filtra itens por data (simulação - em produção seria feito no backend)
  const getFilteredFilmes = () => {
    return filmes;
  };

  const getFilteredSeries = () => {
    return series;
  };

  const getFilteredAnimes = () => {
    return animes.sort((a, b) => {
      if (!a.proximo_episodio && !b.proximo_episodio) return 0;
      if (!a.proximo_episodio) return 1;
      if (!b.proximo_episodio) return -1;
      
      const dateA = new Date(a.proximo_episodio);
      const dateB = new Date(b.proximo_episodio);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const getFilteredJogos = () => {
    return jogos.sort((a, b) => {
      const dateA = new Date(a.data_lancamento_api);
      const dateB = new Date(b.data_lancamento_api);
      const now = new Date();
      
      const aFuture = dateA > now;
      const bFuture = dateB > now;
      
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      
      return aFuture ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Carrossel de Filmes */}
        <Carousel
          ref={filmesCarouselRef}
          title={getFilmesTitle()}
          items={getFilteredFilmes()}
          type="filme"
          showNavigation={true}
          onTitleClick={handleFilmesTitleClick}
          onNavigate={handleFilmesNavigate}
        />

        {/* Carrossel de Animes */}
        <Carousel
          ref={animesCarouselRef}
          title={getAnimesTitle()}
          items={getFilteredAnimes()}
          type="anime"
          showNavigation={false}
          onTitleClick={handleAnimesTitleClick}
        />

        {/* Carrossel de Séries */}
        <Carousel
          ref={seriesCarouselRef}
          title={getSeriesTitle()}
          items={getFilteredSeries()}
          type="serie"
          showNavigation={true}
          onTitleClick={handleSeriesTitleClick}
          onNavigate={handleSeriesNavigate}
        />

        {/* Carrossel de Jogos */}
        <Carousel
          ref={jogosCarouselRef}
          title={getJogosTitle()}
          items={getFilteredJogos()}
          type="jogo"
          showNavigation={false}
          onTitleClick={handleJogosTitleClick}
        />
      </main>
    </div>
  );
}