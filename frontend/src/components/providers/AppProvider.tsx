'use client';
import React, { useEffect } from 'react';
import SearchOverlay from '@/components/modals/SearchOverlay';
import NotificationModal from '@/components/modals/NotificationModal';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/hooks/useTheme';
import { realApi } from '@/data/realApi';
import orbeNerdApi from '@/lib/api';
import Header from '@/components/layout/Header';
import type { Notification } from '@/types';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { 
    unreadCount,
    setNotifications,
    addNotification,
    setUser,
    setInteractions,
    isAuthenticated,
    user
  } = useAppStore();
  
  const { toggleTheme } = useTheme();

  // Conexão com WebSocket para notificações em tempo real
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    let ws: WebSocket;
    let reconnectInterval: NodeJS.Timeout;

    function connect() {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Conectado ao servidor WebSocket.');
        // Limpar o intervalo de reconexão se a conexão for bem-sucedida
        if (reconnectInterval) {
          clearInterval(reconnectInterval);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Mensagem recebida do WebSocket:', message);

          // Assumindo que a mensagem tem um formato { type: 'NEW_ITEM', ... } ou similar
          // e que o payload pode ser mapeado para uma notificação
          if (message.type === 'NEW_ITEM' || message.type === 'UPDATED_ITEM') {
            // Criar um objeto de notificação a partir da mensagem
            const newNotification: Notification = {
              id: message.data.id, // Usar um ID único vindo do backend
              titulo: `Novo item adicionado: ${message.data.title || message.data.name}`,
              tipo_midia: message.mediaType,
              midia_id: message.data.id,
              foi_visualizada: false,
              createdAt: new Date().toISOString(),
              type: message.type,
              message: ''
            };
            addNotification(newNotification);
          }
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error);
        }
      };

      ws.onclose = () => {
        console.log('Desconectado do servidor WebSocket. Tentando reconectar...');
        // Tentar reconectar a cada 5 segundos
        reconnectInterval = setInterval(() => {
          if (!ws || ws.readyState === WebSocket.CLOSED) {
            connect();
          }
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        ws.close(); // Fecha a conexão para acionar o 'onclose' e a lógica de reconexão
      };
    }

    connect();

    // Limpeza ao desmontar o componente
    return () => {
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [addNotification]);

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

          const interactions = await realApi.getInteractions();
          setInteractions(interactions);
        }
      } catch (error) {
        console.error('Erro ao inicializar app:', error);
      }
    };

    initializeApp();
  }, [setUser, setNotifications, setInteractions]);

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
      <SearchOverlay />
      <NotificationModal />
    </>
  );
}
