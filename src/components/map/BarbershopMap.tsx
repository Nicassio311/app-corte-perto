'use client';

import { useEffect, useRef, useState } from 'react';
import { Barbershop } from '@/lib/types';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarbershopMapProps {
  barbershops: Barbershop[];
  userLocation?: { latitude: number; longitude: number };
  onMarkerClick?: (barbershop: Barbershop) => void;
  selectedBarbershopId?: string;
}

export function BarbershopMap({
  barbershops,
  userLocation,
  onMarkerClick,
  selectedBarbershopId
}: BarbershopMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar mapa
  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          setError('Configure a chave do Google Maps API nas variáveis de ambiente');
          setIsLoading(false);
          return;
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const google = await loader.load();

        if (!mapRef.current) return;

        const defaultCenter = userLocation
          ? { lat: userLocation.latitude, lng: userLocation.longitude }
          : { lat: -23.5505, lng: -46.6333 }; // São Paulo como padrão

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 14,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#1a1a1a' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#000000' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#2c2c2c' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#0f0f0f' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        });

        setMap(mapInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar mapa:', err);
        setError('Erro ao carregar o mapa. Verifique sua conexão.');
        setIsLoading(false);
      }
    };

    initMap();
  }, [userLocation]);

  // Adicionar marcadores das barbearias
  useEffect(() => {
    if (!map) return;

    // Limpar marcadores antigos
    markers.forEach(marker => marker.setMap(null));

    const newMarkers: google.maps.Marker[] = [];

    // Marcador do usuário
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        title: 'Você está aqui'
      });
      newMarkers.push(userMarker);
    }

    // Marcadores das barbearias
    barbershops.forEach(barbershop => {
      const isVip = barbershop.is_vip;
      const isSelected = barbershop.id === selectedBarbershopId;

      const marker = new google.maps.Marker({
        position: { lat: barbershop.latitude, lng: barbershop.longitude },
        map,
        icon: {
          url: isVip
            ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
                  <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 30 20 30s20-16 20-30C40 8.954 31.046 0 20 0z" fill="#EAB308"/>
                  <circle cx="20" cy="20" r="12" fill="#000000"/>
                  <path d="M20 12l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#EAB308"/>
                </svg>
              `)
            : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
                  <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 30 20 30s20-16 20-30C40 8.954 31.046 0 20 0z" fill="${isSelected ? '#EAB308' : '#6B7280'}"/>
                  <circle cx="20" cy="20" r="12" fill="#000000"/>
                  <path d="M15 18h10M15 22h10" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              `),
          scaledSize: new google.maps.Size(40, 50),
          anchor: new google.maps.Point(20, 50)
        },
        title: barbershop.name,
        zIndex: isVip ? 1000 : (isSelected ? 999 : 1)
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #000; padding: 8px; min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
              ${isVip ? '👑' : ''} ${barbershop.name}
            </h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${barbershop.address}</p>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #EAB308;">⭐ ${barbershop.rating.toFixed(1)}</span>
              <span style="color: #666; font-size: 12px;">(${barbershop.total_reviews} avaliações)</span>
            </div>
            ${barbershop.distance ? `<p style="font-size: 12px; color: #666;">📍 ${barbershop.distance.toFixed(1)} km de distância</p>` : ''}
            <p style="font-size: 12px; margin-top: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${barbershop.is_open ? '#10B981' : '#EF4444'}; margin-right: 4px;"></span>
              ${barbershop.is_open ? 'Aberto agora' : 'Fechado'}
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onMarkerClick) {
          onMarkerClick(barbershop);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Ajustar zoom para mostrar todos os marcadores
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [map, barbershops, userLocation, selectedBarbershopId, onMarkerClick]);

  const centerOnUser = () => {
    if (map && userLocation) {
      map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
      map.setZoom(15);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">{error}</p>
          <p className="text-gray-600 text-sm">
            Adicione NEXT_PUBLIC_GOOGLE_MAPS_API_KEY nas variáveis de ambiente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      {userLocation && (
        <Button
          onClick={centerOnUser}
          className="absolute bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg"
          size="icon"
        >
          <Navigation className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
