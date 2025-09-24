'use client';

import Image from 'next/image';
import { Play, Calendar, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Filme, CastMember, CalendarModalData } from '@/types';

interface FilmeModalContentProps {
  filme: any; // Recebe o objeto de detalhes completo da API
  openCalendarModal: (data: CalendarModalData) => void;
}

const FilmeModalContent: React.FC<FilmeModalContentProps> = ({ filme, openCalendarModal }) => {

  // Encontra o trailer oficial na lista de vídeos
  const trailer = filme.videos?.find(
    (video: any) => video.type === 'Trailer' && video.official === true
  );
  const trailerKey = trailer ? trailer.key : filme.videos?.[0]?.key;

  const hasReleased = filme.data_lancamento_api && new Date(filme.data_lancamento_api) < new Date();

  const getImageUrl = (path: string | null) => {
    if (!path) return '/placeholder-avatar.jpg';
    return path; // A URL completa já vem do mapper
  };

  return (
    <div className="space-y-6">
      {/* Botões de Ação - A lógica pode precisar de revisão com os novos dados */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button disabled={true} asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="h-5 w-5 mr-2" />Comprar Ingresso
          </a>
        </Button>
        <Button disabled={!filme.homepage} asChild>
          <a href={filme.homepage || '#'} target="_blank" rel="noopener noreferrer">
            <Play className="h-5 w-5 mr-2" />Assistir Agora
          </a>
        </Button>
        {!hasReleased && (
          <Button variant="muted" onClick={() => openCalendarModal({ midia: filme, type: 'filme' })}>
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

      {(filme.diretor || filme.escritor) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {filme.diretor && <div><span className="font-semibold orbe-text-secondary">Direção:</span> <span className="text-muted-foreground">{filme.diretor}</span></div>}
          {filme.escritor && <div><span className="font-semibold orbe-text-secondary">Roteiro:</span> <span className="text-muted-foreground">{filme.escritor}</span></div>}
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
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {filme.elenco.slice(0, 15).map((ator: any) => (
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
      )}
    </div>
  );
};

export default FilmeModalContent;
