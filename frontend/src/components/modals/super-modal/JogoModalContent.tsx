'use client';


import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PlatformIcon from '@/components/ui/PlatformIcons';
import { getGameStores } from '@/lib/media-helpers';
import type { Jogo, CalendarModalData, Website, Plataforma, Genre } from '@/types';

interface JogoModalContentProps {
  jogo: Jogo; // Recebe o objeto de detalhes completo da API do IGDB
  openCalendarModal: (data: CalendarModalData) => void;
}

const JogoModalContent: React.FC<JogoModalContentProps> = ({ jogo, openCalendarModal }) => {

  const trailerKey = jogo.trailer_key;
  const gameStores = getGameStores(jogo);
  const releaseDate = new Date(jogo.data_lancamento_api);
  const showCalendarButton = releaseDate > new Date();

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {gameStores.length > 0 && (
          <div className='space-y-2'>
            <h3 className="text-lg font-semibold orbe-text-secondary">Disponível em:</h3>
            <div className="flex flex-wrap gap-4 mt-2">
              {gameStores.map((store) => (
                <a 
                  key={store.name} 
                  href={store.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <PlatformIcon platform={store.icon} className="h-5 w-5" />
                  <span>{store.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        {showCalendarButton && (
          <Button variant="outline" onClick={() => openCalendarModal({ midia: jogo, type: 'jogo' })}>
            <Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário
          </Button>
        )}
      </div>

      {/* Sinopse */}
      {jogo.sinopse && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
          <p className="text-muted-foreground leading-relaxed">{jogo.sinopse}</p>
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


    </div>
  );
};

export default JogoModalContent;
