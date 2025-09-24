'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Calendar, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Anime, CalendarModalData } from '@/types';

interface AnimeModalContentProps {
  anime: any; // Recebe o objeto de detalhes completo da API
  openCalendarModal: (data: CalendarModalData) => void;
}

const AnimeModalContent: React.FC<AnimeModalContentProps> = ({ anime, openCalendarModal }) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [selectedDubbing, setSelectedDubbing] = useState<'jp' | 'pt'>('jp');

  const hasPtBrDub = anime.personagens?.some((p: any) => p.dubladores?.pt);

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button disabled={!anime.links_streaming?.length} asChild>
          <a href={anime.links_streaming?.[0]?.url || '#'} target="_blank" rel="noopener noreferrer">
            <Play className="h-5 w-5 mr-2" />Assistir Agora
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="muted"><Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled={!anime.data_lancamento_api} onClick={() => openCalendarModal({ midia: anime, type: 'anime', eventType: 'premiere' })}>
              Adicionar evento de estreia
            </DropdownMenuItem>
            {/* A lógica para próximo episódio precisa ser adicionada ao mapper se necessário */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Detalhes Adicionais */}
      <div className="space-y-3 pt-4 border-t border-border text-sm">
        {anime.fonte && <div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Fonte:</span><span className="text-muted-foreground">{anime.fonte}</span></div>}
        {anime.estudio && <div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Estúdio(s):</span><span className="text-muted-foreground">{anime.estudio}</span></div>}
        {anime.dublagem_info && <div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Dublagem:</span><span className="text-muted-foreground">{anime.dublagem_info}</span></div>}
        {anime.mal_link && <div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Link Externo:</span><a href={anime.mal_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">MyAnimeList <ExternalLink className="h-4 w-4" /></a></div>}
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
      {anime.trailer_key && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Trailer</h3>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${anime.trailer_key}`}
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
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {anime.staff.map((membro: any) => (
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
      )}

      {/* Personagens com Seletor de Dublagem */}
      {anime.personagens && anime.personagens.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold orbe-text-secondary">Personagens e Dubladores</h3>
            <div className="flex bg-muted rounded-lg p-1">
              <button onClick={() => setSelectedDubbing('jp')} className={`px-3 py-1 rounded text-sm transition-colors ${selectedDubbing === 'jp' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                JP
              </button>
              {hasPtBrDub && (
                <button onClick={() => setSelectedDubbing('pt')} className={`px-3 py-1 rounded text-sm transition-colors ${selectedDubbing === 'pt' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                  PT-BR
                </button>
              )}
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {anime.personagens.map((p: any) => (
              <div key={p.id} className="flex-shrink-0 text-center w-28 space-y-2">
                <div className="w-24 h-24 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
                  {p.foto_url && (<Image src={p.foto_url} alt={p.nome} width={96} height={96} className="w-full h-full object-cover" unoptimized={true} />)}
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-2">{p.nome}</p>
                {p.dubladores?.[selectedDubbing] && (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
                      {p.dubladores[selectedDubbing].foto_url && (<Image src={p.dubladores[selectedDubbing].foto_url} alt={p.dubladores[selectedDubbing].nome} width={64} height={64} className="w-full h-full object-cover" unoptimized={true} />)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.dubladores[selectedDubbing].nome}</p>
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
