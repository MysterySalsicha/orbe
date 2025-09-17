'use client';

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import SearchOverlay from '@/components/modals/SearchOverlay';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/hooks/useTheme';
import { realApi } from '@/data/realApi'; // Use realApi

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { 
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
          // setUser(mockUser); // Removed mockUser
          // For now, set a dummy user if authenticated, or fetch from real API
          setUser({
            id: 1,
            nome: "Usuário Teste",
            email: "teste@example.com",
            avatar: null,
            role: "user",
            quer_avaliar: true,
            data_criacao: new Date().toISOString(),
          });
          
          // Carrega notificações do usuário
          const notifications = await realApi.getNotifications(); // Use realApi
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
        user={isAuthenticated ? {
          id: 1,
          nome: "Usuário Teste",
          email: "teste@example.com",
          avatar: null,
          role: "user",
          quer_avaliar: true,
          data_criacao: new Date().toISOString(),
        } : null} // Removed mockUser
        notificationCount={unreadCount}
        onSearch={handleSearch}
        onThemeToggle={toggleTheme}
      />

      {/* Conteúdo Principal */}
      {children}

      {/* Modais Globais */}
      <SearchOverlay />
    </>
  );
};

export default AppProvider;
