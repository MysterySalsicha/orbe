'use client';

import { FilmeDetalhes, CalendarModalData } from '@/types';
import FilmeInfoBlock from './FilmeInfoBlock';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from 'next/image';

interface FilmeModalContentProps {
  filme: FilmeDetalhes;
  openCalendarModal: (data: CalendarModalData) => void;
}

const FilmeModalContent: React.FC<FilmeModalContentProps> = ({ filme, openCalendarModal }) => {
  if (!filme) {
    return <div>Carregando...</div>;
  }

  const trailerKey = filme.videos?.find(v => v.type === 'Trailer' && v.official)?.key;

  // Lógica dos botões
  const releaseDate = filme.releaseDate ? new Date(filme.releaseDate) : null;
  const now = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);
  
  const isMovieInTheaters = filme.status === 'Released' && releaseDate && releaseDate > ninetyDaysAgo && releaseDate <= now;
  const isFutureRelease = releaseDate && releaseDate > now;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Bloco Superior: Pôster e Informações Principais */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-48 flex-shrink-0 mx-auto md:mx-0">
          <Image
            src={filme.posterPath ? `https://image.tmdb.org/t/p/original${filme.posterPath}` : '/placeholder-poster.jpg'}
            alt={`Pôster de ${filme.title}`}
            width={500}
            height={750}
            className="rounded-lg shadow-lg w-full"
          />
        </div>
        <div className="flex-1">
          <FilmeInfoBlock filme={filme} />

          <div className="flex items-center gap-4 mt-4">
            {/* Botão Adicionar ao Calendário */}
            {isFutureRelease && (
              <Button onClick={() => openCalendarModal({ midia: filme as any, type: 'filme' })}>Adicionar ao Calendário</Button>
            )}

            {/* Botão Comprar Ingresso */}
            {isMovieInTheaters && (
              filme.ingresso_link ? (
                <Button asChild>
                  <a href={filme.ingresso_link} target="_blank" rel="noopener noreferrer">
                    Comprar Ingresso
                  </a>
                </Button>
              ) : (
                <Button disabled>
                  Ingresso Indisponível
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Sinopse */}
      {filme.overview && (
        <section>
          <h2 className="text-xl font-bold mb-2 text-yellow-500 dark:text-blue-400">Sinopse</h2>
          <p className="text-muted-foreground leading-relaxed">{filme.overview}</p>
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

      {/* Carrossel de Elenco */}
      {filme.cast && filme.cast.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-500 dark:text-blue-400">Elenco</h2>
          <TooltipProvider>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent>
                {filme.cast.map(ator => (
                  <CarouselItem key={ator.pessoa.id} className="basis-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center w-24 cursor-pointer">
                          <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                            <Image
                              src={ator.pessoa.profilePath ? `https://image.tmdb.org/t/p/original${ator.pessoa.profilePath}` : '/placeholder-avatar.jpg'}
                              alt={ator.pessoa.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-semibold text-xs truncate w-full">{ator.pessoa.name}</p>
                          <p className="text-xs text-muted-foreground truncate w-full">{ator.character}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{ator.pessoa.name} como {ator.character}</p>
                      </TooltipContent>
                    </Tooltip>
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

export default FilmeModalContent;