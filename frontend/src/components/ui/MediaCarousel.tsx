'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import MidiaCard from '../media/MidiaCard';
import MidiaCardSkeleton from '../media/MidiaCardSkeleton';
import type { Midia, TipoMidia, Filme, Serie, Anime, Jogo } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MediaCarouselProps {
  mediaType: 'filmes' | 'series' | 'jogos';
  initialData: Midia[];
  startIndex: number;
  className?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ mediaType, initialData, startIndex, className }) => {
  const [mediaItems, setMediaItems] = useState<Midia[]>(initialData);
  const [currentTitle, setCurrentTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  const loadedYears = useRef<Set<number>>(new Set(initialData.map(item => new Date(item.data_lancamento_api).getFullYear())));
  const fetchingYears = useRef(new Set<number>());
  const previousSelectedIndex = useRef<number>(startIndex);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center', 
    skipSnaps: true, 
    startIndex: startIndex 
  });

  const fetchMediaByYear = useCallback(async (year: number) => {
    if (fetchingYears.current.has(year) || loadedYears.current.has(year)) {
      return null;
    }
    fetchingYears.current.add(year);
    try {
      const response = await fetch(`/api/${mediaType}/by-year?year=${year}`);
      const data: Midia[] = await response.json();
      loadedYears.current.add(year);
      return data.sort((a, b) => new Date(a.data_lancamento_api).getTime() - new Date(b.data_lancamento_api).getTime());
    } catch (error) {
      console.error(`Error fetching ${mediaType} for year ${year}:`, error);
      return null;
    } finally {
      fetchingYears.current.delete(year);
    }
  }, [mediaType]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSettle = async () => {
      const selectedIndex = emblaApi.selectedScrollSnap();
      previousSelectedIndex.current = selectedIndex;
      const selectedItem = mediaItems[selectedIndex];

      if (selectedItem?.data_lancamento_api) {
        try {
          const date = parseISO(selectedItem.data_lancamento_api);
          const title = format(date, "'Lançamentos de' MMMM 'de' yyyy", { locale: ptBR });
          setCurrentTitle(title.charAt(0).toUpperCase() + title.slice(1));
        } catch (e) { setCurrentTitle("Lançamentos"); }
      }

      const buffer = 15;
      if (selectedIndex >= mediaItems.length - buffer) {
        const nextYear = Math.max(...Array.from(loadedYears.current)) + 1;
        const newData = await fetchMediaByYear(nextYear);
        if (newData) setMediaItems(prev => [...prev, ...newData]);
      }

      if (selectedIndex < buffer) {
        const prevYear = Math.min(...Array.from(loadedYears.current)) - 1;
        const newData = await fetchMediaByYear(prevYear);
        if (newData) {
          setMediaItems(prev => [...newData, ...prev]);
        }
      }
    };

    emblaApi.on('settle', onSettle);
    onSettle();

    return () => { emblaApi.off('settle', onSettle); };
  }, [emblaApi, mediaItems, fetchMediaByYear]);

  useEffect(() => {
    if (!emblaApi) return;
    const prevLength = emblaApi.slideNodes().length;
    emblaApi.reInit();
    const newLength = emblaApi.slideNodes().length;
    const itemsAdded = newLength - prevLength;

    if (itemsAdded > 0 && previousSelectedIndex.current < 15) { // Heurística para saber se foi prepend
      emblaApi.scrollTo(previousSelectedIndex.current + itemsAdded, true);
    }
  }, [emblaApi, mediaItems]);

  const navigateByMonth = (direction: 'next' | 'prev') => {
    if (!emblaApi || mediaItems.length === 0) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    const currentItem = mediaItems[selectedIndex];
    if (!currentItem) return;

    const currentItemDate = parseISO(currentItem.data_lancamento_api);
    let targetDate: Date;

    if (direction === 'next') {
      targetDate = new Date(currentItemDate.getFullYear(), currentItemDate.getMonth() + 1, 1);
    } else {
      targetDate = new Date(currentItemDate.getFullYear(), currentItemDate.getMonth() - 1, 1);
    }

    const targetIndex = mediaItems.findIndex(item => new Date(item.data_lancamento_api) >= targetDate);
    if (targetIndex !== -1) emblaApi.scrollTo(targetIndex);
  };

  const genres = Array.from(new Set(mediaItems.flatMap(item => item.generos_api?.map(g => g.name) || [])));

  const filteredItems = selectedGenre
    ? mediaItems.filter(item => item.generos_api?.some(g => g.name === selectedGenre))
    : mediaItems;

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 px-4">
        <h2 className="text-xl font-bold h-8 cursor-pointer" onClick={() => emblaApi?.scrollTo(startIndex)}>
          {currentTitle || 'Carregando...'}
        </h2>
        <div className="flex justify-end items-center w-full md:w-auto mt-2 md:mt-0">
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
            <button onClick={() => navigateByMonth('prev')} className="bg-yellow-500 dark:bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-yellow-600 dark:hover:bg-blue-600"><ChevronLeft/></button>
            <button onClick={() => navigateByMonth('next')} className="bg-yellow-500 dark:bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-yellow-600 dark:hover:bg-blue-600"><ChevronRight/></button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6">
          {filteredItems.length === 0
            ? Array.from({ length: 10 }).map((_, index) => 
                <div key={index} className="relative min-w-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-6">
                  <MidiaCardSkeleton />
                </div>
              )
            : filteredItems.map(item => (
                <div key={`${item.id}-${mediaType}`} className="relative min-w-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-6">
                  <MidiaCard midia={item as Filme | Serie | Anime | Jogo} type={mediaType.slice(0, -1) as TipoMidia} />
                </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default MediaCarousel;