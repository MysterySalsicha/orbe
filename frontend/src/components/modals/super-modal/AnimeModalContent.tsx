'use client';

import { useState } from 'react';
import { Anime, Character, StaffMember, CalendarModalData } from '@/types';
import AnimeInfoBlock from './AnimeInfoBlock';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { translateRole } from '@/lib/media-helpers';
import Image from 'next/image';

interface AnimeModalContentProps {
  anime: Anime;
  openCalendarModal: (data: CalendarModalData) => void;
}

// Local component for Character Cards, as it's complex and specific to this modal
const CharacterCard = ({ character }: { character: Character }) => {
  const [selectedDubbing, setSelectedDubbing] = useState<'jp' | 'pt'>('jp');
  const voiceActor = character.dubladores?.[selectedDubbing];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="text-center w-32 cursor-pointer space-y-2">
          {/* Character Image */}
          <div className="w-24 h-24 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
            <Image
              src={character.foto_url || '/placeholder-avatar.jpg'}
              alt={character.nome}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-2 h-10">{character.nome}</p>

          {/* Dub Selector */}
          {character.dubladores && (character.dubladores.jp || character.dubladores.pt) && (
            <div className="flex bg-muted rounded-lg p-1 mx-auto w-fit">
              {character.dubladores.jp && (
                <button onClick={(e) => { e.stopPropagation(); setSelectedDubbing('jp'); }} className={`px-2 py-0.5 rounded text-xs transition-colors ${selectedDubbing === 'jp' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                  JP
                </button>
              )}
              {character.dubladores.pt && (
                <button onClick={(e) => { e.stopPropagation(); setSelectedDubbing('pt'); }} className={`px-2 py-0.5 rounded text-xs transition-colors ${selectedDubbing === 'pt' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}>
                  PT-BR
                </button>
              )}
            </div>
          )}

          {/* Voice Actor */}
          <div className="h-28">
            {voiceActor && (
              <>
                <div className="w-16 h-16 bg-muted rounded-full mb-1 overflow-hidden mx-auto">
                  <Image
                    src={voiceActor.foto_url || '/placeholder-avatar.jpg'}
                    alt={voiceActor.nome}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 h-8">{voiceActor.nome}</p>
              </>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{character.nome} ({voiceActor ? `Dub: ${voiceActor.nome}` : 'Dublador não informado'})</p>
      </TooltipContent>
    </Tooltip>
  );
};


const AnimeModalContent: React.FC<AnimeModalContentProps> = ({ anime }) => {
  if (!anime) {
    return <div>Carregando...</div>;
  }

  const trailerKey = anime.trailer_key || anime.videos?.find(v => v.type === 'Trailer')?.key;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Bloco Superior: Pôster e Informações Principais */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-48 flex-shrink-0 mx-auto md:mx-0">
          <Image
            src={anime.poster_curado || anime.poster_url_api || '/placeholder-poster.jpg'}
            alt={`Pôster de ${anime.titleEnglish || anime.titleRomaji}`}
            width={500}
            height={750}
            className="rounded-lg shadow-lg w-full"
          />
        </div>
        <div className="flex-1">
          <AnimeInfoBlock anime={anime} />
        </div>
      </div>

      {/* Sinopse */}
      {anime.sinopse && (
        <section>
          <h2 className="text-xl font-bold mb-2 text-yellow-500 dark:text-blue-400">Sinopse</h2>
          <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: anime.sinopse }}></p>
        </section>
      )}
      
      {/* Trailer */}
      {trailerKey && (
        <section>
          <h2 className="text-xl font-bold mb-2 text-yellow-500 dark:text-blue-400">Trailer</h2>
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
        </section>
      )}

      {/* Equipe de Produção (Staff) */}
      {anime.staff && anime.staff.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-500 dark:text-blue-400">Equipe de Produção</h2>
          <TooltipProvider>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent>
                {anime.staff.map((membro: StaffMember) => (
                  <CarouselItem key={membro.id} className="basis-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center w-24 cursor-pointer">
                          <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                            <Image
                              src={membro.foto_url || '/placeholder-avatar.jpg'}
                              alt={membro.nome}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-semibold text-xs truncate w-full">{membro.nome}</p>
                          <p className="text-xs text-muted-foreground truncate w-full">{translateRole(membro.funcao)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{membro.nome} - {translateRole(membro.funcao)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </TooltipProvider>
        </section>
      )}

      {/* Personagens */}
      {anime.personagens && anime.personagens.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-500 dark:text-blue-400">Personagens</h2>
          <TooltipProvider>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent>
                {anime.personagens.map((character: Character) => (
                  <CarouselItem key={character.id} className="basis-auto">
                    <CharacterCard character={character} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </TooltipProvider>
        </section>
      )}
    </div>
  );
};

export default AnimeModalContent;
