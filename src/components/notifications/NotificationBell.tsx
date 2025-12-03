'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Notification } from '@/lib/types/notifications';
import { NotificationList } from './NotificationList';

interface NotificationBellProps {
  userId?: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Simulação de notificações (substituir por chamada real ao Supabase)
  useEffect(() => {
    if (!userId) return;

    // Exemplo de notificações
    const mockNotifications: Notification[] = [
      {
        id: '1',
        user_id: userId,
        type: 'vip_expiring_soon',
        title: '⚠️ Seu plano VIP expira em breve',
        message: 'Seu destaque VIP expira em 3 dias. Renove agora para continuar aparecendo no topo!',
        priority: 'high',
        is_read: false,
        action_url: '/barber/vip',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: userId,
        type: 'appointment_confirmed',
        title: '✅ Novo agendamento',
        message: 'João Silva agendou um corte para amanhã às 14h.',
        priority: 'medium',
        is_read: false,
        action_url: '/barber/appointments',
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
  }, [userId]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  if (!userId) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-gray-800"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 bg-gray-900 border-gray-700"
        align="end"
      >
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </PopoverContent>
    </Popover>
  );
}
