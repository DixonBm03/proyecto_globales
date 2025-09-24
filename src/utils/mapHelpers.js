// Map-related utility functions
// Handles map URL generation and marker placement

/**
 * Generate OpenStreetMap embed URL with marker
 * @param {Object} location - Location object with lat, lon, bbox
 * @returns {string} Complete map URL
 */
export function generateMapUrl(location) {
  const { lat, lon, bbox } = location;

  // Ensure coordinates are properly formatted
  const formattedLat = parseFloat(lat).toFixed(6);
  const formattedLon = parseFloat(lon).toFixed(6);

  // Generate the map URL with marker
  const baseUrl = 'https://www.openstreetmap.org/export/embed.html';
  const params = new URLSearchParams({
    bbox: bbox,
    layer: 'mapnik',
    marker: `${formattedLat},${formattedLon}`,
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate alternative map URL using different service for better marker support
 * @param {Object} location - Location object with lat, lon, bbox
 * @returns {string} Alternative map URL
 */
export function generateAlternativeMapUrl(location) {
  const { lat, lon, bbox } = location;

  // Use a different approach with static map
  const centerLat = parseFloat(lat).toFixed(6);
  const centerLon = parseFloat(lon).toFixed(6);

  // Create a custom map URL that should show the marker more reliably
  const baseUrl = 'https://www.openstreetmap.org/export/embed.html';
  const params = new URLSearchParams({
    bbox: bbox,
    layer: 'mapnik',
    marker: `${centerLat},${centerLon}`,
    // Add some additional parameters to ensure marker visibility
    zoom: '12',
  });

  return `${baseUrl}?${params.toString()}`;
}
