'use client';

import Image from 'next/image';
import { Calendar, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import PlatformIcon from '@/components/ui/PlatformIcons';
import type { Filme, CastMember, CalendarModalData, Video } from '@/types';
import useEmblaCarousel from 'embla-carousel-react';

interface FilmeModalContentProps {
  filme: Filme; // Recebe o objeto de detalhes completo da API
  openCalendarModal: (data: CalendarModalData) => void;
}

const FilmeModalContent: React.FC<FilmeModalContentProps> = ({ filme, openCalendarModal }) => {

  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true });

  // Encontra o trailer oficial na lista de vídeos
  const trailer = filme.videos?.find(
    (video: Video) => video.type === 'Trailer' && video.official === true
  );
  const trailerKey = trailer ? trailer.key : filme.videos?.[0]?.key;

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '/placeholder-avatar.jpg';
    return path; // A URL completa já vem do mapper
  };

  // --- Lógica do Botão "Comprar Ingresso" ---
  const today = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(today.getDate() - 90);
  
  let isMovieInTheaters = false;
  if (filme.data_lancamento_api) {
    try {
        const releaseDate = parseISO(filme.data_lancamento_api);
        isMovieInTheaters = 
          filme.status === 'Released' && 
          releaseDate <= today && 
          releaseDate >= ninetyDaysAgo;
    } catch (e) {
        isMovieInTheaters = false;
    }
  }

  const canBuyTicket = !!(filme.ingresso_link && filme.ingresso_link.trim() !== '');

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {isMovieInTheaters && (
          canBuyTicket ? (
            <Button asChild>
              <a href={filme.ingresso_link} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="h-5 w-5 mr-2" />Comprar Ingresso
              </a>
            </Button>
          ) : (
            <Button disabled>
              <ShoppingCart className="h-5 w-5 mr-2" />Comprar ingresso indisponível
            </Button>
          )
        )}

        {filme.data_lancamento_api && new Date(filme.data_lancamento_api) > today && (
          <Button variant="outline" onClick={() => openCalendarModal({ midia: filme, type: 'filme' })}>
            <Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário
          </Button>
        )}
      </div>

      {/* Sinopse */}
      {filme.sinopse && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
          <p className="text-muted-foreground leading-relaxed">{filme.sinopse}</p>
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
      {filme.elenco && filme.elenco.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Elenco</h3>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex space-x-4">
              {filme.elenco.slice(0, 15).map((ator: CastMember) => (
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
    </div>
  );
};

export default FilmeModalContent;
