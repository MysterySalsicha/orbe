'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { parseISO } from 'date-fns';
import type { Anime, StaffMember, Character } from '@/types';

interface AnimeModalContentProps {
  anime: Anime;
  staff: StaffMember[];
  personagens: Character[];
  openCalendarModal: (data: { midia: Anime; type: 'anime'; eventType: 'premiere' | 'recurring' }) => void;
}

const AnimeModalContent: React.FC<AnimeModalContentProps> = ({ anime, staff, personagens, openCalendarModal }) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [selectedDubbing, setSelectedDubbing] = useState<'jp' | 'ptBR'>('jp');

  const isAvailableToWatchNow = anime.link_assistir_agora;
  const hasLaunched = anime.data_lancamento_curada ? parseISO(anime.data_lancamento_curada) <= new Date() : false;
  const isAiring = hasLaunched && anime.status !== 'FINISHED';
  const hasPtBrDub = personagens.some(p => p.dubladores?.ptBR?.nome);

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button disabled={!isAvailableToWatchNow} asChild>
          <a href={isAvailableToWatchNow ? `https://www.youtube.com/watch?v=${anime.trailer_url_api}` : undefined} target="_blank" rel="noopener noreferrer">
            <Play className="h-5 w-5 mr-2" />Assistir Agora
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary"><Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled={hasLaunched} onClick={() => openCalendarModal({ midia: anime, type: 'anime', eventType: 'premiere' })}>
              Adicionar evento de estreia
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!isAiring} onClick={() => openCalendarModal({ midia: anime, type: 'anime', eventType: 'recurring' })}>
              Adicionar eventos recorrentes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sinopse */}
      {anime.sinopse_curada && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
          <p className={`text-muted-foreground leading-relaxed transition-all duration-300 ${!isSynopsisExpanded ? 'line-clamp-3' : ''}`}>
            {anime.sinopse_curada}
          </p>
          <button onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)} className="text-sm font-semibold text-primary hover:underline mt-1">
            {isSynopsisExpanded ? 'Ler menos' : 'Ler mais'}
          </button>
        </div>
      )}

      {/* Trailer */}
      {anime.trailer_url_api && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Trailer</h3>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${anime.trailer_url_api.split('v=')[1]}`}
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
      {staff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Equipe de Produção</h3>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {staff.map((membro) => (
              <div key={membro.id} className="flex-shrink-0 text-center w-24">
                <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                  {membro.foto_url && (<Image src={membro.foto_url} alt={membro.nome} width={80} height={80} className="w-full h-full object-cover" />)}
                </div>
                <p className="text-xs font-medium text-foreground line-clamp-1">{membro.nome}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{membro.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personagens com Seletor de Dublagem */}
      {personagens.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold orbe-text-secondary">Personagens e Dubladores</h3>
            <div className="flex bg-muted rounded-lg p-1">
              <button onClick={() => setSelectedDubbing('jp')} className={`px-3 py-1 rounded text-sm transition-colors ${selectedDubbing === 'jp' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                JP
              </button>
              {hasPtBrDub && (
                <button onClick={() => setSelectedDubbing('ptBR')} className={`px-3 py-1 rounded text-sm transition-colors ${selectedDubbing === 'ptBR' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                  PT-BR
                </button>
              )}
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {personagens.map((p) => (
              <div key={p.id} className="flex-shrink-0 text-center w-28 space-y-2">
                <div className="w-24 h-24 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
                  {p.foto_url && (<Image src={p.foto_url} alt={p.nome} width={96} height={96} className="w-full h-full object-cover" />)}
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-2">{p.nome}</p>
                {p.dubladores?.[selectedDubbing] && (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
                      {p.dubladores?.[selectedDubbing]?.foto_url && (<Image src={p.dubladores[selectedDubbing]!.foto_url!} alt={p.dubladores[selectedDubbing]!.nome} width={64} height={64} className="w-full h-full object-cover" />)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.dubladores[selectedDubbing]!.nome}</p>
                  </>
                )}
              </div>
            ))} 
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeModalContent;
