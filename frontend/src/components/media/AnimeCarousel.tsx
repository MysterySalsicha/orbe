'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  
  const initialSeason = getSeason(new Date());
  const initialYear = new Date().getFullYear();

  const [currentSeason, setCurrentSeason] = useState<Season>(initialSeason);
  const [currentYear, setCurrentYear] = useState(initialYear);
  
  const [currentTitle, setCurrentTitle] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('launch');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const loadedSeasons = useRef<Set<string>>(new Set([`${initialYear}-${initialSeason}`]));
  const fetchingSeasons = useRef(new Set<string>());
  const previousSelectedIndex = useRef<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', skipSnaps: true });

  const fetchSeasonData = useCallback(async (year: number, season: Season, direction: 'next' | 'prev' | 'current' = 'current') => {
    const seasonId = `${year}-${season}`;
    if (fetchingSeasons.current.has(seasonId) || loadedSeasons.current.has(seasonId)) {
      return null;
    }
    fetchingSeasons.current.add(seasonId);

    try {
      const response = await fetch(`/api/animes/by-season?year=${year}&season=${season}`);
      const animes: Anime[] = await response.json();
      const RELEVANT_FORMATS = ['TV', 'TV_SHORT', 'MOVIE', 'ONA'];
      const newAnimes = animes.filter(anime => anime.format && RELEVANT_FORMATS.includes(anime.format) && !anime.isAdult);
      
      loadedSeasons.current.add(seasonId);

      if (direction === 'current') {
        setFetchedAnimes(newAnimes);
      } else if (direction === 'next') {
        setFetchedAnimes(prev => [...prev, ...newAnimes]);
      } else { // prev
        setFetchedAnimes(prev => [...newAnimes, ...prev]);
      }
      
      return newAnimes;
    } catch (error) {
      console.error(`Error fetching animes for season ${seasonId}:`, error);
      return null;
    } finally {
      fetchingSeasons.current.delete(seasonId);
    }
  }, []);

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

    const onSettle = async () => {
      if (!emblaApi) return;

      // If a fetch is already in progress, do nothing.
      if (fetchingSeasons.current.size > 0) {
          return;
      }

      const selectedIndex = emblaApi.selectedScrollSnap();
      previousSelectedIndex.current = selectedIndex;
      
      const selectedItem = carouselItems[selectedIndex];
      if (selectedItem?.type === 'media' && selectedItem.data.startDate) {
          const itemDate = new Date(selectedItem.data.startDate.year, selectedItem.data.startDate.month - 1, selectedItem.data.startDate.day);
          const season = getSeason(itemDate);
          const year = itemDate.getFullYear();
          setCurrentSeason(season);
          setCurrentYear(year);
          setCurrentTitle(`Temporada de ${SEASON_NAMES[season]} ${year}`);
      }

      const buffer = 15;
      if (carouselItems.length > 0 && selectedIndex >= carouselItems.length - buffer) {
        const lastAnime = fetchedAnimes[fetchedAnimes.length - 1];
        if (!lastAnime || !lastAnime.startDate) return;
        const lastItemDate = new Date(lastAnime.startDate.year, lastAnime.startDate.month - 1, lastAnime.startDate.day);
        const lastSeason = getSeason(lastItemDate);
        const lastYear = lastItemDate.getFullYear();
        
        const currentSeasonIndex = SEASONS.indexOf(lastSeason);
        const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
        const nextSeason = SEASONS[nextSeasonIndex];
        const nextYear = nextSeasonIndex === 0 ? lastYear + 1 : lastYear;
        
        await fetchSeasonData(nextYear, nextSeason, 'next');
      }

      if (carouselItems.length > 0 && selectedIndex < buffer) {
        const firstAnime = fetchedAnimes[0];
        if (!firstAnime || !firstAnime.startDate) return;
        const firstItemDate = new Date(firstAnime.startDate.year, firstAnime.startDate.month - 1, firstAnime.startDate.day);
        const firstSeason = getSeason(firstItemDate);
        const firstYear = firstItemDate.getFullYear();

        const currentSeasonIndex = SEASONS.indexOf(firstSeason);
        const prevSeasonIndex = (currentSeasonIndex - 1 + 4) % 4;
        const prevSeason = SEASONS[prevSeasonIndex];
        const prevYear = prevSeasonIndex === 3 ? firstYear - 1 : firstYear;

        await fetchSeasonData(prevYear, prevSeason, 'prev');
      }
    };

    emblaApi.on('settle', onSettle);

    // Set initial title
    const selectedIndex = emblaApi.selectedScrollSnap();
    const selectedItem = carouselItems[selectedIndex];
    if (selectedItem?.type === 'media' && selectedItem.data.startDate) {
        const itemDate = new Date(selectedItem.data.startDate.year, selectedItem.data.startDate.month - 1, selectedItem.data.startDate.day);
        const season = getSeason(itemDate);
        const year = itemDate.getFullYear();
        setCurrentTitle(`Temporada de ${SEASON_NAMES[season]} ${year}`);
    }

    return () => { emblaApi.off('settle', onSettle); };
  }, [emblaApi, carouselItems, fetchedAnimes, fetchSeasonData]);

  // Efeito para definir o título inicial
  useEffect(() => {
    setCurrentTitle(`Temporada de ${SEASON_NAMES[initialSeason]} ${initialYear}`);
  }, [initialSeason, initialYear]);

  const genres = Array.from(new Set(fetchedAnimes.flatMap(anime => anime.generos_api || []))).filter(Boolean);

  const filteredAnimes = selectedGenre
    ? fetchedAnimes.filter(anime => anime.generos_api?.includes(selectedGenre))
    : fetchedAnimes;

  useEffect(() => {
    let newCarouselItems: CarouselItem[] = [];
    let newStartIndex = 0;

    if (viewMode === 'launch') {
        const sortedAnimes = [...filteredAnimes].sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate.year, a.startDate.month - 1, a.startDate.day).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate.year, b.startDate.month - 1, b.startDate.day).getTime() : 0;
            return dateA - dateB;
        });
        newCarouselItems = sortedAnimes.map(anime => ({ type: 'media', data: anime }));
        
        const today = new Date();
        const currentSeasonObj = getSeason(today);
        const currentYearObj = today.getFullYear();
        if (currentSeason === currentSeasonObj && currentYear === currentYearObj) {
            const startIndexCandidate = newCarouselItems.findIndex(item => 
                item.type === 'media' && 
                item.data.startDate &&
                new Date(item.data.startDate.year, item.data.startDate.month - 1, item.data.startDate.day) >= today
            );
            newStartIndex = startIndexCandidate > -1 ? startIndexCandidate : newCarouselItems.length -1;
        } else {
            const searchYear = currentYear;
            const searchSeason = currentSeason;
            const startIndexCandidate = newCarouselItems.findIndex(item => 
                item.type === 'media' && 
                item.data.startDate &&
                item.data.startDate.year === searchYear &&
                getSeason(new Date(item.data.startDate.year, item.data.startDate.month - 1, item.data.startDate.day)) === searchSeason
            );
            newStartIndex = startIndexCandidate > -1 ? startIndexCandidate : 0;
        }

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
        const prevLength = emblaApi.slideNodes().length;
        emblaApi.reInit();
        const newLength = emblaApi.slideNodes().length;
        const itemsAdded = newLength - prevLength;

        if (itemsAdded > 0 && previousSelectedIndex.current < 15) { // Heuristic for prepend
            emblaApi.scrollTo(previousSelectedIndex.current + itemsAdded, true);
        } else if (startIndex !== previousSelectedIndex.current) {
            emblaApi.scrollTo(startIndex, true);
        }
    }
  }, [carouselItems, startIndex, emblaApi]);

  const navigateSeason = async (direction: 'next' | 'prev') => {
    const seasonIndex = SEASONS.indexOf(currentSeason);
    let newSeason: Season;
    let newYear = currentYear;

    if (direction === 'next') {
      const nextSeasonIndex = (seasonIndex + 1) % 4;
      newSeason = SEASONS[nextSeasonIndex];
      if (nextSeasonIndex === 0) newYear++;
    } else {
      const prevSeasonIndex = (seasonIndex - 1 + 4) % 4;
      newSeason = SEASONS[prevSeasonIndex];
      if (prevSeasonIndex === 3) newYear--;
    }
    
    if (!loadedSeasons.current.has(`${newYear}-${newSeason}`)) {
        await fetchSeasonData(newYear, newSeason, 'current');
    } 
    
    const targetIndex = fetchedAnimes.findIndex(anime => anime.startDate && anime.startDate.year === newYear && getSeason(new Date(anime.startDate.year, anime.startDate.month - 1, anime.startDate.day)) === newSeason);
    if (targetIndex > -1) {
        emblaApi?.scrollTo(targetIndex);
    }
    
    setCurrentSeason(newSeason);
    setCurrentYear(newYear);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 px-4">
        <h3 
          className="text-xl font-bold h-8 cursor-pointer"
          onClick={() => emblaApi?.scrollTo(startIndex)}
        >
          {currentTitle || 'Carregando...'}
        </h3>
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
                <div key={`skeleton-${index}`} className="relative min-w-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-6">
                  <MidiaCardSkeleton />
                </div>
              ))
            : carouselItems.map((item) => (
                <div key={item.type === 'separator' ? `sep-${item.dayName}` : `media-${item.data.id}`} className="relative min-w-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-6">
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