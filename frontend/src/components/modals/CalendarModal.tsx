
'use client';

import { useState } from 'react';
import { X, Calendar, Ticket, Plus } from 'lucide-react';
import type { Filme, Serie, Anime, Jogo } from '@/types';

interface CalendarModalProps {
  isOpen: boolean;
  midia: Filme | Serie | Anime | Jogo | null;
  type: string | null;
  onClose: () => void;
  onAddEvent: (eventType: 'release' | 'ticket', details?: { date?: string; time?: string; location?: string; recurring?: boolean }) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  midia,
  type,
  onClose,
  onAddEvent
}) => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketDetails, setTicketDetails] = useState({ date: '', time: '', location: '' });

  if (!isOpen || !midia) return null;

  const handleTicketDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketDetails({ ...ticketDetails, [e.target.name]: e.target.value });
  };

  const handleAddTicketEvent = () => {
    onAddEvent('ticket', ticketDetails);
    handleClose();
  };

  const handleClose = () => {
    setShowTicketForm(false);
    setTicketDetails({ date: '', time: '', location: '' });
    onClose();
  };

  const renderFilmeOptions = () => (
    <div className="space-y-4">
      <button
        onClick={() => onAddEvent('release')}
        className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
      >
        <Calendar className="h-6 w-6" />
        <span className="font-semibold text-lg">Adicionar Evento de Lançamento</span>
      </button>
      <button
        onClick={() => setShowTicketForm(true)}
        className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition-colors"
      >
        <Ticket className="h-6 w-6" />
        <span className="font-semibold text-lg">Adicionar Evento de Ingresso</span>
      </button>
    </div>
  );

  const renderAnimeOptions = () => (
    <div className="space-y-4">
        <button
            onClick={() => onAddEvent('release')}
            className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
        >
            <Calendar className="h-6 w-6" />
            <span className="font-semibold text-lg">Adicionar Evento de Lançamento</span>
        </button>
        <button
            onClick={() => onAddEvent('release', { recurring: true })}
            className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition-colors"
        >
            <Plus className="h-6 w-6" />
            <span className="font-semibold text-lg">Criar Eventos Recorrentes</span>
        </button>
    </div>
  );

  const renderDefaultOptions = () => (
    <button
      onClick={() => onAddEvent('release')}
      className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
    >
      <Calendar className="h-6 w-6" />
      <span className="font-semibold text-lg">Adicionar Evento de Lançamento</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Adicionar ao Calendário</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!showTicketForm ? (
            <>
              {type === 'filme' && renderFilmeOptions()}
              {type === 'anime' && renderAnimeOptions()}
              {(type === 'serie' || type === 'jogo') && renderDefaultOptions()}
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Detalhes do Ingresso</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <input type="date" name="date" value={ticketDetails.date} onChange={handleTicketDetailsChange} className="w-full p-2 border border-border rounded-lg bg-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hora</label>
                <input type="time" name="time" value={ticketDetails.time} onChange={handleTicketDetailsChange} className="w-full p-2 border border-border rounded-lg bg-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Local (Cinema)</label>
                <input type="text" name="location" value={ticketDetails.location} onChange={handleTicketDetailsChange} placeholder="Ex: Cinemark Shopping" className="w-full p-2 border border-border rounded-lg bg-input" />
              </div>
              <div className="flex space-x-3">
                <button onClick={handleAddTicketEvent} className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">Adicionar</button>
                <button onClick={() => setShowTicketForm(false)} className="flex-1 bg-muted text-muted-foreground py-3 px-4 rounded-lg font-semibold hover:bg-muted/80 transition-colors">Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;


