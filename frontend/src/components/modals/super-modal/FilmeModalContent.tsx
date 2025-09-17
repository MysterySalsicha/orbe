'use client';

import Image from 'next/image';
import { Play, Calendar, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseISO } from 'date-fns';
import type { Filme, CastMember, CalendarModalData } from '@/types';

interface FilmeModalContentProps {
  filme: Filme;
  elenco: CastMember[];
  openCalendarModal: (data: CalendarModalData) => void;
}

const FilmeModalContent: React.FC<FilmeModalContentProps> = ({ filme, elenco, openCalendarModal }) => {
  const isAvailableToBuyTicket = filme.ingresso_link && filme.em_cartaz;
  const isAvailableToWatchNow = filme.link_assistir_agora;
  const hasReleased = filme.data_lancamento_curada ? parseISO(filme.data_lancamento_curada) <= new Date() : false;

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button disabled={!isAvailableToBuyTicket} asChild>
          <a href={isAvailableToBuyTicket ? filme.ingresso_link : undefined} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="h-5 w-5 mr-2" />Comprar Ingresso
          </a>
        </Button>
        <Button disabled={!hasReleased || !isAvailableToWatchNow} asChild>
          <a href={hasReleased && isAvailableToWatchNow ? filme.link_assistir_agora : undefined} target="_blank" rel="noopener noreferrer">
            <Play className="h-5 w-5 mr-2" />Assistir Agora
          </a>
        </Button>
        <Button variant="muted" onClick={() => openCalendarModal({ midia: filme, type: 'filme' })}>
          <Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário
        </Button>
      </div>

      {/* Sinopse */}
      {filme.sinopse && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
          <p className="text-muted-foreground leading-relaxed">{filme.sinopse}</p>
        </div>
      )}

      {/* Trailer */}
      {filme.trailer_url_api && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Trailer</h3>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${filme.trailer_url_api.split('v=')[1]}`}
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
      {elenco.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Elenco</h3>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {elenco.map((ator) => (
              <div key={ator.id} className="flex-shrink-0 text-center w-24">
                <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                  {ator.foto_url && (<Image src={ator.foto_url} alt={ator.nome} width={80} height={80} className="w-full h-full object-cover" />)}
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
