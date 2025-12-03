// Sistema de Notificações - Corte Perto

export type NotificationType = 
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'vip_expiring_soon'
  | 'vip_expired'
  | 'vip_activated'
  | 'new_review'
  | 'promotion';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  read_at?: string;
}

// Mensagens de notificação VIP
export const VIP_NOTIFICATIONS = {
  expiring_soon: {
    title: '⚠️ Seu plano VIP expira em breve',
    getMessage: (daysLeft: number) => 
      `Seu destaque VIP expira em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}. Renove agora para continuar aparecendo no topo!`,
    priority: 'high' as NotificationPriority
  },
  expired: {
    title: '❌ Seu plano VIP expirou',
    message: 'Seu destaque expirou. Você caiu para o final da lista. Ative o VIP para continuar aparecendo para novos clientes.',
    priority: 'urgent' as NotificationPriority
  },
  activated: {
    title: '✨ Plano VIP ativado com sucesso!',
    message: 'Parabéns! Sua barbearia agora aparece no topo da lista com destaque dourado. Aproveite os benefícios!',
    priority: 'high' as NotificationPriority
  },
  trial_ending: {
    title: '🎁 Período gratuito terminando',
    getMessage: (daysLeft: number) =>
      `Seus 7 dias grátis de VIP terminam em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}. Assine agora com desconto!`,
    priority: 'high' as NotificationPriority
  }
} as const;

// Mensagens de notificação de agendamento
export const APPOINTMENT_NOTIFICATIONS = {
  confirmed: {
    title: '✅ Agendamento confirmado',
    getMessage: (barbershopName: string, date: string, time: string) =>
      `Seu horário na ${barbershopName} foi confirmado para ${date} às ${time}.`,
    priority: 'medium' as NotificationPriority
  },
  cancelled: {
    title: '❌ Agendamento cancelado',
    getMessage: (barbershopName: string) =>
      `Seu agendamento na ${barbershopName} foi cancelado.`,
    priority: 'high' as NotificationPriority
  },
  reminder: {
    title: '⏰ Lembrete de agendamento',
    getMessage: (barbershopName: string, time: string) =>
      `Seu horário na ${barbershopName} é daqui a 1 hora (${time}). Não se atrase!`,
    priority: 'high' as NotificationPriority
  }
} as const;
