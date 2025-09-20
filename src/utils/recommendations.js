// Weather-based recommendation engine
// Analyzes current weather data and provides contextual advice

/**
 * Generate clothing recommendations based on weather conditions
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of clothing recommendations
 */
export function getClothingRecommendations(weatherData) {
  const { temperature, weathercode, windspeed } = weatherData;
  const recommendations = [];

  // Temperature-based clothing
  if (temperature <= 15) {
    recommendations.push({
      text: '🧥 Abrigo o chaqueta gruesa',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🧣 Accesorios de invierno (bufanda, guantes)',
      action: 'Considerar',
      priority: 'medium',
    });
  } else if (temperature <= 20) {
    recommendations.push({
      text: '🧥 Chaqueta ligera o suéter',
      action: 'Recomendado',
      priority: 'medium',
    });
  } else if (temperature >= 30) {
    recommendations.push({
      text: '👕 Ropa ligera y transpirable',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🧴 Protector solar SPF 30+',
      action: 'Esencial',
      priority: 'high',
    });
  }

  // Weather condition-based clothing
  if (weathercode >= 61 && weathercode <= 67) {
    // Rain
    recommendations.push({
      text: '☔ Impermeable o paraguas',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '👟 Calzado resistente al agua',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  if (weathercode >= 71 && weathercode <= 77) {
    // Snow
    recommendations.push({
      text: '❄️ Ropa de invierno completa',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '🥾 Botas impermeables',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  // Wind-based recommendations
  if (windspeed > 20) {
    recommendations.push({
      text: '🧥 Chaqueta cortavientos',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  return recommendations;
}

/**
 * Generate equipment recommendations based on weather conditions
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of equipment recommendations
 */
export function getEquipmentRecommendations(weatherData) {
  const { temperature, weathercode, humidity } = weatherData;
  const recommendations = [];

  // Temperature-based equipment
  if (temperature <= 10) {
    recommendations.push({
      text: '🔥 Calentador portátil o termos',
      action: 'Considerar',
      priority: 'medium',
    });
  } else if (temperature >= 30) {
    recommendations.push({
      text: '🧊 Termo con agua fría',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🌬️ Ventilador portátil',
      action: 'Considerar',
      priority: 'low',
    });
  }

  // Weather condition-based equipment
  if (weathercode >= 61 && weathercode <= 67) {
    // Rain
    recommendations.push({
      text: '📱 Protector para dispositivos electrónicos',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  if (weathercode >= 71 && weathercode <= 77) {
    // Snow
    recommendations.push({
      text: '🧹 Escobilla para nieve',
      action: 'Considerar',
      priority: 'low',
    });
  }

  // Humidity-based recommendations
  if (humidity > 80) {
    recommendations.push({
      text: '🌬️ Deshumidificador portátil',
      action: 'Considerar',
      priority: 'low',
    });
  } else if (humidity < 30) {
    recommendations.push({
      text: '💧 Humidificador portátil',
      action: 'Considerar',
      priority: 'low',
    });
  }

  return recommendations;
}

/**
 * Generate health and care product recommendations based on weather conditions
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of health recommendations
 */
export function getHealthRecommendations(weatherData) {
  const { temperature, weathercode, humidity, windspeed } = weatherData;
  const recommendations = [];

  // Temperature-based health recommendations
  if (temperature <= 5) {
    recommendations.push({
      text: '🧴 Crema hidratante para piel seca',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '💊 Vitamina C para el sistema inmunológico',
      action: 'Considerar',
      priority: 'medium',
    });
  } else if (temperature >= 30) {
    recommendations.push({
      text: '🧴 Protector solar SPF 50+',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '💧 Hidratación extra (2+ litros de agua)',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '🧴 Crema hidratante post-sol',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  // Weather condition-based health recommendations
  if (weathercode >= 61 && weathercode <= 67) {
    // Rain
    recommendations.push({
      text: '🧴 Crema antimicótica para pies',
      action: 'Considerar',
      priority: 'low',
    });
  }

  // Humidity-based health recommendations
  if (humidity > 80) {
    recommendations.push({
      text: '🧴 Talco para prevenir irritaciones',
      action: 'Considerar',
      priority: 'low',
    });
  } else if (humidity < 30) {
    recommendations.push({
      text: '🧴 Gotas para ojos secos',
      action: 'Considerar',
      priority: 'medium',
    });
    recommendations.push({
      text: '🧴 Bálsamo labial hidratante',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  // Wind-based health recommendations
  if (windspeed > 15) {
    recommendations.push({
      text: '🧴 Crema para labios con protección',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  return recommendations;
}

/**
 * Generate all recommendations based on current weather data
 * @param {Object} weatherData - Current weather data
 * @returns {Object} Object containing all recommendation categories
 */
export function generateAllRecommendations(weatherData) {
  if (!weatherData) return { clothing: [], equipment: [], health: [] };

  const clothing = getClothingRecommendations(weatherData);
  const equipment = getEquipmentRecommendations(weatherData);
  const health = getHealthRecommendations(weatherData);

  return {
    clothing: clothing.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    equipment: equipment.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    health: health.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
  };
}

/**
 * Get weather condition description based on weather code
 * @param {number} weathercode - Weather code from API
 * @returns {string} Human-readable weather description
 */
export function getWeatherDescription(weathercode) {
  const weatherCodes = {
    0: 'Cielo despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve intensa',
    77: 'Granos de nieve',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve intensos',
    95: 'Tormenta eléctrica',
    96: 'Tormenta eléctrica con granizo ligero',
    99: 'Tormenta eléctrica con granizo intenso',
  };

  return weatherCodes[weathercode] || 'Condiciones desconocidas';
}
