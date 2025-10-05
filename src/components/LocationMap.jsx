// src/components/LocationMap.jsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -36],
});

function ClickCapture({ onSelect, interactive = true }) {
  useMapEvents({
    click(e) {
      if (interactive) {
        onSelect({ lat: e.latlng.lat, lon: e.latlng.lng });
      }
    },
  });
  return null;
}

export default function LocationMap({
  defaultCenter = { lat: 9.9281, lon: -84.0907 }, // San José
  onLocationSelected,
  autoLocate = true,
  interactive = true,
}) {
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    if (!autoLocate || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCenter(c);
        onLocationSelected?.(c);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [autoLocate, onLocationSelected]);

  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={11}
      style={{ height: 320, width: '100%', borderRadius: 12 }}
      scrollWheelZoom
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
      />
      <ClickCapture
        onSelect={c => {
          setCenter(c);
          onLocationSelected?.(c);
        }}
        interactive={interactive}
      />
      <Marker position={[center.lat, center.lon]} icon={pin} />
    </MapContainer>
  );
}
