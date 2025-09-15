'use client';

import { useState, useEffect } from 'react';
import { X, Bell, Check, Trash2, Settings, Calendar, Star, Play } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { realApi } from '@/data/realApi';
import type { Notification } from '@/types';

const NotificationModal: React.FC = () => {
  const { isNotificationModalOpen, closeNotificationModal } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'todas' | 'nao_lidas' | 'importantes'>('todas');

  useEffect(() => {
    if (isNotificationModalOpen) {
      loadNotifications();
    }
  }, [isNotificationModalOpen]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await realApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, foi_visualizada: true } : notif
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, foi_visualizada: true }))
    );
  };

  const deleteNotification = async (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'lancamento':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'avaliacao':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'episodio':
        return <Play className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'nao_lidas':
        return !notif.foi_visualizada;
      case 'importantes':
        return notif.importante;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.foi_visualizada).length;

  if (!isNotificationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 orbe-text-primary" />
              <h2 className="text-lg font-semibold orbe-text-primary">
                Notificações
                {unreadCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={closeNotificationModal}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5 orbe-text-primary" />
            </button>
          </div>

          {/* Filtros e Ações */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filter === 'todas'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted orbe-text-primary hover:bg-muted/80'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('nao_lidas')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filter === 'nao_lidas'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted orbe-text-primary hover:bg-muted/80'
                }`}
              >
                Não Lidas
              </button>
              <button
                onClick={() => setFilter('importantes')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filter === 'importantes'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted orbe-text-primary hover:bg-muted/80'
                }`}
              >
                Importantes
              </button>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
                >
                  <Check className="h-3 w-3" />
                  Marcar todas como lidas
                </button>
              )}
              <button className="flex items-center gap-2 px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">
                <Settings className="h-3 w-3" />
                Configurações
              </button>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner h-6 w-6"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors ${
                      !notification.foi_visualizada ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.tipo)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-sm font-medium ${
                            !notification.foi_visualizada ? 'orbe-text-primary' : 'text-muted-foreground'
                          }`}>
                            {notification.titulo}
                          </h3>
                          
                          <div className="flex items-center gap-1">
                            {!notification.foi_visualizada && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                                title="Marcar como lida"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-muted rounded transition-colors text-red-500"
                              title="Excluir"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.mensagem}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.data_criacao).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          
                          {notification.importante && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Importante
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold orbe-text-primary mb-2">
                  {filter === 'nao_lidas' ? 'Nenhuma notificação não lida' : 
                   filter === 'importantes' ? 'Nenhuma notificação importante' : 
                   'Nenhuma notificação'}
                </h3>
                <p className="text-muted-foreground text-center">
                  {filter === 'todas' 
                    ? 'Você não tem notificações no momento.'
                    : 'Tente alterar o filtro para ver mais notificações.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

