import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Notification, Theme, Filme, Serie, Anime, Jogo } from '@/types';

interface AppState {
  // Estado do usuário
  user: User | null;
  isAuthenticated: boolean;
  
  // Estado do tema
  theme: Theme;
  
  // Estado das notificações
  notifications: Notification[];
  unreadCount: number;
  
  // Estado dos modais
  isSearchOpen: boolean;
  isNotificationModalOpen: boolean;
  isSuperModalOpen: boolean;
  superModalData: {
    midia: Filme | Serie | Anime | Jogo | null;
    type: 'filme' | 'serie' | 'anime' | 'jogo' | null;
  };
  isRatingModalOpen: boolean;
  ratingModalData: {
    midia: Filme | Serie | Anime | Jogo | null;
    type: 'filme' | 'serie' | 'anime' | 'jogo' | null;
    action: 'ja_assisti' | 'ja_joguei' | null;
  };
  isCalendarModalOpen: boolean;
  calendarModalData: {
    midia: Filme | Serie | Anime | Jogo | null;
    type: 'filme' | 'serie' | 'anime' | 'jogo' | null;
  };
  currentDetailModal: {
    isOpen: boolean;
    midia: Filme | Serie | Anime | Jogo | null;
    type: string;
  } | null;
  
  // Estado de carregamento
  isLoading: boolean;
  
  // Ações do usuário
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  
  // Ações do tema
  setTheme: (theme: Theme) => void;
  
  // Ações das notificações
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  
  // Ações dos modais
  openSearch: () => void;
  closeSearch: () => void;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
  openSuperModal: (midia: Filme | Serie | Anime | Jogo, type: 'filme' | 'serie' | 'anime' | 'jogo') => void;
  closeSuperModal: () => void;
  openRatingModal: (midia: Filme | Serie | Anime | Jogo, type: 'filme' | 'serie' | 'anime' | 'jogo', action: 'ja_assisti' | 'ja_joguei') => void;
  closeRatingModal: () => void;
  openCalendarModal: (data: { midia: Filme | Serie | Anime | Jogo | null; type: 'filme' | 'serie' | 'anime' | 'jogo' | null; }) => void;
  closeCalendarModal: () => void;
  openDetailModal: (midia: Filme | Serie | Anime | Jogo, type: string) => void;
  closeDetailModal: () => void;
  
  // Ações de carregamento
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      theme: 'system',
      notifications: [],
      unreadCount: 0,
      isSearchOpen: false,
      isNotificationModalOpen: false,
      isSuperModalOpen: false,
      superModalData: {
        midia: null,
        type: null
      },
      isRatingModalOpen: false,
      ratingModalData: {
        midia: null,
        type: null,
        action: null
      },
      isCalendarModalOpen: false,
      calendarModalData: {
        midia: null,
        type: null
      },
      currentDetailModal: null,
      isLoading: false,

      // Ações do usuário
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        notifications: [],
        unreadCount: 0
      }),

      // Ações do tema
      setTheme: (theme) => set({ theme }),

      // Ações das notificações
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.lida).length;
        set({ notifications, unreadCount });
      },
      
      addNotification: (notification) => {
        const { notifications } = get();
        const newNotifications = [notification, ...notifications];
        const unreadCount = newNotifications.filter(n => !n.lida).length;
        set({ 
          notifications: newNotifications, 
          unreadCount 
        });
      },
      
      markNotificationAsRead: (id) => {
        const { notifications } = get();
        const updatedNotifications = notifications.map(n => 
          n.id === id ? { ...n, lida: true } : n
        );
        const unreadCount = updatedNotifications.filter(n => !n.lida).length;
        set({ 
          notifications: updatedNotifications, 
          unreadCount 
        });
      },
      
      markAllNotificationsAsRead: () => {
        const { notifications } = get();
        const updatedNotifications = notifications.map(n => ({ 
          ...n, 
          lida: true
        }));
        set({ 
          notifications: updatedNotifications, 
          unreadCount: 0 
        });
      },

      // Ações dos modais
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
      
      openNotificationModal: () => set({ isNotificationModalOpen: true }),
      closeNotificationModal: () => set({ isNotificationModalOpen: false }),
      
      openSuperModal: (midia: Filme | Serie | Anime | Jogo, type: 'filme' | 'serie' | 'anime' | 'jogo') => {
        set({ 
          isSuperModalOpen: true,
          superModalData: { midia, type }
        });
      },

      closeSuperModal: () => {
        set({ 
          isSuperModalOpen: false,
          superModalData: { midia: null, type: null }
        });
      },

      openRatingModal: (midia: Filme | Serie | Anime | Jogo, type: 'filme' | 'serie' | 'anime' | 'jogo', action: 'ja_assisti' | 'ja_joguei') => {
        set({ 
          isRatingModalOpen: true,
          ratingModalData: { midia, type, action }
        });
      },

      closeRatingModal: () => {
        set({ 
          isRatingModalOpen: false,
          ratingModalData: { midia: null, type: null, action: null }
        });
      },

      openCalendarModal: (data) => {
        set({ 
          isCalendarModalOpen: true,
          calendarModalData: data
        });
      },
      closeCalendarModal: () => {
        set({ 
          isCalendarModalOpen: false,
          calendarModalData: { midia: null, type: null }
        });
      },
      
      openDetailModal: (midia, type) => set({ 
        currentDetailModal: { isOpen: true, midia, type } 
      }),
      closeDetailModal: () => set({ 
        currentDetailModal: null 
      }),

      // Ações de carregamento
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'orbe-nerd-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);

