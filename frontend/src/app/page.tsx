'use client';

import { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
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
  const currentYear = new Date().getFullYear();

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

  // Função para filtrar por ano corrente
  const filterByCurrentYear = useCallback((items: (Filme | Serie | Anime | Jogo)[]) => {
    return items.filter(item => {
      const releaseDate = new Date(item.data_lancamento_api);
      return releaseDate.getFullYear() === currentYear;
    });
  }, [currentYear]);

  // Função para encontrar o próximo lançamento a partir de hoje
  const findNextRelease = useCallback((items: (Filme | Serie | Anime | Jogo)[]) => {
    const today = new Date();
    const futureReleases = items.filter(item => {
      const releaseDate = new Date(item.data_lancamento_api);
      return releaseDate >= today;
    });
    
    if (futureReleases.length > 0) {
      return futureReleases.sort((a, b) => 
        new Date(a.data_lancamento_api).getTime() - new Date(b.data_lancamento_api).getTime()
      )[0];
    }
    
    return null;
  }, []);

  // Função para obter a estação atual
  const getCurrentSeason = () => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) return 'Primavera';
    else if (currentMonth >= 5 && currentMonth <= 7) return 'Verão';
    else if (currentMonth >= 8 && currentMonth <= 10) return 'Outono';
    else return 'Inverno';
  };

  // Funções para gerar títulos dinâmicos
  const getFilmesTitle = () => {
    const monthName = format(currentFilmesMonth, 'MMMM', { locale: ptBR });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return capitalizedMonth;
  };

  const getSeriesTitle = () => {
    const monthName = format(currentSeriesMonth, 'MMMM', { locale: ptBR });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return capitalizedMonth;
  };

  const getAnimesTitle = () => {
    return `Animes da Temporada de ${getCurrentSeason()}`;
  };

  const getJogosTitle = () => {
    return `Estreias de jogos de ${currentYear}`;
  };

  // Handlers para navegação temporal
  const handleFilmesNavigate = (direction: 'prev' | 'next') => {
    setCurrentFilmesMonth(prev => {
      const newMonth = direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1);
      // Garantir que não saia do ano corrente
      if (newMonth.getFullYear() === currentYear) {
        return newMonth;
      }
      return prev;
    });
  };

  const handleSeriesNavigate = (direction: 'prev' | 'next') => {
    setCurrentSeriesMonth(prev => {
      const newMonth = direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1);
      // Garantir que não saia do ano corrente
      if (newMonth.getFullYear() === currentYear) {
        return newMonth;
      }
      return prev;
    });
  };

  // Handlers para reset (clique no título) - volta para o primeiro item a ser visualizado
  const handleFilmesTitleClick = () => {
    // Encontrar o próximo lançamento e ajustar o mês
    const currentYearFilmes = filterByCurrentYear(filmes);
    const nextRelease = findNextRelease(currentYearFilmes);
    
    if (nextRelease) {
      const releaseDate = new Date(nextRelease.data_lancamento_api);
      setCurrentFilmesMonth(releaseDate);
    } else {
      // Se não há próximos lançamentos, voltar para janeiro do ano corrente
      setCurrentFilmesMonth(new Date(currentYear, 0, 1));
    }
    
    // Scroll para o início
    filmesCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleSeriesTitleClick = () => {
    // Encontrar o próximo lançamento e ajustar o mês
    const currentYearSeries = filterByCurrentYear(series);
    const nextRelease = findNextRelease(currentYearSeries);
    
    if (nextRelease) {
      const releaseDate = new Date(nextRelease.data_lancamento_api);
      setCurrentSeriesMonth(releaseDate);
    } else {
      // Se não há próximos lançamentos, voltar para janeiro do ano corrente
      setCurrentSeriesMonth(new Date(currentYear, 0, 1));
    }
    
    // Scroll para o início
    seriesCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleAnimesTitleClick = () => {
    // Para animes, volta para o primeiro item mais relevante (próximo episódio)
    animesCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleJogosTitleClick = () => {
    // Para jogos, volta para o próximo lançamento
    jogosCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  // Funções para filtrar e ordenar os dados conforme especificações
  const getFilteredFilmes = () => {
    // Filtrar apenas filmes do ano corrente
    const currentYearFilmes = filterByCurrentYear(filmes);
    
    // Filtrar por mês atual selecionado
    const monthFiltered = currentYearFilmes.filter(filme => {
      const releaseDate = new Date(filme.data_lancamento_api);
      return releaseDate.getMonth() === currentFilmesMonth.getMonth() &&
             releaseDate.getFullYear() === currentFilmesMonth.getFullYear();
    });
    
    // Ordenar por data futura primeiro
    return monthFiltered.sort((a, b) => {
      const dateA = new Date(a.data_lancamento_api);
      const dateB = new Date(b.data_lancamento_api);
      const now = new Date();
      
      const aFuture = dateA >= now;
      const bFuture = dateB >= now;
      
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      
      return aFuture ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  };

  const getFilteredSeries = () => {
    // Filtrar apenas séries do ano corrente
    const currentYearSeries = filterByCurrentYear(series);
    
    // Filtrar por mês atual selecionado
    const monthFiltered = currentYearSeries.filter(serie => {
      const releaseDate = new Date(serie.data_lancamento_api);
      return releaseDate.getMonth() === currentSeriesMonth.getMonth() &&
             releaseDate.getFullYear() === currentSeriesMonth.getFullYear();
    });
    
    // Ordenar por data futura primeiro
    return monthFiltered.sort((a, b) => {
      const dateA = new Date(a.data_lancamento_api);
      const dateB = new Date(b.data_lancamento_api);
      const now = new Date();
      
      const aFuture = dateA >= now;
      const bFuture = dateB >= now;
      
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      
      return aFuture ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  };

  const getFilteredAnimes = () => {
    // Filtrar animes finalizados (remover do carrossel)
    const activeAnimes = animes.filter(anime => {
      // Se não tem próximo episódio, considerar finalizado
      return anime.proximo_episodio !== null && anime.proximo_episodio !== undefined;
    });
    
    // Ordenar por proximidade do próximo episódio
    return activeAnimes.sort((a, b) => {
      if (!a.proximo_episodio && !b.proximo_episodio) return 0;
      if (!a.proximo_episodio) return 1;
      if (!b.proximo_episodio) return -1;
      
      const dateA = new Date(a.proximo_episodio);
      const dateB = new Date(b.proximo_episodio);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const getFilteredJogos = () => {
    // Filtrar apenas jogos do ano corrente
    const currentYearJogos = filterByCurrentYear(jogos);
    
    // Ordenar: próximos lançamentos primeiro, mas manter os já lançados no carrossel
    return currentYearJogos.sort((a, b) => {
      const dateA = new Date(a.data_lancamento_api);
      const dateB = new Date(b.data_lancamento_api);
      const now = new Date();
      
      const aFuture = dateA > now;
      const bFuture = dateB > now;
      
      // Próximos lançamentos primeiro
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      
      // Entre futuros, ordenar por data mais próxima
      // Entre passados, ordenar por data mais recente
      return aFuture ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  };

  // Inicializar os meses com base no próximo lançamento
  useEffect(() => {
    if (filmes.length > 0) {
      const currentYearFilmes = filterByCurrentYear(filmes);
      const nextRelease = findNextRelease(currentYearFilmes);
      if (nextRelease) {
        const releaseDate = new Date(nextRelease.data_lancamento_api);
        setCurrentFilmesMonth(releaseDate);
      }
    }
  }, [filmes, filterByCurrentYear, findNextRelease]);

  useEffect(() => {
    if (series.length > 0) {
      const currentYearSeries = filterByCurrentYear(series);
      const nextRelease = findNextRelease(currentYearSeries);
      if (nextRelease) {
        const releaseDate = new Date(nextRelease.data_lancamento_api);
        setCurrentSeriesMonth(releaseDate);
      }
    }
  }, [series, filterByCurrentYear, findNextRelease]);

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
        {/* Ordem conforme especificação: 1. Filmes, 2. Animes, 3. Séries, 4. Jogos */}
        
        {/* 1. Carrossel de Filmes */}
        <Carousel
          ref={filmesCarouselRef}
          title={getFilmesTitle()}
          items={getFilteredFilmes()}
          type="filme"
          showNavigation={true}
          onTitleClick={handleFilmesTitleClick}
          onNavigate={handleFilmesNavigate}
        />

        {/* 2. Carrossel de Animes */}
        <Carousel
          ref={animesCarouselRef}
          title={getAnimesTitle()}
          items={getFilteredAnimes()}
          type="anime"
          showNavigation={false}
          onTitleClick={handleAnimesTitleClick}
        />

        {/* 3. Carrossel de Séries */}
        <Carousel
          ref={seriesCarouselRef}
          title={getSeriesTitle()}
          items={getFilteredSeries()}
          type="serie"
          showNavigation={true}
          onTitleClick={handleSeriesTitleClick}
          onNavigate={handleSeriesNavigate}
        />

        {/* 4. Carrossel de Jogos */}
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