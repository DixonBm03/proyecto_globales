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
      priority: rec.priority,
    })),
    equipment: recommendations.equipment.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
      priority: rec.priority,
    })),
    health: recommendations.health.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
      priority: rec.priority,
    })),
    sunscreen: recommendations.sunscreen.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
      priority: rec.priority,
    })),
    heatStress: recommendations.heatStress.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
      priority: rec.priority,
    })),
    airQuality: recommendations.airQuality.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
      priority: rec.priority,
    })),
    workplaceSafety: recommendations.workplaceSafety.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
      priority: rec.priority,
    })),
    vulnerablePopulations: recommendations.vulnerablePopulations
      .slice(0, 3)
      .map(rec => ({
        text: rec.text,
        action: rec.action,
        priority: rec.priority,
      })),
    waterSafety: recommendations.waterSafety.slice(0, 3).map(rec => ({
      text: rec.text,
      action: rec.action,
      priority: rec.priority,
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
    sunscreen: recommendations.sunscreen.length > 0,
  };
}

/**
 * Map recommendations to specific weather stats
 * @param {Object} recommendations - All recommendations
 * @param {Object} weatherData - Current weather data
 * @returns {Object} Recommendations mapped to each stat
 */
export function mapRecommendationsToStats(recommendations, weatherData) {
  return {
    temperature: [
      ...recommendations.clothing.filter(
        rec =>
          rec.text.includes('Abrigo') ||
          rec.text.includes('chaqueta') ||
          rec.text.includes('Ropa ligera') ||
          rec.text.includes('suéter') ||
          rec.text.includes('algodón')
      ),
      ...recommendations.health.filter(
        rec =>
          rec.text.includes('hidratante') ||
          rec.text.includes('Hidratación') ||
          rec.text.includes('Vitamina C')
      ),
      ...recommendations.heatStress,
      ...recommendations.waterSafety,
      ...recommendations.vulnerablePopulations.filter(
        rec =>
          rec.text.includes('niños') ||
          rec.text.includes('adultos mayores') ||
          rec.text.includes('embarazadas')
      ),
    ],
    rainProbability: [
      ...recommendations.clothing.filter(
        rec =>
          rec.text.includes('Impermeable') ||
          rec.text.includes('paraguas') ||
          rec.text.includes('Calzado resistente')
      ),
      ...recommendations.equipment.filter(rec =>
        rec.text.includes('Protector para dispositivos')
      ),
    ],
    windspeed: [
      ...recommendations.clothing.filter(rec =>
        rec.text.includes('cortavientos')
      ),
      ...recommendations.health.filter(rec =>
        rec.text.includes('labios con protección')
      ),
      ...recommendations.airQuality.filter(
        rec => rec.text.includes('ejercicio') || rec.text.includes('ventanas')
      ),
      ...recommendations.workplaceSafety.filter(
        rec => rec.text.includes('altura') || rec.text.includes('protección')
      ),
    ],
    humidity: [
      ...recommendations.equipment.filter(
        rec =>
          rec.text.includes('Deshumidificador') ||
          rec.text.includes('Humidificador') ||
          rec.text.includes('ventiladores')
      ),
      ...recommendations.health.filter(
        rec =>
          rec.text.includes('Talco') ||
          rec.text.includes('ojos secos') ||
          rec.text.includes('Bálsamo labial')
      ),
      ...recommendations.airQuality.filter(rec =>
        rec.text.includes('purificadores')
      ),
      ...recommendations.waterSafety.filter(rec =>
        rec.text.includes('aire seco')
      ),
    ],
    pressure: [
      ...recommendations.equipment.filter(
        rec => rec.text.includes('Calentador') || rec.text.includes('termos')
      ),
      ...recommendations.airQuality.filter(rec =>
        rec.text.includes('espacios verdes')
      ),
    ],
    uvIndex: [
      ...recommendations.sunscreen,
      ...recommendations.clothing.filter(
        rec =>
          rec.text.includes('Protector solar') ||
          rec.text.includes('Gorra') ||
          rec.text.includes('sombrero') ||
          rec.text.includes('Gafas de sol') ||
          rec.text.includes('manga larga')
      ),
      ...recommendations.health.filter(
        rec =>
          rec.text.includes('Protector solar') ||
          rec.text.includes('Crema hidratante post-sol')
      ),
      ...recommendations.workplaceSafety.filter(
        rec =>
          rec.text.includes('protección UV') || rec.text.includes('horarios')
      ),
    ],
  };
}
