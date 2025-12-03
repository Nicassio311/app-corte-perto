// Corte Perto - Tipos TypeScript Completos

export type UserType = 'client' | 'barber' | 'admin';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type PaymentMethod = 'pix' | 'credit_card';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type VIPPlan = 'basic' | 'premium';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

export interface Barbershop {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
  phone?: string;
  is_open: boolean;
  is_vip: boolean;
  vip_expires_at?: string;
  vip_plan?: VIPPlan;
  rating: number;
  total_reviews: number;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  distance?: number; // Calculado no frontend
}

export interface BusinessHours {
  id: string;
  barbershop_id: string;
  day_of_week: number; // 0 = Domingo, 6 = Sábado
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  barbershop_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  barbershop_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  client?: Profile;
  barbershop?: Barbershop;
  service?: Service;
}

export interface Review {
  id: string;
  client_id: string;
  barbershop_id: string;
  appointment_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  client?: Profile;
}

export interface Favorite {
  id: string;
  client_id: string;
  barbershop_id: string;
  created_at: string;
  // Relacionamentos
  barbershop?: Barbershop;
}

export interface VIPPayment {
  id: string;
  barbershop_id: string;
  plan: VIPPlan;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id?: string;
  paid_at?: string;
  expires_at: string;
  created_at: string;
}

// Tipos para formulários
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterClientFormData {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterBarberFormData {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  barbershop_name: string;
  barbershop_address: string;
  barbershop_description?: string;
  latitude: number;
  longitude: number;
}

export interface CreateServiceFormData {
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
}

export interface CreateAppointmentFormData {
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

// Tipos para localização
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  barbershop: Barbershop;
}

// Constantes
export const VIP_PLANS = {
  basic: {
    name: 'Barbeiro Individual',
    price: 19.90,
    duration_days: 30,
    features: [
      'Destaque no topo da lista',
      'Ícone dourado no mapa',
      'Agenda ilimitada',
      'Avaliações liberadas',
      'Suporte prioritário'
    ]
  },
  premium: {
    name: 'Barbearia Grande',
    price: 39.90,
    duration_days: 30,
    features: [
      'Todos os benefícios do plano básico',
      'Até 5 barbeiros cadastrados',
      'Estatísticas avançadas',
      'Destaque premium no mapa',
      'Suporte VIP 24/7'
    ]
  }
} as const;

export const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
] as const;
