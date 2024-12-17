import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number) => void
}

function LocationMarker({ onLocationSelect }: MapSearchProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null)
  const [placeName, setPlaceName] = useState<string | null>(null)

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)

      // Fetch place name using Google Geocoding API
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latlng.lat},${e.latlng.lng}&key=${process.env.GOOGLE_API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setPlaceName(data.results[0].formatted_address.split(',')[0])
          }
        })
        .catch((error) => console.error('Error fetching place name:', error))
    },
  })

  return position === null ? null : (
    <>
      <Marker position={position} />
      {placeName && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow z-[1000]">
          Selected: {placeName}
        </div>
      )}
    </>
  )
}

export default function MapSearch({ onLocationSelect }: MapSearchProps) {
  return (
    <div className="relative">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  )
}
