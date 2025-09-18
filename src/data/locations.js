// Predefined locations for the map and weather data
export const locations = [
  {
    id: 'san-jose',
    name: 'San José',
    country: 'Costa Rica',
    lat: 9.93,
    lon: -84.08,
    bbox: '-84.30,9.79,-83.80,10.16'
  },
  {
    id: 'cartago',
    name: 'Cartago',
    country: 'Costa Rica',
    lat: 9.86,
    lon: -83.92,
    bbox: '-84.14,9.72,-83.70,10.00'
  },
  {
    id: 'alajuela',
    name: 'Alajuela',
    country: 'Costa Rica',
    lat: 10.02,
    lon: -84.21,
    bbox: '-84.43,9.89,-83.99,10.15'
  },
  {
    id: 'heredia',
    name: 'Heredia',
    country: 'Costa Rica',
    lat: 10.00,
    lon: -84.12,
    bbox: '-84.34,9.87,-83.90,10.13'
  }
];

// Default location (San José)
export const defaultLocation = locations[0];
