'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  Edit,
  Calendar,
  Clock,
  Star,
  Tv,
  BookOpen,
  Gamepad2,
  Heart,
  Bookmark,
  Check,
  EyeOff,
  Send,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AwardIcon from '@/components/ui/AwardIcons';
import PlatformIcon from '@/components/ui/PlatformIcons';
import CalendarModal from './CalendarModal';
import AnimeModalContent from './super-modal/AnimeModalContent';
import FilmeModalContent from './super-modal/FilmeModalContent';
import SerieModalContent from './super-modal/SerieModalContent';
import JogoModalContent from './super-modal/JogoModalContent';
import type { Filme, Serie, Jogo, CastMember, StaffMember, Plataforma, Comentario } from '@/types';

// Tipos locais para o SuperModal
interface Personagem {
  id: string;
  nome: string;
  imagem?: string;
  dubladores?: {
    jp?: { nome: string; foto_url?: string; };
    pt_br?: { nome: string; foto_url?: string; };
  };
}

interface Anime extends Serie {
  fonte?: string;
  estudio?: string;
  dublagem_info?: string;
  mal_link?: string;
  tags?: string[];
  status?: 'RELEASING' | 'FINISHED' | 'NOT_YET_RELEASED';
  staff?: Staff[];
  personagens?: Personagem[];
}

const SuperModal: React.FC = () => {
  const { isSuperModalOpen, superModalData, closeSuperModal, isAuthenticated, user, openCalendarModal, closeCalendarModal, isCalendarModalOpen } = useAppStore();
  
  const [elenco, setElenco] = useState<CastMember[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [userInteraction, setUserInteraction] = useState({
    favorited: false,
    wantToWatch: false,
    watching: false,
    watched: false,
    notInterested: false
  });

  useEffect(() => {
    if (!isSuperModalOpen) {
      setElenco([]);
      setStaff([]);
      setPersonagens([]);
      setComentarios([]);
      setNewComment('');
      setIsEditMode(false);
    }
  }, [isSuperModalOpen]);

  const { midia, type } = superModalData;

  useEffect(() => {
    if (isSuperModalOpen && midia) {
      loadAdditionalData();
    }
  }, [isSuperModalOpen, midia]);

  const loadAdditionalData = async () => {
    if (!midia || !type) return;
    try {
      if (type === 'filme') setElenco((midia as Filme).elenco || []);
      else if (type === 'serie') setElenco((midia as Serie).elenco || []);
      else if (type === 'anime') {
        setStaff((midia as Anime).staff || []);
        setPersonagens((midia as Anime).personagens || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados adicionais:', error);
    }
  };

  const loadComments = async () => {
    if (!midia) return;
    try {
      setComentarios([
        { id: '1', userId: 'user1', username: 'João Silva', avatar: '/placeholder-avatar.jpg', text: 'Ótimo!', timestamp: '2024-07-21T10:00:00Z' },
      ]);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !midia) return;
    const commentToAdd: Comentario = {
      id: String(comentarios.length + 1),
      userId: 'currentUser', username: 'Você', avatar: '/placeholder-avatar.jpg',
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
    };
    setComentarios((prev) => [commentToAdd, ...prev]);
    setNewComment('');
  };

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

  const renderContent = () => {
    if (!midia || !type) return null;

    switch (type) {
      case 'anime':
        return <AnimeModalContent anime={midia as Anime} staff={staff} personagens={personagens} openCalendarModal={openCalendarModal} />;
      case 'filme':
        return <FilmeModalContent filme={midia as Filme} elenco={elenco} openCalendarModal={openCalendarModal} />;
      case 'serie':
        return <SerieModalContent serie={midia as Serie} elenco={elenco} openCalendarModal={openCalendarModal} />;
      case 'jogo':
        return <JogoModalContent jogo={midia as Jogo} openCalendarModal={openCalendarModal} />;
      default:
        return null;
    }
  };

  if (!isSuperModalOpen || !midia || !type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto" onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow-xl max-w-4xl mx-auto super-modal-content">
          <div className="relative p-6 pb-0">
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

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-72 bg-muted rounded-lg overflow-hidden">
                  <Image src={midia.poster_curado || midia.poster_url_api || '/placeholder-poster.jpg'} alt={midia.titulo_curado || midia.titulo_api} width={192} height={288} className="w-full h-full object-cover" />
                </div>
                {type === 'anime' && (midia as Anime).tags && ((midia as Anime).tags?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2 orbe-text-secondary">Tags</h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(midia as Anime).tags!.map((tag: string, index: number) => (
                        <span key={index} className="bg-muted px-2 py-1 rounded-full text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">{midia.titulo_curado || midia.titulo_api}</h1>
                  {midia.titulo_api && midia.titulo_api !== midia.titulo_curado && (<p className="text-lg text-muted-foreground">{midia.titulo_api}</p>)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{midia.data_lancamento_curada || midia.data_lancamento_api ? format(parseISO(midia.data_lancamento_curada || midia.data_lancamento_api), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}</div>
                  {midia.avaliacao && (<div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{midia.avaliacao}</div>)}
                  {type === 'filme' && (midia as Filme).duracao && (<div className="flex items-center gap-1"><Clock className="h-4 w-4" />{(midia as Filme).duracao} min</div>)}
                  {type === 'serie' && (midia as Serie).numero_temporadas && (<div className="flex items-center gap-1"><Tv className="h-4 w-4" />{(midia as Serie).numero_temporadas} Temporada{((midia as Serie).numero_temporadas ?? 0) > 1 ? 's' : ''}</div>)}
                  {type === 'anime' && (midia as Anime).numero_episodios && (<div className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{(midia as Anime).numero_episodios} Episódios</div>)}
                  {type === 'jogo' && (midia as Jogo).plataformas_jogo && (midia as Jogo).plataformas_jogo.length > 0 && (<div className="flex items-center gap-1"><Gamepad2 className="h-4 w-4" />{(midia as Jogo).plataformas_jogo.map(p => p.nome).join(', ')}</div>)}
                </div>
                {midia.generos_api && midia.generos_api.length > 0 && (<div className="flex flex-wrap gap-2 text-sm">{(midia.generos_curados || midia.generos_api).map((genero) => (<span key={genero.id} className="bg-muted px-2 py-1 rounded-full text-muted-foreground">{genero.name}</span>))}</div>)}
                {type === 'anime' && (
                  <div className="space-y-3 pt-4 border-t border-border text-sm">
                    <div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Fonte:</span><span className="text-muted-foreground">{(midia as Anime).fonte || 'N/A'}</span></div>
                    <div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Estúdio(s):</span><span className="text-muted-foreground">{(midia as Anime).estudio || 'N/A'}</span></div>
                    <div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Dublagem:</span><span className="text-muted-foreground">{(midia as Anime).dublagem_info || 'Legendado'}</span></div>
                    {(midia as Anime).mal_link && (<div className="flex items-center gap-2"><span className="font-semibold w-24 flex-shrink-0">Link Externo:</span><a href={(midia as Anime).mal_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">MyAnimeList <ExternalLink className="h-4 w-4" /></a></div>)}
                    {(midia as Serie).plataformas_curadas && (midia as Serie).plataformas_curadas!.length > 0 && (<div className="flex items-start gap-2"><span className="font-semibold w-24 flex-shrink-0 pt-1">Streaming:</span>{renderPlatformIcons((midia as Serie).plataformas_curadas as Plataforma[])}</div>)}
                  </div>
                )}
                {midia.premiacoes && midia.premiacoes.length > 0 && (<div className="flex items-center gap-2"><span className="text-sm font-medium text-foreground">Prêmios:</span><div className="flex gap-1 flex-wrap">{midia.premiacoes.map((award, index) => (<AwardIcon key={index} award={award.nome} status={award.status} year={award.ano} className="h-4 w-4" size={16} />))}</div></div>)}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button onClick={() => handleInteraction('favorited')} className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${userInteraction.favorited ? 'bg-red-500 text-white' : 'bg-muted text-foreground hover:bg-muted/80'}`}><Heart className="h-4 w-4" />Favoritar</button>
                    <button onClick={() => handleInteraction('wantToWatch')} className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${userInteraction.wantToWatch ? 'bg-blue-500 text-white' : 'bg-muted text-foreground hover:bg-muted/80'}`}><Bookmark className="h-4 w-4" />Quero Assistir</button>
                    <button onClick={() => handleInteraction('watched')} className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${userInteraction.watched ? 'bg-green-500 text-white' : 'bg-muted text-foreground hover:bg-muted/80'}`}><Check className="h-4 w-4" />Já Assisti</button>
                    <button onClick={() => handleInteraction('notInterested')} className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${userInteraction.notInterested ? 'bg-gray-500 text-white' : 'bg-muted text-foreground hover:bg-muted/80'}`}><EyeOff className="h-4 w-4" />Não me Interessa</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            {renderContent()}

            <div className="mt-6">
              <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Comentários</h3>
              {isAuthenticated ? (
                <div className="mb-6">
                  <Textarea placeholder="Escreva seu comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="mb-2" />
                  <Button onClick={handlePostComment} disabled={!newComment.trim()}><Send className="h-4 w-4 mr-2" /> Enviar Comentário</Button>
                </div>
              ) : (<p className="text-muted-foreground mb-4">Faça login para deixar um comentário.</p>)}
              {comentarios.length > 0 ? (<div className="space-y-4">{comentarios.map((comment) => (<div key={comment.id} className="flex gap-3 p-4 bg-muted rounded-lg"><Image src={comment.avatar || '/placeholder-avatar.jpg'} alt={comment.username} width={40} height={40} className="rounded-full object-cover" /><div><p className="font-semibold text-foreground">{comment.username}</p><p className="text-sm text-muted-foreground">{format(parseISO(comment.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p><p className="mt-2 text-foreground leading-relaxed">{comment.text}</p></div></div>))}</div>) : (<p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro a comentar!</p>)}
            </div>
          </div>
        </div>
      </div>
      <CalendarModal isOpen={isCalendarModalOpen} midia={superModalData.midia} type={superModalData.type} onClose={closeCalendarModal} onAddEvent={handleCalendarAction} />
    </div>
  );
};

export default SuperModal;
