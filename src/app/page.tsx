'use client';

import { useState, useEffect } from 'react';
import { MapPin, Scissors, Search, Menu, User, LogIn, Star, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { BarbershopMap } from '@/components/map/BarbershopMap';
import { Barbershop } from '@/lib/types';
import { calculateDistance } from '@/lib/utils/distance';
import { formatCurrency } from '@/lib/utils/currency';

export default function Home() {
  const { coordinates, loading: locationLoading, error: locationError } = useGeolocation();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [selectedBarbershop, setSelectedBarbershop] = useState<Barbershop | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Carregar barbearias (mock - substituir por chamada real ao Supabase)
  useEffect(() => {
    const mockBarbershops: Barbershop[] = [
      {
        id: '1',
        owner_id: 'owner1',
        name: 'Barbearia Premium VIP',
        description: 'Cortes modernos e tradicionais com os melhores profissionais',
        address: 'Av. Paulista, 1000 - São Paulo',
        latitude: -23.5615,
        longitude: -46.6565,
        phone: '(11) 98765-4321',
        is_open: true,
        is_vip: true,
        vip_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        vip_plan: 'premium',
        rating: 4.8,
        total_reviews: 127,
        is_blocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        owner_id: 'owner2',
        name: 'Studio do Barbeiro',
        description: 'Especialistas em barba e cabelo',
        address: 'Rua Augusta, 500 - São Paulo',
        latitude: -23.5505,
        longitude: -46.6333,
        phone: '(11) 91234-5678',
        is_open: true,
        is_vip: false,
        rating: 4.5,
        total_reviews: 89,
        is_blocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        owner_id: 'owner3',
        name: 'Corte Clássico VIP',
        description: 'Tradição e qualidade há 20 anos',
        address: 'Rua da Consolação, 300 - São Paulo',
        latitude: -23.5489,
        longitude: -46.6388,
        phone: '(11) 99876-5432',
        is_open: false,
        is_vip: true,
        vip_expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        vip_plan: 'basic',
        rating: 4.9,
        total_reviews: 203,
        is_blocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Calcular distância se tiver coordenadas
    if (coordinates) {
      const barbershopsWithDistance = mockBarbershops.map(b => ({
        ...b,
        distance: calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          b.latitude,
          b.longitude
        )
      }));

      // Ordenar: VIP primeiro, depois por distância
      barbershopsWithDistance.sort((a, b) => {
        if (a.is_vip && !b.is_vip) return -1;
        if (!a.is_vip && b.is_vip) return 1;
        return (a.distance || 0) - (b.distance || 0);
      });

      setBarbershops(barbershopsWithDistance);
    } else {
      setBarbershops(mockBarbershops);
    }
  }, [coordinates]);

  const filteredBarbershops = barbershops.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Scissors className="w-8 h-8 text-yellow-500" />
                <MapPin className="w-4 h-4 text-yellow-500 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Corte Perto</h1>
                <p className="text-xs text-gray-400">Seu corte. Sua distância. Seu tempo.</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {authLoading ? (
                <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
              ) : user ? (
                <>
                  <NotificationBell userId={user.id} />
                  <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                    <User className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              )}
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Encontre o corte perfeito
              <br />
              <span className="text-yellow-500">perto de você</span>
            </h2>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar barbearias próximas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                />
              </div>
            </div>

            {/* Location Status */}
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              {locationLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-400">Obtendo sua localização...</span>
                </>
              ) : locationError ? (
                <>
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-red-400">{locationError}</span>
                </>
              ) : coordinates ? (
                <>
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-green-400">
                    Localização ativa • {filteredBarbershops.length} barbearias próximas
                  </span>
                </>
              ) : null}
            </div>

            {/* View Toggle */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'border-gray-700 text-gray-300'}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Mapa
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'border-gray-700 text-gray-300'}
              >
                <Navigation2 className="w-4 h-4 mr-2" />
                Lista
              </Button>
            </div>
          </div>

          {/* Map or List View */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {/* Map */}
            {viewMode === 'map' && (
              <div className="lg:col-span-2 h-[600px]">
                <BarbershopMap
                  barbershops={filteredBarbershops}
                  userLocation={coordinates || undefined}
                  onMarkerClick={setSelectedBarbershop}
                  selectedBarbershopId={selectedBarbershop?.id}
                />
              </div>
            )}

            {/* List */}
            <div className={viewMode === 'list' ? 'lg:col-span-2' : 'lg:col-span-2'}>
              <div className="space-y-4">
                {filteredBarbershops.length === 0 ? (
                  <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
                    <p className="text-gray-400">Nenhuma barbearia encontrada</p>
                  </div>
                ) : (
                  filteredBarbershops.map((barbershop) => (
                    <div
                      key={barbershop.id}
                      className={`bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer ${
                        selectedBarbershop?.id === barbershop.id
                          ? 'border-yellow-500 bg-yellow-500/5'
                          : 'border-gray-700'
                      }`}
                      onClick={() => setSelectedBarbershop(barbershop)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Photo */}
                        <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Scissors className="w-10 h-10 text-gray-500" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-white">
                                {barbershop.name}
                              </h3>
                              {barbershop.is_vip && (
                                <Badge className="bg-yellow-500 text-black font-semibold">
                                  👑 VIP
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-5 h-5 fill-yellow-500" />
                              <span className="font-bold">{barbershop.rating.toFixed(1)}</span>
                              <span className="text-gray-400 text-sm">
                                ({barbershop.total_reviews})
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {barbershop.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-300">
                              <MapPin className="w-4 h-4" />
                              {barbershop.address}
                            </div>
                            {barbershop.distance && (
                              <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                                <Navigation2 className="w-4 h-4" />
                                {barbershop.distance.toFixed(1)} km
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  barbershop.is_open ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              />
                              <span
                                className={
                                  barbershop.is_open ? 'text-green-400' : 'text-red-400'
                                }
                              >
                                {barbershop.is_open ? 'Aberto agora' : 'Fechado'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                              Agendar Horário
                            </Button>
                            <Button variant="outline" className="border-gray-700 text-gray-300">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* CTA for Barbers */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Você é barbeiro ou dono de barbearia?
            </h3>
            <p className="text-gray-400 mb-6">
              Cadastre seu estabelecimento e apareça para milhares de clientes próximos
            </p>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-lg">
              Cadastrar Minha Barbearia
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-md py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">
            © 2024 Corte Perto. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
