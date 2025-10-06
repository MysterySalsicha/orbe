'use client';

import React, { useState, useEffect } from 'react';
import {
  MoreVertical,
  Heart,
  Bookmark,
  Star,
  Check,
  EyeOff
} from 'lucide-react';
import PlatformIcon from '@/components/ui/PlatformIcons';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { ptBR } from 'date-fns/locale';
import { useAppStore } from '@/stores/appStore';
import {
  getStreamingProviders,
  getGamePlatforms,
  getAnimeDubStatus,
  formatRating
} from '@/lib/media-helpers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { MidiaCardProps, UserAction, Anime, Jogo } from '@/types';

// Hook para o cronômetro
const useCountdown = (targetDate: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('Já disponível');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

const blockedTags = ["Hentai", "Ecchi", "Yaoi", "Yuri", "Adult"];

const MidiaCard = React.forwardRef<HTMLDivElement, MidiaCardProps>((
  {
    midia,
    type,
    userInteractions = [],
    onInteraction,
    isFocused,
  }, ref) => {
  const { openSuperModal, openRatingModal } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Processar dados com helpers
  const rating = formatRating(midia, type);
  const genres = midia.generos_api?.map(g => g.name).filter(Boolean) ?? [];
  const providers = getStreamingProviders(midia);
  const platforms = type === 'jogo' ? getGamePlatforms(midia as Jogo) : [];
  const dubStatus = type === 'anime' ? getAnimeDubStatus(midia as Anime) : null;

  const isAnime = type === 'anime';
  const nextAiringEpisode = isAnime ? (midia as Anime).nextAiringEpisode : null;
  const countdown = useCountdown(nextAiringEpisode?.airingAt);

  const userInteraction = userInteractions.find(
    interaction => interaction.midia_id === midia.id && interaction.tipo_midia === type
  );

  const isAdultContent = isAnime && (midia as any).isAdult === true;

  // Lógica corrigida para decidir se mostra o cronômetro
  const showCountdown = (() => {
    if (!isAnime || !nextAiringEpisode) {
      return false;
    }
    const startDateString = (midia as Anime).data_lancamento_api;
    if (startDateString && typeof startDateString === 'string') {
      try {
        const startDate = parseISO(startDateString);
        return startDate <= new Date();
      } catch (e) {
        return false; // Retorna falso se a data for inválida
      }
    }
    // Lida com o formato de objeto de data legado, se ainda existir
    if (startDateString && typeof startDateString === 'object' && 'year' in startDateString) {
        const dateObj = startDateString as { year: number, month: number, day: number };
        const startDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
        return startDate <= new Date();
    }
    return false;
  })();

  const formatReleaseDate = () => {
    const date = midia.data_lancamento_curada || midia.data_lancamento_api;
    if (!date) return 'A ser anunciado';
    try {
      if (typeof date === 'object' && date !== null && 'year' in date) {
        const dateObj = date as { year: number, month: number, day: number };
        return `${String(dateObj.day).padStart(2, '0')}/${String(dateObj.month).padStart(2, '0')}/${String(dateObj.year).slice(-2)}`;
      }
      return format(parseISO(date as string), 'dd/MM/yy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const hasReleased = () => {
    const date = midia.data_lancamento_curada || midia.data_lancamento_api;
    if (!date) return false;
    try {
      if (typeof date === 'object' && date !== null && 'year' in date) {
        const dateObj = date as { year: number, month: number, day: number };
        return new Date(dateObj.year, dateObj.month - 1, dateObj.day) <= new Date();
      }
      return parseISO(date as string) <= new Date();
    } catch {
      return false;
    }
  };

  const menuActions = [
    { icon: Heart, label: 'Favoritar', action: 'favoritar' as UserAction, active: userInteraction?.status === 'favorito' },
    { icon: Bookmark, label: 'Quero Assistir', action: 'quero_assistir' as UserAction, active: userInteraction?.status === 'quero_assistir' },
    ...(type === 'anime' || type === 'serie' ? [{ icon: Star, label: 'Acompanhando', action: 'acompanhando' as UserAction, active: userInteraction?.status === 'acompanhando' }] : []),
    { icon: Check, label: type === 'jogo' ? 'Já Joguei' : 'Já Assisti', action: (type === 'jogo' ? 'ja_joguei' : 'ja_assisti') as UserAction, active: userInteraction?.status === 'assistido', disabled: !hasReleased() },
    { icon: EyeOff, label: 'Não me Interessa', action: 'nao_me_interessa' as UserAction, active: userInteraction?.status === 'oculto' }
  ];

  const handleCardClick = () => {
    openSuperModal(midia, type);
    setIsMenuOpen(false);
  };

  const handleMenuAction = (action: UserAction, event: React.MouseEvent) => {
    event.stopPropagation();
    if ((action === 'ja_assisti' || action === 'ja_joguei') && !hasReleased()) return;
    if (action === 'ja_assisti' || action === 'ja_joguei') {
      openRatingModal(midia, type, action);
    } else {
      onInteraction?.(action, midia);
    }
    setIsMenuOpen(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group" ref={ref}>
            <div
              className={`relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 w-[200px] ${isFocused ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} transition-colors`}
              onClick={handleCardClick}
            >
              <div className="relative w-[200px] h-[300px] overflow-hidden">
                <Image
                  src={midia.poster_url_api || '/placeholder.svg'}
                  alt={midia.titulo_api || 'Imagem da Mídia'}
                  width={200}
                  height={300}
                  unoptimized
                  loading="lazy"
                  className={`object-cover object-center transition-all duration-300 group-hover:scale-105 w-full h-full ${isAdultContent ? 'blur-md hover:blur-none' : ''}`}
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={handleMenuToggle}
                    className="bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg py-1 z-50">
                      {menuActions.map((menuAction) => (
                        <button
                          key={menuAction.action}
                          onClick={(e) => !menuAction.disabled && handleMenuAction(menuAction.action, e)}
                          disabled={menuAction.disabled}
                          className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${menuAction.disabled ? 'text-muted-foreground cursor-not-allowed opacity-50' : 'hover:bg-muted'} ${menuAction.active ? 'text-primary' : 'text-foreground'}`}
                        >
                          <menuAction.icon className="h-4 w-4 mr-2" />
                          {menuAction.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 flex flex-col h-[calc(100% - 300px)]">
                {/* Título e Avaliação */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-base truncate pr-2 flex-grow">{midia.titulo_curado || midia.titulo_api}</h3>
                  {rating && (
                    <div className="flex items-center gap-1 text-sm shrink-0">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="font-bold">{rating}</span>
                    </div>
                  )}
                </div>

                {/* Data de Lançamento */}
                {type !== 'anime' && (
                  <p className="text-xs text-gray-400 mb-2">
                    Lançamento: {formatReleaseDate()}
                  </p>
                )}

                {/* Gêneros e Status de Dublagem */}
                <div className="flex flex-wrap items-center gap-1 mb-2">
                  {genres.slice(0, 2).map(genre => (
                    <span key={genre} className="bg-yellow-200 text-yellow-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold truncate transition-colors">
                      {genre}
                    </span>
                  ))}
                  {dubStatus && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${dubStatus === 'Dublado' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}>
                      {dubStatus}
                    </span>
                  )}
                </div>

                {/* Spacer to push providers to the bottom */}
                <div className="flex-grow" />

                {/* Provedores/Plataformas */}
                <div className="flex flex-col gap-1 pt-1 min-h-[32px]">
                  {(type === 'jogo' ? platforms : providers).slice(0, 2).map(p => (
                    <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PlatformIcon platform={p.icon} size={14} />
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{midia.titulo_curado || midia.titulo_api}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

MidiaCard.displayName = 'MidiaCard';

export default MidiaCard;
