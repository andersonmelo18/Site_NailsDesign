import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { site } from '../data/site'
import 'leaflet/dist/leaflet.css'

export default function StudioMap() {
  const container = useRef<HTMLDivElement>(null)
  const [unavailable, setUnavailable] = useState(false)
  useEffect(() => {
    if (!container.current) return
    const coordinates: L.LatLngTuple = [site.coordinates[0], site.coordinates[1]]
    const map = L.map(container.current, { scrollWheelZoom: false }).setView(coordinates, 16)
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>', maxZoom: 19,
    }).addTo(map)
    tiles.on('tileerror', () => setUnavailable(true))
    const icon = L.divIcon({ className: 'map-pin', html: '<span></span>', iconSize: [26, 26], iconAnchor: [13, 26] })
    L.marker(coordinates, { icon, alt: 'Nails Academy Studio de Unhas' }).addTo(map).bindPopup('Nails Academy Studio de Unhas').openPopup()
    return () => { map.remove() }
  }, [])
  return <div><div ref={container} className="map-frame" role="region" aria-label="Mapa com a localização do Nails Academy Studio de Unhas" />{unavailable && <p className="map-status" role="status">O mapa está indisponível. Use “Traçar rota” para abrir o endereço.</p>}</div>
}
