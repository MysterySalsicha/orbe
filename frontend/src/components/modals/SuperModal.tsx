
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  Play,
  Calendar,
  Clock,
  Star,
  Heart,
  Bookmark,
  Eye,
  EyeOff,
  Edit,
  ExternalLink,
  ShoppingCart,
  Check,
  ThumbsDown,
  Award,
  Tv,
  Gamepad2,
  Film,
  BookOpen,
  MessageSquare,
  Send
} from 'lucide-react';
import PlatformIcon from '@/components/ui/PlatformIcons';
import AwardIcon from '@/components/ui/AwardIcons';
import { useAppStore } from '@/stores/appStore';
import { realApi } from '@/lib/api'; // Usar a API real
import type { Filme, Serie, Anime, Jogo, Elenco, Staff, Personagem, Plataforma, Comentario } from '@/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CalendarModal from './CalendarModal';

const SuperModal: React.FC = () => {
  const { isSuperModalOpen, superModalData, closeSuperModal, isAuthenticated, openCalendarModal, closeCalendarModal, isCalendarModalOpen } = useAppStore();
  const [elenco, setElenco] = useState<Elenco[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedDubbing, setSelectedDubbing] = useState<'jp' | 'pt-br'>('jp');
  const [isLoading, setIsLoading] = useState(false);
  const [userInteraction, setUserInteraction] = useState({
    favorited: false,
    wantToWatch: false,
    watching: false,
    watched: false,
    notInterested: false
  });

  const { midia, type } = superModalData;

  // Carrega dados adicionais quando o modal abre
  useEffect(() => {
    if (isSuperModalOpen && midia) {
      loadAdditionalData();
      loadComments();
    }
  }, [isSuperModalOpen, midia]);

  const loadAdditionalData = async () => {
    if (!midia || !type) return;
    
    setIsLoading(true);
    try {
      // Aqui você faria as chamadas para o seu backend para obter detalhes completos
      // Por enquanto, vamos simular com os dados já existentes ou mockados se necessário
      if (type === 'filme') {
        // Exemplo: const fullFilmeData = await realApi.getFilmeDetails(midia.id);
        setElenco(midia.elenco || []); // Usando o que já vem no midia
      } else if (type === 'serie') {
        setElenco(midia.elenco || []);
      } else if (type === 'anime') {
        setStaff(midia.staff || []);
        setPersonagens(midia.personagens || []);
      } else if (type === 'jogo') {
        // Não há dados adicionais específicos para jogos no momento na especificação
      }
    } catch (error) {
      console.error('Erro ao carregar dados adicionais:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    if (!midia) return;
    try {
      // const comments = await realApi.getComments(midia.id, type);
      // setComentarios(comments);
      // Mock de comentários
      setComentarios([
        { id: '1', userId: 'user1', username: 'João Silva', avatar: '/placeholder-avatar.jpg', text: 'Adorei esse filme! A história é muito envolvente.', timestamp: '2024-07-20T10:00:00Z' },
        { id: '2', userId: 'user2', username: 'Maria Souza', avatar: '/placeholder-avatar.jpg', text: 'Assisti com a família e todos gostaram. Recomendo!', timestamp: '2024-07-20T11:30:00Z' },
      ]);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !midia) return;
    // Simular envio para o backend
    const newId = String(comentarios.length + 1);
    const commentToAdd: Comentario = {
      id: newId,
      userId: 'currentUser',
      username: 'Você',
      avatar: '/placeholder-avatar.jpg',
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
    };
    setComentarios((prev) => [commentToAdd, ...prev]);
    setNewComment('');
    // await realApi.postComment(midia.id, type, newComment.trim());
  };

  const handleClose = useCallback(() => {
    setElenco([]);
    setStaff([]);
    setPersonagens([]);
    setComentarios([]);
    setNewComment('');
    closeSuperModal();
  }, [closeSuperModal]);

  // Fechar com ESC ou clique fora
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const modalContent = document.querySelector('.super-modal-content');
      if (modalContent && !modalContent.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isSuperModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSuperModalOpen, handleClose]);

  const handleInteraction = (action: keyof typeof userInteraction) => {
    setUserInteraction((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
    // Aqui você enviaria a interação para o backend
  };

  const handleCalendarAction = (eventType: 'release' | 'ticket', details?: any) => {
    console.log(`Adicionar ao calendário: ${eventType}`, details);
    // Aqui você integraria com um serviço de calendário (Google Calendar, Outlook, etc.)
    closeCalendarModal();
  };

  const renderPlatformIcons = (platforms: Plataforma[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {platforms.map((platform, index) => (
          <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
            <PlatformIcon platform={platform.nome} className="h-3 w-3" />
            <span>{platform.nome}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderFilmeContent = (filme: Filme) => {
    const isAvailableToBuyTicket = filme.link_ingresso && filme.em_cartaz;
    const isAvailableToWatchNow = filme.link_assistir_agora;
    const hasReleased = filme.data_lancamento_curada ? parseISO(filme.data_lancamento_curada) <= new Date() : false;

    return (
      <div className="space-y-6">
        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isAvailableToBuyTicket ? (
            <a
              href={filme.link_ingresso}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              Comprar Ingresso
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-gray-300 cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5" />
              Indisponível
            </button>
          )}

          {hasReleased && isAvailableToWatchNow ? (
            <a
              href={filme.link_assistir_agora}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Play className="h-5 w-5" />
              Assistir Agora
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-gray-300 cursor-not-allowed"
            >
              <Play className="h-5 w-5" />
              Indisponível
            </button>
          )}

          <button
            onClick={() => openCalendarModal({ midia, type: 'filme' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            Adicionar ao Calendário
          </button>
        </div>

        {/* Sinopse */}
        {filme.sinopse && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
            <p className="text-muted-foreground leading-relaxed">{filme.sinopse}</p>
          </div>
        )}

        {/* Trailer */}
        {filme.trailer_url && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Trailer</h3>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${filme.trailer_url.split('v=')[1]}`}
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

        {/* Elenco */}
        {elenco.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Elenco</h3>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {elenco.map((ator) => (
                <div key={ator.id} className="flex-shrink-0 text-center w-24">
                  <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                    {ator.foto && (
                      <Image
                        src={ator.foto}
                        alt={ator.nome}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{ator.nome}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ator.personagem}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSerieContent = (serie: Serie) => {
    const isAvailableToWatchNow = serie.link_assistir_agora;
    return (
      <div className="space-y-6">
        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isAvailableToWatchNow ? (
            <a
              href={serie.link_assistir_agora}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Play className="h-5 w-5" />
              Assistir Agora
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-gray-300 cursor-not-allowed"
            >
              <Play className="h-5 w-5" />
              Indisponível
            </button>
          )}

          <button
            onClick={() => openCalendarModal({ midia, type: 'serie' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            Adicionar ao Calendário
          </button>
        </div>

        {/* Sinopse */}
        {serie.sinopse && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
            <p className="text-muted-foreground leading-relaxed">{serie.sinopse}</p>
          </div>
        )}

        {/* Trailer */}
        {serie.trailer_url && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Trailer</h3>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${serie.trailer_url.split('v=')[1]}`}
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

        {/* Elenco */}
        {elenco.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Elenco Principal</h3>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {elenco.map((ator) => (
                <div key={ator.id} className="flex-shrink-0 text-center w-24">
                  <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                    {ator.foto && (
                      <Image
                        src={ator.foto}
                        alt={ator.nome}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{ator.nome}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ator.personagem}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnimeContent = (anime: Anime) => {
    const isAvailableToWatchNow = anime.link_assistir_agora;
    return (
      <div className="space-y-6">
        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isAvailableToWatchNow ? (
            <a
              href={anime.link_assistir_agora}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Play className="h-5 w-5" />
              Assistir Agora
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-gray-300 cursor-not-allowed"
            >
              <Play className="h-5 w-5" />
              Indisponível
            </button>
          )}

          <button
            onClick={() => openCalendarModal({ midia, type: 'anime' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            Adicionar ao Calendário
          </button>
        </div>

        {/* Sinopse */}
        {anime.sinopse && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
            <p className="text-muted-foreground leading-relaxed">{anime.sinopse}</p>
          </div>
        )}

        {/* Trailer */}
        {anime.trailer_url && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Trailer</h3>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer_url.split('v=')[1]}`}
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
                    {membro.foto && (
                      <Image
                        src={membro.foto}
                        alt={membro.nome}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{membro.nome}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{membro.funcao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personagens com Seletor de Dublagem */}
        {personagens.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold orbe-text-secondary">Personagens</h3>
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setSelectedDubbing('jp')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedDubbing === 'jp'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted/80'
                  }`}
                >
                  JP
                </button>
                <button
                  onClick={() => setSelectedDubbing('pt-br')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedDubbing === 'pt-br'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted/80'
                  }`}
                >
                  PT-BR
                </button>
              </div>
            </div>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {personagens.map((personagem) => (
                <div key={personagem.id} className="flex-shrink-0 text-center w-24">
                  <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                    {personagem.imagem && (
                      <Image
                        src={personagem.imagem}
                        alt={personagem.nome}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{personagem.nome}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {selectedDubbing === 'jp' ? personagem.dublador_jp : personagem.dublador_pt_br}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderJogoContent = (jogo: Jogo) => {
    const isAvailableToBuy = jogo.lojas_digitais && jogo.lojas_digitais.length > 0;
    return (
      <div className="space-y-6">
        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isAvailableToBuy ? (
            <a
              href={jogo.lojas_digitais[0].url} // Link para a primeira loja
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              Comprar Jogo
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-gray-300 cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5" />
              Indisponível
            </button>
          )}

          {jogo.trailer_url && (
            <a
              href={jogo.trailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              <Play className="h-5 w-5" />
              Assistir Trailer
            </a>
          )}

          <button
            onClick={() => openCalendarModal({ midia, type: 'jogo' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            Adicionar ao Calendário
          </button>
        </div>

        {/* Sinopse */}
        {jogo.sinopse && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Sinopse</h3>
            <p className="text-muted-foreground leading-relaxed">{jogo.sinopse}</p>
          </div>
        )}

        {/* Lojas Digitais */}
        {jogo.lojas_digitais && jogo.lojas_digitais.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold orbe-text-secondary mb-2">Onde Comprar</h3>
            <div className="flex flex-wrap gap-3">
              {jogo.lojas_digitais.map((loja) => (
                <a
                  key={loja.nome}
                  href={loja.url}
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

  if (!isSuperModalOpen || !midia || !type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto" onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow-xl max-w-4xl mx-auto super-modal-content">
          {/* Header */}
          <div className="relative p-6 pb-0">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {isAuthenticated && (
                <button className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
                  <Edit className="h-5 w-5 text-primary" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <X className="h-5 w-5 text-primary" />
              </button>
            </div>

            {/* Poster e Informações Principais */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-72 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={midia.poster_curado || midia.poster_url_api || '/placeholder-poster.jpg'}
                    alt={midia.titulo_curado || midia.titulo_api}
                    width={192}
                    height={288}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">
                    {midia.titulo_curado || midia.titulo_api}
                  </h1>
                  {midia.titulo_api && midia.titulo_api !== midia.titulo_curado && (
                    <p className="text-lg text-muted-foreground">{midia.titulo_api}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {midia.data_lancamento_curada || midia.data_lancamento_api ? format(parseISO(midia.data_lancamento_curada || midia.data_lancamento_api), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                  </div>
                  {midia.avaliacao && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {midia.avaliacao}
                    </div>
                  )}
                  {midia.duracao && type === 'filme' && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {midia.duracao}
                    </div>
                  )}
                  {midia.numero_temporadas && type === 'serie' && (
                    <div className="flex items-center gap-1">
                      <Tv className="h-4 w-4" />
                      {midia.numero_temporadas} Temporada{midia.numero_temporadas > 1 ? 's' : ''}
                    </div>
                  )}
                  {midia.numero_episodios && type === 'anime' && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {midia.numero_episodios} Episódios
                    </div>
                  )}
                  {midia.plataformas_curadas && midia.plataformas_curadas.length > 0 && type === 'jogo' && (
                    <div className="flex items-center gap-1">
                      <Gamepad2 className="h-4 w-4" />
                      {midia.plataformas_curadas.map(p => p.nome).join(', ')}
                    </div>
                  )}
                </div>

                {/* Gêneros */}
                {midia.generos && midia.generos.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm">
                    {midia.generos.map((genero, index) => (
                      <span key={index} className="bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {genero}
                      </span>
                    ))}
                  </div>
                )}

                {/* Prêmios */}
                {midia.premiacoes && midia.premiacoes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Prêmios:</span>
                    <div className="flex gap-1 flex-wrap">
                      {midia.premiacoes.map((award, index) => (
                        <AwardIcon
                          key={index}
                          award={award.nome}
                          status={award.status}
                          year={award.ano}
                          className="h-4 w-4"
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Botões de Ação Rápida do Usuário */}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button
                      onClick={() => handleInteraction('favorited')}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                        userInteraction.favorited
                          ? 'bg-red-500 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      Favoritar
                    </button>
                    <button
                      onClick={() => handleInteraction('wantToWatch')}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                        userInteraction.wantToWatch
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                      Quero Assistir
                    </button>
                    <button
                      onClick={() => handleInteraction('watched')}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                        userInteraction.watched
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      Já Assisti
                    </button>
                    <button
                      onClick={() => handleInteraction('notInterested')}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                        userInteraction.notInterested
                          ? 'bg-gray-500 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <EyeOff className="h-4 w-4" />
                      Não me Interessa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Abas de Conteúdo */}
          <Tabs defaultValue="geral" className="w-full p-6 pt-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="elenco">Elenco/Staff</TabsTrigger>
              <TabsTrigger value="comentarios">Comentários</TabsTrigger>
              <TabsTrigger value="extras">Extras</TabsTrigger>
            </TabsList>
            <TabsContent value="geral" className="mt-4">
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Carregando detalhes adicionais...</p>
                </div>
              ) : (
                <>
                  {type === 'filme' && midia && renderFilmeContent(midia as Filme)}
                  {type === 'serie' && midia && renderSerieContent(midia as Serie)}
                  {type === 'anime' && midia && renderAnimeContent(midia as Anime)}
                  {type === 'jogo' && midia && renderJogoContent(midia as Jogo)}
                </>
              )}
            </TabsContent>
            <TabsContent value="elenco" className="mt-4">
              {/* Conteúdo de Elenco/Staff/Personagens */}
              {type === 'filme' || type === 'serie' ? (
                elenco.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Elenco Principal</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {elenco.map((ator) => (
                        <div key={ator.id} className="text-center">
                          <div className="w-24 h-24 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                            {ator.foto && (
                              <Image
                                src={ator.foto}
                                alt={ator.nome}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">{ator.nome}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{ator.personagem}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma informação de elenco disponível.</p>
                )
              ) : type === 'anime' ? (
                <div className="space-y-6">
                  {staff.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Equipe de Produção</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {staff.map((membro) => (
                          <div key={membro.id} className="text-center">
                            <div className="w-24 h-24 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                              {membro.foto && (
                                <Image
                                  src={membro.foto}
                                  alt={membro.nome}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground line-clamp-1">{membro.nome}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{membro.funcao}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {personagens.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3 mt-6">
                        <h3 className="text-lg font-semibold orbe-text-secondary">Personagens</h3>
                        <div className="flex bg-muted rounded-lg p-1">
                          <button
                            onClick={() => setSelectedDubbing('jp')}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              selectedDubbing === 'jp'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-muted/80'
                            }`}
                          >
                            JP
                          </button>
                          <button
                            onClick={() => setSelectedDubbing('pt-br')}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              selectedDubbing === 'pt-br'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-muted/80'
                            }`}
                          >
                            PT-BR
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {personagens.map((personagem) => (
                          <div key={personagem.id} className="text-center">
                            <div className="w-24 h-24 bg-muted rounded-full mb-2 overflow-hidden mx-auto">
                              {personagem.imagem && (
                                <Image
                                  src={personagem.imagem}
                                  alt={personagem.nome}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground line-clamp-1">{personagem.nome}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {selectedDubbing === 'jp' ? personagem.dublador_jp : personagem.dublador_pt_br}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!staff.length && !personagens.length && (
                    <p className="text-muted-foreground">Nenhuma informação de equipe ou personagens disponível.</p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Informações de elenco/staff não aplicáveis ou disponíveis para este tipo de mídia.</p>
              )}
            </TabsContent>
            <TabsContent value="comentarios" className="mt-4">
              <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Comentários</h3>
              {isAuthenticated ? (
                <div className="mb-6">
                  <Textarea
                    placeholder="Escreva seu comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={handlePostComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" /> Enviar Comentário
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">Faça login para deixar um comentário.</p>
              )}
              
              {comentarios.length > 0 ? (
                <div className="space-y-4">
                  {comentarios.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-muted rounded-lg">
                      <Image
                        src={comment.avatar || '/placeholder-avatar.jpg'}
                        alt={comment.username}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{comment.username}</p>
                        <p className="text-sm text-muted-foreground">{format(parseISO(comment.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                        <p className="mt-2 text-foreground leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              )}
            </TabsContent>
            <TabsContent value="extras" className="mt-4">
              <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Extras</h3>
              <p className="text-muted-foreground">Conteúdo extra como curiosidades, erros de gravação, entrevistas, etc. (Ainda não implementado)</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <CalendarModal
        isOpen={isCalendarModalOpen}
        midia={superModalData.midia}
        type={superModalData.type}
        onClose={closeCalendarModal}
        onAddEvent={handleCalendarAction}
      />
    </div>
  );
};

export default SuperModal;


