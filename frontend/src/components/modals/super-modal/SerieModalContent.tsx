'use client';

import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlatformIcon from '@/components/ui/PlatformIcons';
import type { Serie, CastMember, CalendarModalData, Video, Creator, Temporada } from '@/types';
import { getStreamingProviders } from '@/lib/media-helpers';
import useEmblaCarousel from 'embla-carousel-react';

interface SerieModalContentProps {
  serie: Serie; // Recebe o objeto de detalhes completo da API
  openCalendarModal: (data: CalendarModalData) => void;
}

const SerieModalContent: React.FC<SerieModalContentProps> = ({ serie, openCalendarModal }) => {

  if (!serie) {
    return <div>Carregando...</div>;
  }

  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true });

  // Encontra o trailer oficial na lista de vídeos
  const trailer = serie.videos?.find(
    (video: Video) => video.type === 'Trailer' && video.official === true
  );
  const trailerKey = trailer ? trailer.key : serie.videos?.[0]?.key;

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '/placeholder-avatar.jpg';
    return path; // A URL completa já vem do mapper
  };

  const providers = getStreamingProviders(serie);
  const releaseDate = new Date(serie.data_lancamento_api);
  const showCalendarButton = releaseDate > new Date();

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground'>Disponível em:</p>
          {providers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {providers.map(provider => (
                <Button asChild key={provider.name}>
                  <a href={serie.homepage || '#'} target="_blank" rel="noopener noreferrer">
                    <PlatformIcon platform={provider.icon} className="h-5 w-5 mr-2" />
                    {provider.name}
                  </a>
                </Button>
              ))}
            </div>
          ) : (
            <Button disabled>Indisponível</Button>
          )}
        </div>

        {showCalendarButton && (
          <Button variant="outline" onClick={() => openCalendarModal({ midia: serie, type: 'serie' })}>
            <Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário
          </Button>
        )}
      </div>

      {/* Sinopse */}
      {serie.sinopse && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
          <p className="text-muted-foreground leading-relaxed">{serie.sinopse}</p>
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

      {/* Elenco */}
      {serie.elenco && serie.elenco.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Elenco Principal</h3>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex space-x-4">
              {serie.elenco.slice(0, 15).map((ator: CastMember) => (
                <div key={ator.nome} className="flex-shrink-0 text-center w-24">
                  <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                    <Image src={getImageUrl(ator.foto_url)} alt={ator.nome} width={80} height={80} className="w-full h-full object-cover" unoptimized={true} />
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{ator.nome}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ator.personagem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Temporadas */}
      {serie.temporadas && serie.temporadas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Temporadas</h3>
          <div className="space-y-2 text-sm">
            {serie.temporadas.map((temporada: Temporada) => (
              <div key={temporada.numero} className="flex justify-between items-center bg-muted p-2 rounded-lg">
                <span className="font-medium text-foreground">{temporada.nome || `Temporada ${temporada.numero}`}</span>
                <span className="text-muted-foreground">{temporada.episodios} episódios</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SerieModalContent;
