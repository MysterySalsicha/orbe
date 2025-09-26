'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Carousel from '@/components/media/Carousel';
import { realApi } from '@/data/realApi';
import type { Filme, Serie, Anime, Jogo, Midia, TipoMidia } from '@/types';
import { Button } from "@/components/ui/button";

type GroupedMedia<T> = { [key: string]: T[] };
type Season = 'Inverno' | 'Primavera' | 'Verão' | 'Outono';

const SEASONS_ORDER: Season[] = ['Inverno', 'Primavera', 'Verão', 'Outono'];

import { useAppStore } from '@/stores/appStore';

const getSeasonFromMonth = (month: number): Season => {
  if (month >= 2 && month <= 4) return 'Primavera';
  if (month >= 5 && month <= 7) return 'Verão';
  if (month >= 8 && month <= 10) return 'Outono';
  return 'Inverno';
};

export default function Home() {
  const {
    userInteractions,
    upsertInteraction
  } = useAppStore();

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
  const [animeFilter, setAnimeFilter] = useState<'todos' | 'novos' | 'continuacoes'>('todos');
  const [movieTypeFilter, setMovieTypeFilter] = useState<'todos' | 'cinema' | 'plataforma'>('todos');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todas');
  const currentYear = new Date().getFullYear();
  const filmesCarouselRef = useRef<HTMLDivElement>(null);
  const animesCarouselRef = useRef<HTMLDivElement>(null);
  const seriesCarouselRef = useRef<HTMLDivElement>(null);
  const jogosCarouselRef = useRef<HTMLDivElement>(null);

  const handleInteraction = async (action: string, midia: Midia, type: TipoMidia) => {
    try {
      const newInteraction = await realApi.upsertInteraction({
        midia_id: midia.id,
        tipo_midia: type,
        status: action,
      });
      upsertInteraction(newInteraction);
    } catch (error) {
      console.error('Erro ao salvar interação:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [filmesData, seriesData, animesData, jogosData] = await Promise.all([
          realApi.getFilmes({ filtro: 'populares', page: 1 }),
          realApi.getSeries({ page: 1 }),
          realApi.getAnimes({ page: 1 }),
          realApi.getJogos({ page: 1 })
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
    const groupedF = filmes.reduce((acc, filme) => {
      let monthKey = 'A Ser Anunciado';
      if (filme.data_lancamento_api) {
        try {
          monthKey = format(parseISO(filme.data_lancamento_api), 'yyyy-MM');
        } catch (error) {
          console.error(`Data inválida para o filme ${filme.id}: ${filme.data_lancamento_api}`, error);
        }
      }
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(filme);
      return acc;
    }, {} as GroupedMedia<Filme>);
    setGroupedFilmes(groupedF);
    setFilmesKeys(Object.keys(groupedF).sort());

    const groupedS = series.reduce((acc, serie) => {
      let monthKey = 'A Ser Anunciado';
      if (serie.data_lancamento_api) {
        try {
          monthKey = format(parseISO(serie.data_lancamento_api), 'yyyy-MM');
        } catch (error) {
          console.error(`Data inválida para a série ${serie.id}: ${serie.data_lancamento_api}`, error);
        }
      }
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(serie);
      return acc;
    }, {} as GroupedMedia<Serie>);
    setGroupedSeries(groupedS);
    setSeriesKeys(Object.keys(groupedS).sort());

    const groupedA = animes.reduce((acc, anime) => {
      let seasonKey = 'A Ser Anunciado';
      if (anime.data_lancamento_api) {
        try {
          const releaseDate = parseISO(anime.data_lancamento_api);
          const season = getSeasonFromMonth(releaseDate.getMonth());
          const year = releaseDate.getFullYear();
          seasonKey = `${season} de ${year}`;
        } catch (error) {
          console.error(`Data inválida para o anime ${anime.id}: ${anime.data_lancamento_api}`, error);
        }
      }
      if (!acc[seasonKey]) acc[seasonKey] = [];
      acc[seasonKey].push(anime);
      return acc;
    }, {} as GroupedMedia<Anime>);
    setGroupedAnimes(groupedA);
    const sortedAnimeKeys = Object.keys(groupedA).sort((a, b) => {
        if (a === 'A Ser Anunciado') return 1;
        if (b === 'A Ser Anunciado') return -1;
        const [seasonA, , yearA] = a.split(' ');
        const [seasonB, , yearB] = b.split(' ');
        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
        return SEASONS_ORDER.indexOf(seasonA as Season) - SEASONS_ORDER.indexOf(seasonB as Season);
    });
    setAnimesKeys(sortedAnimeKeys);

  }, [filmes, series, animes]);

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

    if (key === 'A Ser Anunciado') {
      title = `${prefix} com data a ser anunciada`;
    } else if (prefix.includes('Animes')) {
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

  const availablePlatforms = useMemo(() => {
    const allPlatforms = filmes.flatMap(filme => filme.plataformas_api?.map(p => p.nome) ?? []);
    return ['todas', ...Array.from(new Set(allPlatforms))];
  }, [filmes]);

  const filteredFilmes = useMemo(() => {
    let items = filmesData.items;

    if (movieTypeFilter === 'cinema') {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      items = items.filter(filme => 
        filme.status === 'Released' && 
        new Date(filme.data_lancamento_api) > twoMonthsAgo &&
        (!filme.plataformas_api || filme.plataformas_api.length === 0)
      );
    } else if (movieTypeFilter === 'plataforma') {
      items = items.filter(filme => filme.plataformas_api && filme.plataformas_api.length > 0);
    }

    if (selectedPlatform !== 'todas') {
      items = items.filter(filme => filme.plataformas_api?.some(p => p.nome === selectedPlatform));
    }

    return items;
  }, [filmesData.items, movieTypeFilter, selectedPlatform]);

  const filteredAnimes = useMemo(() => {
    if (animeFilter === 'todos') {
      return animesData.items;
    }
    return animesData.items.filter(anime => {
      const isSequel = anime.relations?.some(rel => rel.relationType === 'PREQUEL');
      if (animeFilter === 'continuacoes') {
        return isSequel;
      }
      if (animeFilter === 'novos') {
        return !isSequel;
      }
      return false;
    });
  }, [animesData.items, animeFilter]);

  const getJogosTitle = () => `Estreias de jogos de ${currentYear}`;
  const getFilteredJogos = () => {
    return jogos
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
        <div>
          <div className="flex justify-end items-center space-x-4 mb-4">
            <Button variant={movieTypeFilter === 'todos' ? 'default' : 'outline'} onClick={() => setMovieTypeFilter('todos')}>Todos</Button>
            <Button variant={movieTypeFilter === 'cinema' ? 'default' : 'outline'} onClick={() => setMovieTypeFilter('cinema')}>Cinema</Button>
            <Button variant={movieTypeFilter === 'plataforma' ? 'default' : 'outline'} onClick={() => setMovieTypeFilter('plataforma')}>Streaming</Button>
            <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} disabled={movieTypeFilter !== 'plataforma'} className="bg-muted border border-border rounded-lg px-3 py-2 text-sm orbe-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
              {availablePlatforms.map(p => <option key={p} value={p}>{p === 'todas' ? 'Todas as Plataformas' : p}</option>)}
            </select>
          </div>
          <Carousel ref={filmesCarouselRef} title={filmesData.title} items={filteredFilmes} type="filme" showNavigation={filmesKeys.length > 1} onTitleClick={handleFilmesTitleClick} onNavigate={handleFilmesNavigate} userInteractions={userInteractions} onInteraction={(action, midia) => handleInteraction(action, midia, "filme")} />
        </div>
        
        <div>
          <div className="flex justify-end items-center space-x-4 mb-4">
            <Button variant={animeFilter === 'todos' ? 'default' : 'outline'} onClick={() => setAnimeFilter('todos')}>Todos</Button>
            <Button variant={animeFilter === 'novos' ? 'default' : 'outline'} onClick={() => setAnimeFilter('novos')}>Novos</Button>
            <Button variant={animeFilter === 'continuacoes' ? 'default' : 'outline'} onClick={() => setAnimeFilter('continuacoes')}>Continuações</Button>
          </div>
          <Carousel ref={animesCarouselRef} title={animesData.title} items={filteredAnimes} type="anime" showNavigation={animesKeys.length > 1} onTitleClick={handleAnimesTitleClick} onNavigate={handleAnimesNavigate} userInteractions={userInteractions} onInteraction={(action, midia) => handleInteraction(action, midia, "anime")} />
        </div>

        <Carousel ref={seriesCarouselRef} title={seriesData.title} items={seriesData.items} type="serie" showNavigation={seriesKeys.length > 1} onTitleClick={handleSeriesTitleClick} onNavigate={handleSeriesNavigate} userInteractions={userInteractions} onInteraction={(action, midia) => handleInteraction(action, midia, "serie")} />
        <Carousel ref={jogosCarouselRef} title={getJogosTitle()} items={getFilteredJogos()} type="jogo" showNavigation={false} onTitleClick={handleJogosTitleClick} userInteractions={userInteractions} onInteraction={(action, midia) => handleInteraction(action, midia, "jogo")} />
      </main>
    </div>
  );
}
