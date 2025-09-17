'use client';

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import SearchOverlay from '@/components/modals/SearchOverlay';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/hooks/useTheme';
import { realApi } from '@/data/realApi';
import orbeNerdApi from '@/lib/api';

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
    isAuthenticated,
    user
  } = useAppStore();
  
  const { toggleTheme } = useTheme();

  // Carregamento inicial de dados do usuário
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const userData = await orbeNerdApi.getCurrentUser();
          setUser(userData);
          
          const notifications = await realApi.getNotifications();
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
        user={isAuthenticated ? user : null}
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

