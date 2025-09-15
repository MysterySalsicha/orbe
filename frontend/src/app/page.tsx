'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Carousel from '@/components/media/Carousel';
import { realApi } from '@/data/realApi';
import type { Filme, Serie, Anime, Jogo, Midia } from '@/types';

type GroupedMedia<T> = { [key: string]: T[] };
type Season = 'Inverno' | 'Primavera' | 'Verão' | 'Outono';

const SEASONS_ORDER: Season[] = ['Inverno', 'Primavera', 'Verão', 'Outono'];

const getSeasonFromMonth = (month: number): Season => {
  if (month >= 2 && month <= 4) return 'Primavera';
  if (month >= 5 && month <= 7) return 'Verão';
  if (month >= 8 && month <= 10) return 'Outono';
  return 'Inverno';
};

export default function Home() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedFilmes, setGroupedFilmes] = useState<GroupedMedia<Filme>>({});
  const [groupedSeries, setGroupedSeries] = useState<GroupedMedia<Serie>>({});
  const [groupedAnimes, setGroupedAnimes] = useState<GroupedMedia<Anime>>({});
  const [filmesKeys, setFilmesKeys] = useState<string[]>([]);
  const [seriesKeys, setSeriesKeys] = useState<string[]>([]);
  const [animesKeys, setAnimesKeys] = useState<string[]>([]);
  const [currentFilmesIndex, setCurrentFilmesIndex] = useState(0);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [currentAnimesIndex, setCurrentAnimesIndex] = useState(0);
  const currentYear = new Date().getFullYear();
  const filmesCarouselRef = useRef<HTMLDivElement>(null);
  const animesCarouselRef = useRef<HTMLDivElement>(null);
  const seriesCarouselRef = useRef<HTMLDivElement>(null);
  const jogosCarouselRef = useRef<HTMLDivElement>(null);

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
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const currentYearFilmes = filmes.filter(f => new Date(f.data_lancamento_api).getFullYear() === currentYear);
    const groupedF = currentYearFilmes.reduce((acc, filme) => {
      const monthKey = format(new Date(filme.data_lancamento_api), 'yyyy-MM');
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(filme);
      return acc;
    }, {} as GroupedMedia<Filme>);
    setGroupedFilmes(groupedF);
    setFilmesKeys(Object.keys(groupedF).sort());

    const currentYearSeries = series.filter(s => new Date(s.data_lancamento_api).getFullYear() === currentYear);
    const groupedS = currentYearSeries.reduce((acc, serie) => {
      const monthKey = format(new Date(serie.data_lancamento_api), 'yyyy-MM');
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(serie);
      return acc;
    }, {} as GroupedMedia<Serie>);
    setGroupedSeries(groupedS);
    setSeriesKeys(Object.keys(groupedS).sort());

    const groupedA = animes.reduce((acc, anime) => {
      const releaseDate = new Date(anime.data_lancamento_api);
      const season = getSeasonFromMonth(releaseDate.getMonth());
      const year = releaseDate.getFullYear();
      const seasonKey = `${season} de ${year}`;
      if (!acc[seasonKey]) acc[seasonKey] = [];
      acc[seasonKey].push(anime);
      return acc;
    }, {} as GroupedMedia<Anime>);
    setGroupedAnimes(groupedA);
    const sortedAnimeKeys = Object.keys(groupedA).sort((a, b) => {
        const [seasonA, , yearA] = a.split(' ');
        const [seasonB, , yearB] = b.split(' ');
        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
        return SEASONS_ORDER.indexOf(seasonA as Season) - SEASONS_ORDER.indexOf(seasonB as Season);
    });
    setAnimesKeys(sortedAnimeKeys);

  }, [filmes, series, animes, currentYear]);

  useEffect(() => {
    const today = new Date();
    const currentMonthKey = format(today, 'yyyy-MM');
    
    const startingFilmesIndex = filmesKeys.findIndex(key => key >= currentMonthKey);
    setCurrentFilmesIndex(startingFilmesIndex !== -1 ? startingFilmesIndex : Math.max(0, filmesKeys.length - 1));

    const startingSeriesIndex = seriesKeys.findIndex(key => key >= currentMonthKey);
    setCurrentSeriesIndex(startingSeriesIndex !== -1 ? startingSeriesIndex : Math.max(0, seriesKeys.length - 1));

    const currentSeason = getSeasonFromMonth(today.getMonth());
    const currentSeasonKey = `${currentSeason} de ${today.getFullYear()}`;
    const startingAnimesIndex = animesKeys.findIndex(key => key === currentSeasonKey);
    setCurrentAnimesIndex(startingAnimesIndex !== -1 ? startingAnimesIndex : Math.max(0, animesKeys.length - 1));

  }, [filmesKeys, seriesKeys, animesKeys]);

  const handleFilmesNavigate = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? currentFilmesIndex + 1 : currentFilmesIndex - 1;
    if (newIndex >= 0 && newIndex < filmesKeys.length) {
      setCurrentFilmesIndex(newIndex);
    }
  }, [filmesKeys, currentFilmesIndex]);

  const handleSeriesNavigate = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? currentSeriesIndex + 1 : currentSeriesIndex - 1;
    if (newIndex >= 0 && newIndex < seriesKeys.length) {
      setCurrentSeriesIndex(newIndex);
    }
  }, [seriesKeys, currentSeriesIndex]);

  const handleAnimesNavigate = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? currentAnimesIndex + 1 : currentAnimesIndex - 1;
    if (newIndex >= 0 && newIndex < animesKeys.length) {
      setCurrentAnimesIndex(newIndex);
    }
  }, [animesKeys, currentAnimesIndex]);

  const getTitleAndItems = <T extends Midia>(
    prefix: string,
    keys: string[],
    currentIndex: number,
    groupedData: GroupedMedia<T>
  ): { title: string; items: T[] } => {
    if (keys.length === 0) return { title: `${prefix}...`, items: [] };
    
    const key = keys[currentIndex];
    let title: string;

    if (prefix.includes('Animes')) {
        title = `Animes da ${key}`;
    } else {
        const [year, month] = key.split('-');
        const monthName = format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM', { locale: ptBR });
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        title = `${prefix} que estreiam em ${capitalizedMonth}`;
    }
    
    const items = groupedData[key] || [];
    items.sort((a, b) => {
        const dateA = new Date(a.data_lancamento_api);
        const dateB = new Date(b.data_lancamento_api);
        const now = new Date();
        const aIsFuture = dateA >= now;
        const bIsFuture = dateB >= now;
        if (aIsFuture && !bIsFuture) return -1;
        if (!bIsFuture && aIsFuture) return 1;
        if (aIsFuture) return dateA.getTime() - dateB.getTime();
        return dateB.getTime() - dateA.getTime();
    });

    return { title, items };
  };

  const filmesData = getTitleAndItems('Filmes', filmesKeys, currentFilmesIndex, groupedFilmes);
  const seriesData = getTitleAndItems('Séries', seriesKeys, currentSeriesIndex, groupedSeries);
  const animesData = getTitleAndItems('Animes', animesKeys, currentAnimesIndex, groupedAnimes);

  const getJogosTitle = () => `Estreias de jogos de ${currentYear}`;
  const getFilteredJogos = () => {
    return jogos
      .filter(j => new Date(j.data_lancamento_api).getFullYear() === currentYear)
      .sort((a, b) => {
        const dateA = new Date(a.data_lancamento_api);
        const dateB = new Date(b.data_lancamento_api);
        const now = new Date();
        const aIsFuture = dateA >= now;
        const bIsFuture = dateB >= now;
        if (aIsFuture && !bIsFuture) return -1;
        if (!bIsFuture && aIsFuture) return 1;
        if (aIsFuture) return dateA.getTime() - dateB.getTime();
        return dateB.getTime() - dateA.getTime();
      });
  };

  const findInitialFilmesIndex = useCallback(() => {
    const todayKey = format(new Date(), 'yyyy-MM');
    const index = filmesKeys.findIndex(key => key >= todayKey);
    return index !== -1 ? index : Math.max(0, filmesKeys.length - 1);
  }, [filmesKeys]);

  const findInitialSeriesIndex = useCallback(() => {
    const todayKey = format(new Date(), 'yyyy-MM');
    const index = seriesKeys.findIndex(key => key >= todayKey);
    return index !== -1 ? index : Math.max(0, seriesKeys.length - 1);
  }, [seriesKeys]);

  const findInitialAnimesIndex = useCallback(() => {
    const today = new Date();
    const currentSeasonKey = `${getSeasonFromMonth(today.getMonth())} de ${today.getFullYear()}`;
    const index = animesKeys.findIndex(key => key === currentSeasonKey);
    return index !== -1 ? index : Math.max(0, animesKeys.length - 1);
  }, [animesKeys]);

  const handleFilmesTitleClick = useCallback(() => {
      const newIndex = findInitialFilmesIndex();
      setCurrentFilmesIndex(newIndex);
      filmesCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [findInitialFilmesIndex, setCurrentFilmesIndex]);

  const handleSeriesTitleClick = useCallback(() => {
      const newIndex = findInitialSeriesIndex();
      setCurrentSeriesIndex(newIndex);
      seriesCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [findInitialSeriesIndex, setCurrentSeriesIndex]);

  const handleAnimesTitleClick = useCallback(() => {
      const newIndex = findInitialAnimesIndex();
      setCurrentAnimesIndex(newIndex);
      animesCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [findInitialAnimesIndex, setCurrentAnimesIndex]);

  const handleJogosTitleClick = useCallback(() => {
    jogosCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, []);

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
        <Carousel ref={filmesCarouselRef} title={filmesData.title} items={filmesData.items} type="filme" showNavigation={filmesKeys.length > 1} onTitleClick={handleFilmesTitleClick} onNavigate={handleFilmesNavigate} />
        <Carousel ref={animesCarouselRef} title={animesData.title} items={animesData.items} type="anime" showNavigation={animesKeys.length > 1} onTitleClick={handleAnimesTitleClick} onNavigate={handleAnimesNavigate} />
        <Carousel ref={seriesCarouselRef} title={seriesData.title} items={seriesData.items} type="serie" showNavigation={seriesKeys.length > 1} onTitleClick={handleSeriesTitleClick} onNavigate={handleSeriesNavigate} />
        <Carousel ref={jogosCarouselRef} title={getJogosTitle()} items={getFilteredJogos()} type="jogo" showNavigation={false} onTitleClick={handleJogosTitleClick} />
      </main>
    </div>
  );
}
