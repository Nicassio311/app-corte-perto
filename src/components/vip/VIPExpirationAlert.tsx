'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

interface VIPExpirationAlertProps {
  vipExpiresAt?: string;
  isVip: boolean;
  barbershopId: string;
}

export function VIPExpirationAlert({
  vipExpiresAt,
  isVip,
  barbershopId
}: VIPExpirationAlertProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    if (!vipExpiresAt) {
      setHasExpired(!isVip);
      return;
    }

    const expirationDate = new Date(vipExpiresAt);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysLeft(diffDays);
    setHasExpired(diffDays <= 0);
  }, [vipExpiresAt, isVip]);

  if (!isVisible) return null;

  // VIP expirado
  if (hasExpired && !isVip) {
    return (
      <Alert className="bg-red-500/10 border-red-500/50 mb-6">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertTitle className="text-red-500 font-bold text-lg">
          ❌ Seu plano VIP expirou
        </AlertTitle>
        <AlertDescription className="text-red-300 mt-2">
          <p className="mb-3">
            Seu destaque expirou e sua barbearia caiu para o final da lista. 
            Você está perdendo clientes! Ative o VIP agora para voltar ao topo.
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Link href={`/barber/vip?barbershop=${barbershopId}`}>
                <Crown className="w-4 h-4 mr-2" />
                Reativar VIP Agora
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // VIP expirando em breve (7 dias ou menos)
  if (daysLeft !== null && daysLeft > 0 && daysLeft <= 7) {
    return (
      <Alert className="bg-yellow-500/10 border-yellow-500/50 mb-6">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <AlertTitle className="text-yellow-500 font-bold text-lg">
          ⚠️ Seu plano VIP expira em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
        </AlertTitle>
        <AlertDescription className="text-yellow-300 mt-2">
          <p className="mb-3">
            Não perca seu destaque! Renove agora e continue aparecendo no topo 
            da lista para novos clientes.
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Link href={`/barber/vip?barbershop=${barbershopId}`}>
                <Crown className="w-4 h-4 mr-2" />
                Renovar VIP
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
