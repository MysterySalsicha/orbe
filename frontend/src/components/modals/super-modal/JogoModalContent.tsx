'use client';

import { Play, Calendar, ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Jogo } from '@/types';

interface JogoModalContentProps {
  jogo: Jogo;
  openCalendarModal: (data: { midia: Jogo; type: 'jogo' }) => void;
}

const JogoModalContent: React.FC<JogoModalContentProps> = ({ jogo, openCalendarModal }) => {
  const isAvailableToBuy = jogo.plataformas_jogo && jogo.plataformas_jogo.length > 0;

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button disabled={!isAvailableToBuy} asChild>
          <a href={isAvailableToBuy ? jogo.plataformas_jogo[0].store_url : undefined} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="h-5 w-5 mr-2" />Comprar Jogo
          </a>
        </Button>
        {jogo.trailer_url_api && (
          <Button variant="secondary" asChild>
            <a href={jogo.trailer_url_api} target="_blank" rel="noopener noreferrer">
              <Play className="h-5 w-5 mr-2" />Assistir Trailer
            </a>
          </Button>
        )}
        <Button variant="secondary" onClick={() => openCalendarModal({ midia: jogo, type: 'jogo' })}>
          <Calendar className="h-5 w-5 mr-2" />Adicionar ao Calendário
        </Button>
      </div>

      {/* Sinopse */}
      {jogo.sinopse_curada && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
          <p className="text-muted-foreground leading-relaxed">{jogo.sinopse_curada}</p>
        </div>
      )}

      {/* Lojas Digitais */}
      {isAvailableToBuy && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Onde Comprar</h3>
          <div className="flex flex-wrap gap-3">
            {jogo.plataformas_jogo.map((loja) => (
              <a
                key={loja.id}
                href={loja.store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">{loja.nome}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JogoModalContent;
