// Location-related utility functions
// Handles location selection and processing

import { locations } from '../data/locations';

/**
 * Find location by ID
 * @param {string} locationId - Location ID to find
 * @returns {Object|null} Location object or null if not found
 */
export function findLocationById(locationId) {
  return locations.find(loc => loc.id === locationId) || null;
}

/**
 * Get all available locations for dropdown
 * @returns {Array} Array of location options for dropdown
 */
export function getLocationOptions() {
  return locations.map(location => ({
    key: location.id,
    value: location.id,
    label: `${location.name}, ${location.country}`,
  }));
}

/**
 * Format coordinates for display
 * @param {Object} location - Location object with lat/lon
 * @returns {Object} Formatted coordinate data
 */
export function formatCoordinates(location) {
  return {
    latitude: location.lat.toFixed(4),
    longitude: location.lon.toFixed(4),
  };
}
