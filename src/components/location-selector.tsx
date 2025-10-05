import { MapPin, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { env } from "@/env";
import { apiMapBox } from "@/lib/axios";

mapboxgl.accessToken = env.VITE_ACCESS_TOKEN_MAPBOX

export function LocationSelector() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [city, setCity] = useState("")
  const [citySearch, setCitySearch] = useState("")
  const [longitude, setLogintude] = useState<number>(-49.4697586)
  const [latitutde, setLatitude] = useState<number>(-18.9755271)

  // Cidades populares mocadas
  const popularCities = [
    { name: 'São Paulo, Brasil', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro, Brasil', lat: -22.9068, lng: -43.1729 },
    { name: 'New York, EUA', lat: 40.7128, lng: -74.0060 },
    { name: 'London, Reino Unido', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo, Japão', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney, Austrália', lat: -33.8688, lng: 151.2093 },
    { name: 'Uberlândia, Brasil', lat: -18.9165007, lng: -48.2812944 }
  ];

  useEffect(() => {

    if (mapContainerRef.current) {
      const initialCoords: [number, number] = [-49.4697586, -18.9755271]; // [lng, lat]
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: initialCoords,
        zoom: 12,
        maxZoom: 30
      })

      const marker = new mapboxgl.Marker({color: "#FF0000"})
        .setLngLat(initialCoords)
        .addTo(map);

      mapRef.current = map
      markerRef.current = marker

      return () => map.remove();
    }
  }, [])

  async function handleSearchCity() {
    if (!city.trim()) return

    try {
      // Buscar cidade usando axios
      const { data } = await apiMapBox.get(`/geocoding/v5/mapbox.places/${encodeURIComponent(
        city
      )}.json`,
        {
          params: {
            access_token: env.VITE_ACCESS_TOKEN_MAPBOX
          }
        })
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        setCitySearch(city)
        setLogintude(lng)
        setLatitude(lat)

        // Centraliza o mapa suavemente
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 12,
          essential: true
        })

        // Atualiza (ou cria) o marcador
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat])
        } else {
          markerRef.current = new mapboxgl.Marker({color: "#FF0000"})
          .setLngLat([lng, lat])
          .addTo(mapRef.current!)
        }
      } else {
        alert("Cidade não encontrada!")
      }
    } catch (error) {
      console.error(`Erro ao buscar a cidade: ${error}`)
      alert("Ocorreu um erro ao buscar a cidade")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Selecionar localização
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Digite o nome da cidade..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchCity()}
          />
          <Button onClick={handleSearchCity} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/*Container do MapBox */}
        <div className="relative h-64 bg-blue-50 rounded-lg border overflow-hidden">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        </div>

        {/* Container cidades populares */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Cidades populares:
          </p>
          <div className="flex flex-wrap gap-2">
            {
              popularCities.map((city) => (
                <Button
                  key={city.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCity(city.name.split(',')[0])
                    handleSearchCity()
                  }}
                >
                  {city.name.split(',')[0]}
                </Button>
              ))
            }
          </div>
        </div>

        {citySearch && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Local selecionado:</p>
            <p className="text-sm text-muted-foreground">{city}</p>
            <p className="text-xs text-muted-foreground">
              Coordenadas: {latitutde.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}