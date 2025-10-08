'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, Edit, Calendar, Clock, Star, Tv, BookOpen, Gamepad2, Heart, Bookmark, Check, EyeOff, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';


import { apiClient } from '@/lib/api';
import AwardIcon from '@/components/ui/AwardIcons';
import PlatformIcon from '@/components/ui/PlatformIcons';
import CalendarModal from './CalendarModal';
import AnimeModalContent from './super-modal/AnimeModalContent';
import FilmeModalContent from './super-modal/FilmeModalContent';
import SerieModalContent from './super-modal/SerieModalContent';
import JogoModalContent from './super-modal/JogoModalContent';
import FilmeEditForm from './super-modal/FilmeEditForm';
import SerieEditForm from './super-modal/SerieEditForm';
import AnimeEditForm from './super-modal/AnimeEditForm';
import JogoInfoBlock from './super-modal/JogoInfoBlock';
import AnimeInfoBlock from './super-modal/AnimeInfoBlock';
import SerieInfoBlock from './super-modal/SerieInfoBlock';
import FilmeInfoBlock from './super-modal/FilmeInfoBlock';
import JogoEditForm from './super-modal/JogoEditForm';
import type { Filme, Serie, Jogo, Anime, Plataforma, FilmeDetalhes } from '@/types';

const SuperModal: React.FC = () => {
  const { isSuperModalOpen, superModalData, closeSuperModal, isAuthenticated, user, openCalendarModal, closeCalendarModal, isCalendarModalOpen } = useAppStore();
  
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [details, setDetails] = useState<Filme | Serie | Anime | Jogo | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const { midia, type } = superModalData;

  const loadAdditionalData = useCallback(async () => {
    if (!midia || !type) return;

    setIsLoadingDetails(true);
    setDetails(null);
    try {
      const data = await apiClient.get(`/${type}s/${midia.id}/details`);
      setDetails(data);
    } catch (error) {
      console.error('Erro ao carregar dados adicionais:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [midia, type]);

  useEffect(() => {
    if (isSuperModalOpen && midia) {
      // Reset edit mode when modal opens
      setIsEditMode(false);
      loadAdditionalData();
    }
  }, [isSuperModalOpen, midia, loadAdditionalData]);

  

  const handleClose = useCallback(() => { window.history.back(); }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    const handlePopState = (event: PopStateEvent) => {
      if (!event.state?.modal) closeSuperModal();
    };

    if (isSuperModalOpen) {
      document.body.style.overflow = 'hidden';
      if (!window.history.state?.modal) {
        window.history.pushState({ modal: true }, '');
      }
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSuperModalOpen, closeSuperModal, handleClose]);

  const handleSave = (updatedMedia: Filme | Serie | Anime | Jogo) => {
    setDetails(updatedMedia);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const [userInteraction, setUserInteraction] = useState({
    favorited: false,
    wantToWatch: false,
    watched: false,
    notInterested: false,
  });

  const handleInteraction = (action: keyof typeof userInteraction) => {
    setUserInteraction((prev) => ({ ...prev, [action]: !prev[action] }));
  };

  const handleCalendarAction = (eventType: 'release' | 'ticket', details?: unknown) => {
    console.log(`Adicionar ao calendário: ${eventType}`, details);
    closeCalendarModal();
  };

  const renderPlatformIcons = (platforms: Plataforma[]) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {platforms.map((platform, index) => (
        <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
          <PlatformIcon platform={platform.nome} className="h-3 w-3" />
          <span>{platform.nome}</span>
        </div>
      ))}
    </div>
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`.trim();
    }
    return `${remainingMinutes}m`;
  };

  const renderContent = () => {
    if (isLoadingDetails) {
      return (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Carregando detalhes...</p>
        </div>
      );
    }

    if (!details) {
      return <div className="text-center p-8 text-destructive">Erro ao carregar detalhes.</div>;
    }

    if (isEditMode) {
        switch (type) {
            case 'filme':
                return <FilmeEditForm filme={details as any as Filme} onSave={handleSave} onCancel={handleCancel} />;
            case 'serie':
                return <SerieEditForm serie={details as Serie} onSave={handleSave} onCancel={handleCancel} />;
            case 'anime':
                return <AnimeEditForm anime={details as Anime} onSave={handleSave} onCancel={handleCancel} />;
            case 'jogo':
                return <JogoEditForm jogo={details as Jogo} onSave={handleSave} onCancel={handleCancel} />;
            default:
                return <div className="text-center p-8">Modo de edição não disponível para este tipo de mídia.</div>;
        }
    }

    // Passa o objeto de detalhes completo para os componentes filhos
    switch (type) {
      case 'anime':
        return <AnimeModalContent anime={details as Anime} openCalendarModal={openCalendarModal} />;
      case 'filme':
        return <FilmeModalContent filme={details as unknown as FilmeDetalhes} openCalendarModal={openCalendarModal} />;
      case 'serie':
        return <SerieModalContent serie={details as Serie} openCalendarModal={openCalendarModal} />;
      case 'jogo':
        return <JogoModalContent jogo={details as Jogo} openCalendarModal={openCalendarModal} />;
      default:
        return null;
    }
  };

  if (!isSuperModalOpen || !midia || !type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto" onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow-xl max-w-4xl mx-auto super-modal-content transition-colors">
          <>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {user?.role === 'admin' && (
                <button onClick={() => setIsEditMode(!isEditMode)} className={`p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors ${isEditMode ? 'bg-primary/20' : ''}`}>
                  <Edit className="h-5 w-5 text-primary" />
                </button>
              )}
              <button onClick={handleClose} className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
                <X className="h-5 w-5 text-primary" />
              </button>
            </div>
            {/* The content components now handle their own layout, including poster and info */}
            {renderContent()}
          </>
        </div>
      </div>
      <CalendarModal isOpen={isCalendarModalOpen} midia={superModalData.midia} type={superModalData.type} onClose={closeCalendarModal} onAddEvent={handleCalendarAction} />
    </div>
  );
};

export default SuperModal;
