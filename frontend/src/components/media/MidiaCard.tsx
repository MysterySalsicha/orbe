'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  MoreVertical, 
  Heart, 
  Bookmark, 
  Star, 
  Check, 
  EyeOff,
  Trophy,
  Calendar,
  Play,
  ShoppingCart
} from 'lucide-react';
import PlatformIcon from '@/components/ui/PlatformIcons';
import AwardIcon from '@/components/ui/AwardIcons';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppStore } from '@/stores/appStore';
import type { MidiaCardProps, UserAction } from '@/types';

const MidiaCard: React.FC<MidiaCardProps> = ({
  midia,
  type,
  showCountdown = false,
  userInteractions = [],
  onInteraction
}) => {
  const { openSuperModal } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [hasNewEpisode, setHasNewEpisode] = useState(false);

  // Verifica se é um anime com próximo episódio
  const isAnime = type === 'anime' && 'proximo_episodio' in midia;
  const isFilme = type === 'filme' && 'em_prevenda' in midia;

  // Calcula countdown para animes
  useEffect(() => {
    if (!isAnime || !midia.proximo_episodio) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextEpisode = parseISO(midia.proximo_episodio!);
      
      if (nextEpisode > now) {
        const distance = formatDistanceToNow(nextEpisode, { 
          locale: ptBR,
          addSuffix: false 
        });
        setCountdown(distance);
      } else {
        setCountdown('Disponível agora!');
        setHasNewEpisode(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, [isAnime, midia.proximo_episodio]);

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

  // Verifica se tem prêmios
  const hasAwards = midia.premiacoes && midia.premiacoes.length > 0;
  const hasWonAward = midia.premiacoes?.some(award => award.status === 'vencedor');
  const hasNomination = midia.premiacoes?.some(award => award.status === 'indicado');

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
      active: userInteraction?.status === 'assistido'
    },
    {
      icon: EyeOff,
      label: 'Não me Interessa',
      action: 'nao_me_interessa' as UserAction,
      active: userInteraction?.status === 'oculto'
    }
  ];

  const handleCardClick = () => {
    openSuperModal(midia, type);
    setIsMenuOpen(false);
  };

  const handleMenuAction = (action: UserAction, e: React.MouseEvent) => {
    e.stopPropagation();
    onInteraction?.(action, midia);
    setIsMenuOpen(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative group">
      {/* Card Principal */}
      <div 
        className="relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover-scale w-[200px]"
        onClick={handleCardClick}
      >
        {/* Container da Imagem */}
        <div className="relative w-[200px] h-[300px] overflow-hidden">
          <Image
            src={midia.poster_curado || midia.poster_url_api}
            alt={midia.titulo_curado || midia.titulo_api}
            width={200}
            height={300}
            quality={70}
            loading="lazy"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Ícones Sobrepostos */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {/* Ícones de Prêmios */}
            {midia.premiacoes?.map((award, index) => (
              <AwardIcon
                key={index}
                award={award.nome}
                status={award.status}
                year={award.ano}
                className="h-3 w-3"
                size={12}
              />
            ))}

            {/* Ícone de Pré-venda */}
            {isFilme && midia.em_prevenda && (
              <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                <ShoppingCart className="h-3 w-3" />
              </div>
            )}

            {/* Ícone de Novo Episódio */}
            {hasNewEpisode && userInteraction?.status === 'acompanhando' && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                NOVO
              </div>
            )}
          </div>

          {/* Menu de Ações */}
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
                  return (
                    <button
                      key={menuAction.action}
                      onClick={(e) => handleMenuAction(menuAction.action, e)}
                      className={`flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors ${
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
        <div className="p-3 space-y-2 text-center">
          {/* Título */}
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
            {midia.titulo_curado || midia.titulo_api}
          </h3>

          {/* Data/Episódio */}
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">
              {isAnime && midia.numero_episodio_atual ? 'Episódio:' : 'Lançamento:'}
            </span>{' '}
            {isAnime && midia.numero_episodio_atual ? (
              <span>
                {midia.numero_episodio_atual}
                {showCountdown && countdown && (
                  <span className="block text-primary countdown-pulse">
                    {countdown}
                  </span>
                )}
              </span>
            ) : (
              formatReleaseDate()
            )}
          </div>

          {/* Plataformas */}
          {(midia.plataformas_curadas || midia.plataformas_api)?.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Plataformas:</span>{' '}
              <div className="flex items-center space-x-1 mt-1">
                {(midia.plataformas_curadas || midia.plataformas_api)?.slice(0, 3).map((platform, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <PlatformIcon 
                      platform={platform} 
                      className="h-3 w-3" 
                      size={12}
                    />
                    <span className="text-xs">{platform}</span>
                  </div>
                ))}
                {(midia.plataformas_curadas || midia.plataformas_api)?.length > 3 && (
                  <span className="text-xs">+{(midia.plataformas_curadas || midia.plataformas_api)?.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Indicador de Status do Usuário */}
          {userInteraction && (
            <div className="flex items-center space-x-1 text-xs">
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

