'use client';

import { Serie, CalendarModalData } from '@/types';
import SerieInfoBlock from './SerieInfoBlock';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from 'next/image';

interface SerieModalContentProps {
  serie: Serie;
  openCalendarModal: (data: CalendarModalData) => void;
}

const SerieModalContent: React.FC<SerieModalContentProps> = ({ serie }) => {
  if (!serie) {
    return <div>Carregando...</div>;
  }

  const trailerKey = serie.trailer_key || serie.videos?.find(v => v.type === 'Trailer')?.key;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Bloco Superior: Pôster e Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Image
            src={serie.poster_curado || serie.poster_url_api || '/placeholder.png'}
            alt={`Pôster de ${serie.titulo_curado || serie.titulo_api}`}
            width={500}
            height={750}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:col-span-2">
          <SerieInfoBlock serie={serie} />
        </div>
      </div>

      {/* Sinopse */}
      {serie.sinopse && (
        <section>
          <h2 className="text-xl font-bold mb-2 text-yellow-500 dark:text-blue-400">Sinopse</h2>
          <p className="text-gray-300">{serie.sinopse}</p>
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
      {serie.elenco && serie.elenco.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-500 dark:text-blue-400">Elenco</h2>
          <TooltipProvider>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent>
                {serie.elenco.map(ator => (
                  <CarouselItem key={ator.id} className="basis-auto">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center text-center w-24">
                          <Image
                            src={ator.foto_url || '/placeholder-person.png'}
                            alt={ator.nome}
                            width={96}
                            height={144}
                            className="rounded-full object-cover h-24 w-24 mb-2"
                          />
                          <p className="font-semibold text-sm truncate w-full">{ator.nome}</p>
                          <p className="text-xs text-gray-400 truncate w-full">{ator.personagem}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{ator.nome} como {ator.personagem}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </TooltipProvider>
        </section>
      )}

      {/* Lista de Temporadas */}
      {serie.temporadas && serie.temporadas.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-500 dark:text-blue-400">Temporadas</h2>
          <div className="space-y-2">
            {serie.temporadas.map(season => (
              <div key={season.numero} className="flex justify-between items-center bg-muted p-2 rounded-lg">
                <span className="font-medium">{season.nome || `Temporada ${season.numero}`}</span>
                <span className="text-muted-foreground">{season.episodios} episódios</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SerieModalContent;
