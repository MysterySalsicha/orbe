'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlatformIcon from '@/components/ui/PlatformIcons';
import type { Anime, CalendarModalData, Character, StaffMember, Video } from '@/types';
import { getStreamingProviders } from '@/lib/media-helpers';
import useEmblaCarousel from 'embla-carousel-react';

interface AnimeModalContentProps {
  anime: Anime; // Recebe o objeto de detalhes completo da API
  openCalendarModal: (data: CalendarModalData) => void;
}

const CharacterCard = ({ character }: { character: Character }) => {
  const [selectedDubbing, setSelectedDubbing] = useState<'jp' | 'pt'>('jp');
  const hasPtBrDub = !!character.dubladores?.pt;

  return (
    <div className="flex-shrink-0 text-center w-32 space-y-2 p-2">
      <div className="w-24 h-24 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
        {character.foto_url && (<Image src={character.foto_url} alt={character.nome} width={96} height={96} className="w-full h-full object-cover" unoptimized={true} />)}
      </div>
      <p className="text-sm font-medium text-foreground line-clamp-2 h-10">{character.nome}</p>
      
      {character.dubladores && (character.dubladores.jp || character.dubladores.pt) && (
        <div className="space-y-1">
            <div className="flex bg-muted rounded-lg p-1 mx-auto w-fit">
                {character.dubladores.jp && (
                    <button onClick={() => setSelectedDubbing('jp')} className={`px-2 py-0.5 rounded text-xs transition-colors ${selectedDubbing === 'jp' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                        JP
                    </button>
                )}
                {hasPtBrDub && (
                    <button onClick={() => setSelectedDubbing('pt')} className={`px-2 py-0.5 rounded text-xs transition-colors ${selectedDubbing === 'pt' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                        PT-BR
                    </button>
                )}
            </div>
            {character.dubladores?.[selectedDubbing] && (
                <div className="h-28">
                    <div className="w-16 h-16 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
                        {character.dubladores[selectedDubbing]?.foto_url && (<Image src={character.dubladores[selectedDubbing]!.foto_url!} alt={character.dubladores[selectedDubbing]!.nome} width={64} height={64} className="w-full h-full object-cover" unoptimized={true} />)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 h-8">{character.dubladores[selectedDubbing]!.nome}</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

const AnimeModalContent: React.FC<AnimeModalContentProps> = ({ anime, openCalendarModal }) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [staffCarouselRef] = useEmblaCarousel({ align: 'start', dragFree: true });
  const [characterCarouselRef] = useEmblaCarousel({ align: 'start', dragFree: true });

  const providers = getStreamingProviders(anime);
  const releaseDate = new Date(anime.data_lancamento_api);
  const showCalendarButton = releaseDate > new Date() || !!anime.nextAiringEpisode;

  const getTrailerKey = () => {
    const officialTrailer = anime.videos?.find(v => v.type === 'Trailer' && v.official);
    if (officialTrailer) return officialTrailer.key;

    const anyTrailer = anime.videos?.find(v => v.type === 'Trailer');
    if (anyTrailer) return anyTrailer.key;

    if (anime.videos && anime.videos.length > 0) return anime.videos[0].key;
    
    const youtubeLink = (anime as any).externalLinks?.find((l: { site: string; }) => l.site.toLowerCase() === 'youtube');
    if (youtubeLink) {
        try {
            const url = new URL(youtubeLink.url);
            if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com' || url.hostname === 'youtu.be') {
                return url.searchParams.get('v') || url.pathname.split('/').pop();
            }
        } catch (e) {
            // Invalid URL
        }
    }

    return null;
  };

  const trailerKey = getTrailerKey();

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {providers.length > 0 ? (
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>Disponível em:</p>
            <div className="flex flex-wrap gap-2">
              {providers.map(provider => (
                <Button asChild key={provider.name}>
                  <a href={anime.siteUrl || anime.homepage || '#'} target="_blank" rel="noopener noreferrer">
                    <PlatformIcon platform={provider.icon} className="h-5 w-5 mr-2" />
                    Assistir em {provider.name}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>Disponível em:</p>
            <Button disabled>Indisponível</Button>
          </div>
        )}

        {showCalendarButton && (
          <Button variant="outline" onClick={() => openCalendarModal({ midia: anime, type: 'anime' })}>
            <Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário
          </Button>
        )}
      </div>

      {/* Sinopse */}
      {anime.sinopse && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
          <p className={`text-muted-foreground leading-relaxed transition-all duration-300 ${!isSynopsisExpanded ? 'line-clamp-3' : ''}`} dangerouslySetInnerHTML={{ __html: anime.sinopse }} />
          <button onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)} className="text-sm font-semibold text-primary hover:underline mt-1">
            {isSynopsisExpanded ? 'Ler menos' : 'Ler mais'}
          </button>
        </div>
      )}

      {/* Trailer */}
      {trailerKey && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Trailer</h3>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

      {/* Staff */}
      {anime.staff && anime.staff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Equipe de Produção</h3>
          <div className="overflow-hidden" ref={staffCarouselRef}>
            <div className="flex space-x-4">
              {anime.staff.map((membro: StaffMember) => (
                <div key={membro.id} className="flex-shrink-0 text-center w-24">
                  <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                    {membro.foto_url && (<Image src={membro.foto_url} alt={membro.nome} width={80} height={80} className="w-full h-full object-cover" unoptimized={true} />)}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{membro.nome}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{membro.funcao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Personagens com Seletor de Dublagem */}
      {anime.personagens && anime.personagens.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Personagens e Dubladores</h3>
          <div className="overflow-hidden" ref={characterCarouselRef}>
            <div className="flex">
              {anime.personagens.map((p: Character) => (
                <CharacterCard key={p.id} character={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeModalContent;
