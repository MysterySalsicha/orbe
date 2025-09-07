'use client';

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import SearchOverlay from '@/components/modals/SearchOverlay';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/hooks/useTheme';
import { mockApi, mockUser, mockNotifications } from '@/data/mockData';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { 
    isSearchOpen, 
    closeSearch, 
    unreadCount,
    setNotifications,
    setUser,
    isAuthenticated 
  } = useAppStore();
  
  const { toggleTheme } = useTheme();

  // Simula carregamento inicial de dados do usuário
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simula verificação de autenticação
        // Em produção, isso seria uma chamada para verificar o token JWT
        const isLoggedIn = localStorage.getItem('orbe-nerd-auth') === 'true';
        
        if (isLoggedIn) {
          setUser(mockUser);
          
          // Carrega notificações do usuário
          const notifications = await mockApi.getNotifications();
          setNotifications(notifications);
        }
      } catch (error) {
        console.error('Erro ao inicializar app:', error);
      }
    };

    initializeApp();
  }, [setUser, setNotifications]);

  const handleSearch = (query: string) => {
    console.log('Pesquisando por:', query);
  };

  return (
    <>
      {/* Header Global */}
      <Header
        user={isAuthenticated ? mockUser : null}
        notificationCount={unreadCount}
        onSearch={handleSearch}
        onThemeToggle={toggleTheme}
      />

      {/* Conteúdo Principal */}
      {children}

      {/* Modais Globais */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onSearch={handleSearch}
      />
    </>
  );
};

export default AppProvider;

