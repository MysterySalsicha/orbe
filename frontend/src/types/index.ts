// Tipos base para o Orbe Nerd

export interface Genre {
  id: number;
  name: string;
}

export interface Award {
  id: number;
  nome: string;
  categoria: string;
  ano: number;
  status: 'vencedor' | 'indicado';
}

export interface CastMember {
  id: number;
  nome: string;
  personagem: string;
  foto_url?: string;
}

export interface StaffMember {
  id: number;
  nome: string;
  cargo: string;
  foto_url?: string;
}

export interface Character {
  id: number;
  nome: string;
  foto_url?: string;
  dubladores: {
    jp?: {
      nome: string;
      foto_url?: string;
    };
    pt_br?: {
      nome: string;
      foto_url?: string;
    };
  };
}

export interface GamePlatform {
  id: number;
  nome: string;
  logo_url?: string;
  store_url?: string;
}

export interface Plataforma {
  nome: string;
}

// Interface base para mídia
export interface Midia {
  id: number;
  titulo_curado: string;
  titulo_api: string;
  poster_curado?: string;
  poster_url_api: string;
  data_lancamento_curada?: string;
  data_lancamento_api: string;
  sinopse_curada?: string;
  sinopse_api: string;
  plataformas_curadas?: Plataforma[];
  plataformas_api: Plataforma[];
  generos_curados?: Genre[];
  generos_api: Genre[];
  premiacoes?: Award[];
  trailer_url_curado?: string;
  trailer_url_api?: string;
  avaliacao?: number; // Propriedade adicionada
}

// Interfaces específicas por tipo de mídia
export interface Filme extends Midia {
  duracao: number;
  diretor: string;
  escritor: string;
  elenco: CastMember[];
  ingresso_link?: string;
  em_prevenda: boolean;
  em_cartaz?: boolean; // Propriedade adicionada
  ultima_verificacao_ingresso?: string;
}

export interface Serie extends Midia {
  numero_temporadas: number;
  numero_episodios: number;
  criadores: string[];
  elenco: CastMember[];
}

export interface Anime extends Midia {
  fonte: string;
  estudio: string;
  dublagem_info: boolean;
  staff: StaffMember[];
  personagens: Character[];
  proximo_episodio?: string;
  numero_episodio_atual?: number;
  eventos_recorrentes_calendario?: boolean;
}

export interface Jogo extends Midia {
  desenvolvedores: string[];
  publicadoras: string[];
  plataformas_jogo: GamePlatform[];
  evento_anuncio_id?: number;
}

export interface Preferencias {
  tema: 'light' | 'dark' | 'system';
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  idioma: string;
}

// Tipos de mídia
export type TipoMidia = 'filme' | 'serie' | 'anime' | 'jogo';

// Interface para usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  avatar: string | null;
  role: 'user' | 'admin';
  quer_avaliar: boolean;
  data_criacao: string;
  preferencias?: Preferencias;
}

// Interface para interações do usuário
export interface UserInteraction {
  id: number;
  usuario_id: number;
  midia_id: number;
  tipo_midia: TipoMidia;
  status: 'favorito' | 'quero_assistir' | 'acompanhando' | 'assistido' | 'oculto';
  avaliacao?: 'gostei' | 'amei' | 'nao_gostei';
  data_interacao: string;
}

// Interface para comentários
export interface Comentario {
  id: number;
  usuario: {
    id: number;
    nome: string;
    avatar_url?: string;
  };
  texto: string;
  data_criacao: string;
  respostas?: Comentario[];
}

// Interface para notificações
export interface Notification {
  id: number;
  usuario_id?: number;
  midia_id?: number;
  tipo_midia?: TipoMidia;
  titulo: string;
  tipo_notificacao: 
    | 'NOVO_ITEM' 
    | 'ATUALIZACAO_DATA' 
    | 'DUBLAGEM' 
    | 'INDICADOS_PREMIO' 
    | 'VENCEDOR_PREMIO' 
    | 'FALHA_LINK_INGRESSO' 
    | 'LANCAMENTO_FAVORITO';
  foi_visualizada: boolean;
  data_criacao: string;
  importante?: boolean;
}

// Interface para eventos de anúncio
export interface EventoAnuncio {
  id: number;
  nome: string;
  data_evento: string;
}

// Props para componentes
export interface MidiaCardProps {
  midia: Filme | Serie | Anime | Jogo;
  type: TipoMidia;
  showCountdown?: boolean;
  userInteractions?: UserInteraction[];
  onInteraction?: (action: string, midia: Filme | Serie | Anime | Jogo) => void;
  onClick?: () => void;
}

export interface HeaderProps {
  currentPage?: string;
  user?: User | null;
  notificationCount?: number;
  onSearch?: (query: string) => void;
  onThemeToggle?: () => void;
}

export interface CarouselProps {
  title: string;
  items: (Filme | Serie | Anime | Jogo)[];
  type: TipoMidia;
  showNavigation?: boolean;
  onTitleClick?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export interface DetailsModalProps {
  midia: Filme | Serie | Anime | Jogo;
  type: TipoMidia;
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  isAdmin?: boolean;
}

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  popularSearches?: string[];
}

export interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onNotificationClick: (notification: Notification) => void;
}

// Tipos para filtros
export interface FilterOptions {
  generos?: number[];
  plataformas?: string[];
  ano?: number;
  status?: string;
  tags?: string[];
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para busca
export interface SearchResult {
  filmes: Filme[];
  series: Serie[];
  animes: Anime[];
  jogos: Jogo[];
  total: number;
}

export type SearchResultItem = (Filme & { type: 'filme' }) | (Serie & { type: 'serie' }) | (Anime & { type: 'anime' }) | (Jogo & { type: 'jogo' });

// Tipos para tema
export type Theme = 'light' | 'dark' | 'system';

// Tipos para calendário
export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  recurring?: boolean;
  recurrenceRule?: string;
}

// Tipos para avaliação
export interface AvaliacaoModal {
  midia: Filme | Serie | Anime | Jogo;
  tipo: TipoMidia;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (avaliacao: 'gostei' | 'amei' | 'nao_gostei', analise?: string) => void;
}

// Tipos para estado global
export interface AppState {
  user: User | null;
  theme: Theme;
  notifications: Notification[];
  unreadCount: number;
  isSearchOpen: boolean;
  currentModal: string | null;
}

// Tipos para ações do usuário
export type UserAction = 
  | 'favoritar'
  | 'quero_assistir'
  | 'acompanhando'
  | 'ja_assisti'
  | 'ja_joguei'
  | 'nao_me_interessa';

// Tipos para status de carregamento
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Tipos para configurações de carrossel
export interface CarouselConfig {
  itemsPerView: number;
  spaceBetween: number;
  breakpoints: {
    [key: number]: {
      itemsPerView: number;
      spaceBetween: number;
    };
  };
}

