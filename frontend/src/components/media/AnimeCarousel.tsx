'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, CalendarDays, ListOrdered, Filter } from 'lucide-react';

import MidiaCard from './MidiaCard';
import MidiaCardSkeleton from './MidiaCardSkeleton';
import DaySeparatorCard from './DaySeparatorCard';
import { Anime } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type CarouselItem = 
  | { type: 'media'; data: Anime }
  | { type: 'separator'; dayName: string };

type Season = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
type ViewMode = 'launch' | 'weekly';

interface AnimeCarouselProps {
    initialData: Anime[];
}

const SEASONS: Season[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
const SEASON_NAMES: Record<Season, string> = {
  WINTER: 'Inverno',
  SPRING: 'Primavera',
  SUMMER: 'Verão',
  FALL: 'Outono',
};
const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Funções auxiliares
const getSeason = (date: Date): Season => {
  const month = date.getMonth();
  if (month >= 0 && month <= 2) return 'WINTER';
  if (month >= 3 && month <= 5) return 'SPRING';
  if (month >= 6 && month <= 8) return 'SUMMER';
  return 'FALL';
};

const getSeasonDateRange = (year: number, season: Season): { startDate: Date, endDate: Date } => {
    let startDate: Date, endDate: Date;
    switch (season) {
        case 'WINTER': [startDate, endDate] = [new Date(year, 0, 1), new Date(year, 2, 31)]; break;
        case 'SPRING': [startDate, endDate] = [new Date(year, 3, 1), new Date(year, 5, 30)]; break;
        case 'SUMMER': [startDate, endDate] = [new Date(year, 6, 1), new Date(year, 8, 30)]; break;
        case 'FALL':   [startDate, endDate] = [new Date(year, 9, 1), new Date(year, 11, 31)]; break;
    }
    return { startDate, endDate };
};

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({ initialData }) => {
  const [fetchedAnimes, setFetchedAnimes] = useState<Anime[]>(initialData);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [currentSeason, setCurrentSeason] = useState<Season>(getSeason(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTitle, setCurrentTitle] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('launch');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', skipSnaps: true });

  useEffect(() => {
    const today = new Date();
    const season = getSeason(today);
    const year = today.getFullYear();
    
    if (season === currentSeason && year === currentYear) {
        const { startDate } = getSeasonDateRange(year, season);
        const fourWeeksInMs = 4 * 7 * 24 * 60 * 60 * 1000;
        const seasonStartPlusFourWeeks = startDate.getTime() + fourWeeksInMs;
        setViewMode(today.getTime() > seasonStartPlusFourWeeks ? 'weekly' : 'launch');
    } else {
        setViewMode('launch');
    }
  }, [currentSeason, currentYear]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSettle = () => setCurrentTitle(`Temporada de ${SEASON_NAMES[currentSeason]} ${currentYear}`);
    emblaApi.on('settle', onSettle);
    onSettle();
    return () => { emblaApi.off('settle', onSettle); };
  }, [emblaApi, currentSeason, currentYear]);

  const genres = Array.from(new Set(fetchedAnimes.flatMap(anime => anime.generos_api?.map(g => g.name) || [])));

  const filteredAnimes = selectedGenre
    ? fetchedAnimes.filter(anime => anime.generos_api?.some(g => g.name === selectedGenre))
    : fetchedAnimes;

  useEffect(() => {
    let newCarouselItems: CarouselItem[] = [];
    let newStartIndex = 0;

    if (viewMode === 'launch') {
        const { startDate: seasonStartDate } = getSeasonDateRange(currentYear, currentSeason);
        const sortedAnimes = [...filteredAnimes].sort((a, b) => {
            const aIsContinuation = a.nextAiringEpisode && a.startDate && new Date(a.startDate.year, a.startDate.month - 1, a.startDate.day) < seasonStartDate;
            const bIsContinuation = b.nextAiringEpisode && b.startDate && new Date(b.startDate.year, b.startDate.month - 1, b.startDate.day) < seasonStartDate;
            const aIsFinished = !a.nextAiringEpisode;
            const bIsFinished = !b.nextAiringEpisode;

            if (aIsFinished !== bIsFinished) return aIsFinished ? 1 : -1;
            if (aIsContinuation !== bIsContinuation) return aIsContinuation ? -1 : 1;
            
            const dateA = a.startDate ? new Date(a.startDate.year, a.startDate.month - 1, a.startDate.day).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate.year, b.startDate.month - 1, b.startDate.day).getTime() : 0;
            return dateA - dateB;
        });
        newCarouselItems = sortedAnimes.map(anime => ({ type: 'media', data: anime }));
        newStartIndex = 0;
    } else { // weekly mode
        const animesByDay: Record<number, Anime[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        filteredAnimes.forEach(anime => {
            if (anime.nextAiringEpisode) {
                const localAiringDate = new Date(anime.nextAiringEpisode.airingAt);
                const dayIndex = localAiringDate.getDay();
                animesByDay[dayIndex].push(anime);
            }
        });

        const processedItems: CarouselItem[] = [];
        for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
            const animesForDay = animesByDay[dayIndex];
            if (animesForDay.length > 0) {
                processedItems.push({ type: 'separator', dayName: DAY_NAMES[dayIndex] });
                animesForDay.sort((a, b) => new Date(a.nextAiringEpisode!.airingAt).getTime() - new Date(b.nextAiringEpisode!.airingAt).getTime());
                animesForDay.forEach(anime => processedItems.push({ type: 'media', data: anime }));
            }
        }
        
        newCarouselItems = processedItems;
        const currentDayIndex = new Date().getDay();
        const startIndexCandidate = newCarouselItems.findIndex(item => item.type === 'separator' && item.dayName === DAY_NAMES[currentDayIndex]);
        newStartIndex = startIndexCandidate > -1 ? startIndexCandidate : 0;
    }
    
    setCarouselItems(newCarouselItems);
    setStartIndex(newStartIndex);

  }, [fetchedAnimes, selectedGenre, viewMode, currentYear, currentSeason]);

  useEffect(() => {
    if (emblaApi) {
        emblaApi.reInit();
        emblaApi.scrollTo(startIndex, true);
    }
  }, [carouselItems, startIndex, emblaApi]);

  const navigateSeason = async (direction: 'next' | 'prev') => {
    let newSeason = currentSeason;
    let newYear = currentYear;

    const currentSeasonIndex = SEASONS.indexOf(currentSeason);
    if (direction === 'next') {
      const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
      newSeason = SEASONS[nextSeasonIndex];
      if (nextSeasonIndex === 0) newYear++;
    } else {
      const prevSeasonIndex = (currentSeasonIndex - 1 + 4) % 4;
      newSeason = SEASONS[prevSeasonIndex];
      if (prevSeasonIndex === 3) newYear--;
    }

    try {
        const response = await fetch(`/api/animes/by-season?year=${newYear}&season=${newSeason}`);
        const animes: Anime[] = await response.json();
        const RELEVANT_FORMATS = ['TV', 'TV_SHORT', 'MOVIE', 'ONA'];
        const filteredAnimes = animes.filter(anime => anime.format && RELEVANT_FORMATS.includes(anime.format) && !anime.isAdult);
        
        setFetchedAnimes(filteredAnimes);
        setCurrentSeason(newSeason);
        setCurrentYear(newYear);
    } catch (error) {
        console.error('Error fetching new season animes:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 px-4">
        <h2 
          className="text-xl font-bold h-8 cursor-pointer"
          onClick={() => emblaApi?.scrollTo(startIndex)}
        >
          {currentTitle || 'Carregando...'}
        </h2>
        <div className="flex justify-between items-center w-full mt-2 md:mt-0 md:w-auto md:gap-4">
            <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="bg-yellow-500 dark:bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-yellow-600 dark:hover:bg-blue-600">
                      <Filter />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setSelectedGenre(null)}>Todos os Gêneros</DropdownMenuItem>
                    {genres.map(genre => (
                      <DropdownMenuItem key={genre} onSelect={() => setSelectedGenre(genre)}>
                        {genre}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button onClick={() => navigateSeason('prev')} className="bg-yellow-500 dark:bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-yellow-600 dark:hover:bg-blue-600"><ChevronLeft/></button>
                <button onClick={() => navigateSeason('next')} className="bg-yellow-500 dark:bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-yellow-600 dark:hover:bg-blue-600"><ChevronRight/></button>
            </div>
            {initialData.length > 0 && (
              <button 
                  onClick={() => setViewMode(prev => prev === 'launch' ? 'weekly' : 'launch')}
                  className="flex items-center gap-2 bg-yellow-500 dark:bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition-colors hover:bg-yellow-600 dark:hover:bg-blue-600"
              >
                  {viewMode === 'launch' ? <CalendarDays size={20} /> : <ListOrdered size={20} />}
                  <span className="hidden sm:inline">{viewMode === 'launch' ? 'Ver Agenda' : 'Ver Lançamentos'}</span>
              </button>
            )}
        </div>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6">
          {carouselItems.length === 0
            ? Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="relative min-w-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-6">
                  <MidiaCardSkeleton />
                </div>
              ))
            : carouselItems.map((item, index) => (
                <div key={index} className="relative min-w-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-6">
                  {item.type === 'separator' 
                    ? <DaySeparatorCard dayName={item.dayName} /> 
                    : <MidiaCard midia={item.data} type="anime" />}
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default AnimeCarousel;