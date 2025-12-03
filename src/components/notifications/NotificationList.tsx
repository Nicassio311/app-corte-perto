'use client';

import { Notification } from '@/lib/types/notifications';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils/date';
import Link from 'next/link';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationListProps) {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-500/5';
      case 'high':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'medium':
        return 'border-l-blue-500 bg-blue-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Notificações</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-400">
            {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
          </p>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-800">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-l-4 transition-colors ${
                getPriorityColor(notification.priority)
              } ${!notification.is_read ? 'bg-gray-800/30' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(notification.created_at)}
                    </span>
                    {notification.action_url && (
                      <Link
                        href={notification.action_url}
                        className="text-xs text-yellow-500 hover:text-yellow-400 font-medium"
                      >
                        Ver detalhes →
                      </Link>
                    )}
                  </div>
                </div>
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="flex-shrink-0 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
