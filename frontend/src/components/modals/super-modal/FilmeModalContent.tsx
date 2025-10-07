'use client';

import { Filme, CalendarModalData } from '@/types';
import FilmeInfoBlock from './FilmeInfoBlock';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from 'next/image';

interface FilmeModalContentProps {
  filme: Filme;
  openCalendarModal: (data: CalendarModalData) => void;
}

const FilmeModalContent: React.FC<FilmeModalContentProps> = ({ filme }) => {
  if (!filme) {
    return <div>Carregando...</div>;
  }

  const trailerKey = filme.trailer_key || filme.videos?.find(v => v.type === 'Trailer')?.key;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Bloco Superior: Pôster e Informações Principais */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-48 flex-shrink-0 mx-auto md:mx-0">
          <Image
            src={filme.poster_curado || filme.poster_url_api || '/placeholder-poster.jpg'}
            alt={`Pôster de ${filme.titulo_curado || filme.titulo_api}`}
            width={500}
            height={750}
            className="rounded-lg shadow-lg w-full"
          />
        </div>
        <div className="flex-1">
          <FilmeInfoBlock filme={filme} />
        </div>
      </div>

      {/* Sinopse */}
      {filme.sinopse && (
        <section>
          <h2 className="text-xl font-bold mb-2 text-yellow-500 dark:text-blue-400">Sinopse</h2>
          <p className="text-muted-foreground leading-relaxed">{filme.sinopse}</p>
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
      {filme.elenco && filme.elenco.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-500 dark:text-blue-400">Elenco</h2>
          <TooltipProvider>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent>
                {filme.elenco.map(ator => (
                  <CarouselItem key={ator.id} className="basis-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center w-24 cursor-pointer">
                          <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                            <Image
                              src={ator.foto_url || '/placeholder-avatar.jpg'}
                              alt={ator.nome}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-semibold text-xs truncate w-full">{ator.nome}</p>
                          <p className="text-xs text-muted-foreground truncate w-full">{ator.personagem}</p>
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
    </div>
  );
};

export default FilmeModalContent;
