'use client';

import Image from 'next/image';
import { Play, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PlatformIcon from '@/components/ui/PlatformIcons';
import type { Jogo, CalendarModalData } from '@/types';

interface JogoModalContentProps {
  jogo: Jogo; // Recebe o objeto de detalhes completo da API do IGDB
  openCalendarModal: (data: CalendarModalData) => void;
}

const JogoModalContent: React.FC<JogoModalContentProps> = ({ jogo, openCalendarModal }) => {

  const trailerKey = jogo.trailer_key;

  const storeIds: { [key: number]: string } = {
    13: 'Steam',
    16: 'Epic Games',
    17: 'GOG',
    // Adicionar outros IDs de loja aqui, ex: PlayStation, Xbox, se disponíveis
  };

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground'>Disponível para compra:</p>
          <div className="flex flex-wrap gap-3">
            {jogo.websites?.filter((site: Website) => storeIds[site.category]).map((site: Website) => (
              <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer" title={`Comprar na ${storeIds[site.category]}`}>
                <PlatformIcon platform={storeIds[site.category]} className="h-8 w-8 hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>
        <Button variant="muted" onClick={() => openCalendarModal({ midia: jogo, type: 'jogo' })}>
          <Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário
        </Button>
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

      {/* Detalhes Adicionais */}
      <div className="space-y-3 pt-4 border-t border-border text-sm">
        {jogo.desenvolvedores && jogo.desenvolvedores.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold w-24 flex-shrink-0">Desenvolvedor(es):</span>
            <span className="text-muted-foreground">{jogo.desenvolvedores.join(', ')}</span>
          </div>
        )}
        {jogo.publicadoras && jogo.publicadoras.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold w-24 flex-shrink-0">Publicador(es):</span>
            <span className="text-muted-foreground">{jogo.publicadoras.join(', ')}</span>
          </div>
        )}
        {jogo.plataformas_api && jogo.plataformas_api.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold w-24 flex-shrink-0">Plataformas:</span>
            <div className="flex flex-wrap gap-1">
              {jogo.plataformas_api.map((p: Plataforma) => (
                <span key={p.nome} className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">
                  {p.nome}
                </span>
              ))}
            </div>
          </div>
        )}
        {jogo.generos_api && jogo.generos_api.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold w-24 flex-shrink-0">Gêneros:</span>
            <div className="flex flex-wrap gap-1">
              {jogo.generos_api.map((g: Genre) => (
                <span key={g} className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
        {jogo.temas && jogo.temas.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold w-24 flex-shrink-0">Temas:</span>
            <div className="flex flex-wrap gap-1">
              {jogo.temas.map((t: string) => (
                <span key={t} className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
        {jogo.data_lancamento_api && (
          <div className="flex items-center gap-2">
            <span className="font-semibold w-24 flex-shrink-0">Lançamento:</span>
            <span className="text-muted-foreground">{format(parseISO(jogo.data_lancamento_api), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JogoModalContent;
