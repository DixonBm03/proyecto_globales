// Recommendation processing utilities
// Handles formatting and processing of recommendations for display

import { generateAllRecommendations } from './recommendations';

/**
 * Process recommendations for display in alert boxes
 * @param {Object} weatherData - Weather data for selected time period
 * @returns {Object} Processed recommendations ready for display
 */
export function processRecommendationsForDisplay(weatherData) {
  const recommendations = generateAllRecommendations(weatherData);

  return {
    clothing: recommendations.clothing.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
    })),
    equipment: recommendations.equipment.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
    })),
    health: recommendations.health.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
    })),
  };
}

/**
 * Check if recommendations should be displayed
 * @param {Object} recommendations - Recommendations object
 * @returns {Object} Object with boolean flags for each category
 */
export function shouldShowRecommendations(recommendations) {
  return {
    clothing: recommendations.clothing.length > 0,
    equipment: recommendations.equipment.length > 0,
    health: recommendations.health.length > 0,
  };
}
