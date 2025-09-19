'use client';

import { useState, useEffect } from 'react';
import { Star, Check, Heart, Bookmark, EyeOff, Trophy, Award, ShoppingCart, MoreVertical } from 'lucide-react';import PlatformIcon from '@/components/ui/PlatformIcons';
import { format, parseISO, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import Image from 'next/image';
import { ptBR } from 'date-fns/locale';
import { useAppStore } from '@/stores/appStore';
import type { MidiaCardProps, UserAction, Anime } from '@/types';

const MidiaCard: React.FC<MidiaCardProps> = ({
  midia,
  type,
  userInteractions = [],
  onInteraction
}) => {
  const { openSuperModal, openRatingModal } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [hasNewEpisode, setHasNewEpisode] = useState(false);

  // Verifica se é um anime com próximo episódio
  const isAnime = type === 'anime' && 'proximo_episodio' in midia;
  const isFilme = type === 'filme' && 'em_prevenda' in midia;

  const proximoEpisodio = isAnime ? (midia as Anime).proximo_episodio : undefined;

  // Calcula countdown em tempo real para animes
  useEffect(() => {
    if (!isAnime || !proximoEpisodio) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextEpisode = parseISO(proximoEpisodio!);
      
      if (nextEpisode > now) {
        const days = differenceInDays(nextEpisode, now);
        const hours = differenceInHours(nextEpisode, now) % 24;
        const minutes = differenceInMinutes(nextEpisode, now) % 60;
        
        if (days > 0) {
          setCountdown(`${days}d, ${hours}h e ${minutes}m`);
        } else if (hours > 0) {
          setCountdown(`${hours}h e ${minutes}m`);
        } else {
          setCountdown(`${minutes}m`);
        }
      } else {
        setCountdown('Disponível agora!');
        setHasNewEpisode(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, [isAnime, proximoEpisodio]);

  // Verifica interações do usuário
  const userInteraction = userInteractions.find(
    interaction => interaction.midia_id === midia.id && interaction.tipo_midia === type
  );

  // Formata data de lançamento
  const formatReleaseDate = () => {
    const date = midia.data_lancamento_curada || midia.data_lancamento_api;
    if (!date) return 'Data não informada';
    
    try {
      return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  // Verifica se a data de lançamento já passou (para validar "Já Assisti/Joguei")
  const hasReleased = () => {
    const date = midia.data_lancamento_curada || midia.data_lancamento_api;
    if (!date) return false;
    
    try {
      const releaseDate = parseISO(date);
      return releaseDate <= new Date();
    } catch {
      return false;
    }
  };

  // Ações do menu
  const menuActions = [
    {
      icon: Heart,
      label: 'Favoritar',
      action: 'favoritar' as UserAction,
      active: userInteraction?.status === 'favorito'
    },
    {
      icon: Bookmark,
      label: 'Quero Assistir',
      action: 'quero_assistir' as UserAction,
      active: userInteraction?.status === 'quero_assistir'
    },
    ...(type === 'anime' || type === 'serie' ? [{
      icon: Star,
      label: 'Acompanhando',
      action: 'acompanhando' as UserAction,
      active: userInteraction?.status === 'acompanhando'
    }] : []),
    {
      icon: Check,
      label: type === 'jogo' ? 'Já Joguei' : 'Já Assisti',
      action: (type === 'jogo' ? 'ja_joguei' : 'ja_assisti') as UserAction,
      active: userInteraction?.status === 'assistido',
      disabled: !hasReleased() // Desabilita se ainda não foi lançado
    },
    {
      icon: EyeOff,
      label: 'Não me Interessa',
      action: 'nao_me_interessa' as UserAction,
      active: userInteraction?.status === 'oculto'
    }
  ];

  const handleCardClick = () => {
    console.log(`MidiaCard clicked: ID=${midia.id}, Title="${midia.titulo_curado || midia.titulo_api}"`);
    // Remove ícone de "Novo" quando clica no card
    if (hasNewEpisode && userInteraction?.status === 'acompanhando') {
      setHasNewEpisode(false);
    }
    
    openSuperModal(midia, type);
    setIsMenuOpen(false);
  };

  const handleMenuAction = (action: UserAction, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Validação especial para "Já Assisti/Joguei"
    if ((action === 'ja_assisti' || action === 'ja_joguei') && !hasReleased()) {
      return; // Não faz nada se ainda não foi lançado
    }
    
    // Se for "Já Assisti/Joguei", abre o modal de avaliação
    if (action === 'ja_assisti' || action === 'ja_joguei') {
      openRatingModal(midia, type, action);
    } else {
      onInteraction?.(action, midia);
    }
    
    setIsMenuOpen(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para lidar com clique longo (mobile)
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handlePressStart = () => {
    const timer = setTimeout(() => {
      setIsMenuOpen(true);
    }, 500); // 500ms para ativar o menu
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  // Determina o número do episódio atual para animes
  const getEpisodeInfo = () => {
    if (!isAnime) return null;
    
    // Se a data de lançamento já passou, mostra episódio atual
    if (hasReleased()) {
      return midia.numero_episodio_atual;
    }
    
    return null;
  };

  return (
    <div className="relative group">
      {/* Card Principal */}
      <div 
        className="relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 w-[200px]"
        data-clickable-card
        onClick={handleCardClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {/* Container da Imagem */}
        <div className="relative w-[200px] h-[300px] overflow-hidden">
          <Image
            src={midia.poster_curado || midia.poster_url_api}
            alt={midia.titulo_curado || midia.titulo_api}
            width={200}
            height={300}
            loading="lazy"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105 w-full h-full"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Ícones Sobrepostos */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {/* Ícones de Prêmios */}
            {midia.premiacoes?.map((award, index) => (
              <div key={index} className="relative">
                {award.status === 'vencedor' ? (
                  <div className="bg-yellow-500 text-white p-1 rounded-full shadow-lg" title={`Vencedor ${award.nome} ${award.ano}`}>
                    <Trophy className="h-3 w-3" />
                  </div>
                ) : (
                  <div className="bg-gray-400 text-white p-1 rounded-full shadow-lg" title={`Indicado ${award.nome} ${award.ano}`}>
                    <Award className="h-3 w-3" />
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 bg-black text-white text-xs px-1 rounded">
                  {award.ano}
                </span>
              </div>
            ))}

            {/* Ícone de Novo Episódio */}
            {hasNewEpisode && userInteraction?.status === 'acompanhando' && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                NOVO
              </div>
            )}
          </div>

          {/* Ícone de Pré-venda (abaixo do pôster) */}
          {isFilme && midia.em_prevenda && (
            <div className="absolute bottom-2 left-2">
              <div className="bg-green-500 text-white p-2 rounded-full shadow-lg" title="Em pré-venda">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
          )}

          {/* Menu de Ações (3 pontinhos) */}
          <div className="absolute top-2 right-2">
            <button
              onClick={handleMenuToggle}
              className="bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg py-1 z-50">
                {menuActions.map((menuAction) => {
                  const IconComponent = menuAction.icon;
                  const isDisabled = menuAction.disabled;
                  
                  return (
                    <button
                      key={menuAction.action}
                      onClick={(e) => !isDisabled && handleMenuAction(menuAction.action, e)}
                      disabled={isDisabled}
                      className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${
                        isDisabled 
                          ? 'text-muted-foreground cursor-not-allowed opacity-50' 
                          : 'hover:bg-muted'
                      } ${
                        menuAction.active ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {menuAction.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Informações do Card */}
        <div className="p-3 space-y-2">
          {/* Título */}
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight text-center">
            <span className="font-bold">Nome:</span> {midia.titulo_curado || midia.titulo_api}
          </h3>

          {/* Data/Episódio com lógica especial para animes */}
          <div className="text-xs text-muted-foreground text-center">
            {isAnime && hasReleased() ? (
              <div>
                <span className="font-bold">Episódio {getEpisodeInfo()}:</span>
                {countdown && (
                  <div className="text-primary font-medium mt-1 animate-pulse">
                    {countdown}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span className="font-bold">Lançamento:</span> {formatReleaseDate()}
              </div>
            )}
          </div>

          {/* Plataformas */}
          {(midia.plataformas_curadas || midia.plataformas_api)?.length > 0 && (
            <div className="text-xs text-muted-foreground text-center">
              <div className="font-bold mb-1">Plataformas:</div>
              <div className="flex items-center justify-center flex-wrap gap-1">
                {(midia.plataformas_curadas || midia.plataformas_api)?.slice(0, 3).map((platform, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-muted px-2 py-1 rounded">
                    <PlatformIcon 
                      platform={platform.nome} 
                      className="h-3 w-3" 
                      size={12}
                    />
                    <span className="text-xs">{platform.nome}</span>
                  </div>
                ))}
                {(midia.plataformas_curadas || midia.plataformas_api)?.length > 3 && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    +{(midia.plataformas_curadas || midia.plataformas_api)?.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Indicador de Status do Usuário */}
          {userInteraction && (
            <div className="flex items-center justify-center space-x-1 text-xs">
              {userInteraction.status === 'favorito' && (
                <div className="flex items-center text-red-500">
                  <Heart className="h-3 w-3 mr-1 fill-current" />
                  <span>Favorito</span>
                </div>
              )}
              {userInteraction.status === 'quero_assistir' && (
                <div className="flex items-center text-blue-500">
                  <Bookmark className="h-3 w-3 mr-1 fill-current" />
                  <span>Quero Assistir</span>
                </div>
              )}
              {userInteraction.status === 'acompanhando' && (
                <div className="flex items-center text-yellow-500">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  <span>Acompanhando</span>
                </div>
              )}
              {userInteraction.status === 'assistido' && (
                <div className="flex items-center text-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  <span>{type === 'jogo' ? 'Jogado' : 'Assistido'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay para fechar menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MidiaCard;