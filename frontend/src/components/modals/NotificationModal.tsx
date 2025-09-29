'use client';

import { useState } from 'react';
import { X, Bell, Check, Calendar, Star } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { motion, PanInfo } from 'framer-motion';


const NotificationModal: React.FC = () => {
  const {
    isNotificationModalOpen,
    closeNotificationModal,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useAppStore();
  
  const [filter, setFilter] = useState<'todas' | 'nao_lidas'>('todas');

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'NEW_SEASON':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'RELEASE_SOON':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'nao_lidas') {
      return !notif.foi_visualizada;
    }
    return true;
  });

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, notificationId: number) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      deleteNotification(notificationId);
    }
  };

  if (!isNotificationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={closeNotificationModal}>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
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
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="flex items-center gap-2 px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
                >
                  <Check className="h-3 w-3" />
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => handleDragEnd(event, info, notification.id)}
                    className={`p-4 hover:bg-muted/50 transition-colors ${
                      !notification.foi_visualizada ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)} 
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-sm font-medium ${
                            !notification.foi_visualizada ? 'orbe-text-primary' : 'text-muted-foreground'
                          }`}>
                            {notification.message}
                          </h3>
                          
                          <div className="flex items-center gap-1">
                            {!notification.foi_visualizada && (
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                                title="Marcar como lida"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold orbe-text-primary mb-2">
                  Nenhuma notificação
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