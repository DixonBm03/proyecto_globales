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
      text: '🧴 Crema para prevenir irritaciones',
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
 * Generate sunscreen recommendations based on UV index
 * @param {Object} weatherData - Current weather data including UV index
 * @returns {Array} Array of sunscreen recommendations
 */
export function getSunscreenRecommendations(weatherData) {
  const { uvIndex } = weatherData;
  const recommendations = [];

  if (!uvIndex || uvIndex === null) {
    return recommendations;
  }

  // UV Index scale: 0-2 (Low), 3-5 (Moderate), 6-7 (High), 8-10 (Very High), 11+ (Extreme)
  if (uvIndex >= 3 && uvIndex <= 5) {
    // Moderate UV
    recommendations.push({
      text: '🧴 Protector solar SPF 15-30 recomendado',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '👒 Gorra o sombrero para protección adicional',
      action: 'Considerar',
      priority: 'low',
    });
  } else if (uvIndex >= 6 && uvIndex <= 7) {
    // High UV
    recommendations.push({
      text: '🧴 Protector solar SPF 30+ esencial',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '👒 Gorra, sombrero o sombra entre 10am-4pm',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🕶️ Gafas de sol con protección UV',
      action: 'Recomendado',
      priority: 'medium',
    });
  } else if (uvIndex >= 8 && uvIndex <= 10) {
    // Very High UV
    recommendations.push({
      text: '🧴 Protector solar SPF 50+ obligatorio',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '👒 Evitar exposición directa 10am-4pm',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🕶️ Gafas de sol con protección UV completa',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '👕 Ropa de manga larga y pantalones',
      action: 'Recomendado',
      priority: 'medium',
    });
  } else if (uvIndex >= 11) {
    // Extreme UV
    recommendations.push({
      text: '🧴 Protector solar SPF 50+ cada 2 horas',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🏠 Evitar actividades al aire libre',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '👕 Ropa con protección UV certificada',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '🕶️ Gafas de sol con protección UV completa',
      action: 'Esencial',
      priority: 'high',
    });
  }

  return recommendations;
}

/**
 * Generate heat stress recommendations based on WHO guidelines
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of heat stress recommendations
 */
export function getHeatStressRecommendations(weatherData) {
  const { temperature, humidity, windspeed } = weatherData;
  const recommendations = [];

  // Calculate heat index approximation (simplified)
  const heatIndex = temperature + humidity * 0.1 - windspeed * 0.1;

  if (temperature >= 35 || heatIndex >= 40) {
    // Extreme heat conditions - WHO guidelines for heat waves
    recommendations.push({
      text: '🚨 Evitar actividades al aire libre entre 10am-4pm',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🏠 Buscar espacios con aire acondicionado (21-24°C)',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '💧 Hidratación constante (agua cada 15-20 min)',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🌡️ Monitorear temperatura corporal - síntomas de golpe de calor',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '👥 Verificar estado de familiares vulnerables cada 2 horas',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '🏥 Contactar servicios médicos si hay confusión o pérdida de conciencia',
      action: 'Crítico',
      priority: 'high',
    });
  } else if (temperature >= 30 || heatIndex >= 35) {
    // High heat conditions
    recommendations.push({
      text: '⏰ Limitar tiempo al aire libre en horas pico',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🌡️ Monitorear síntomas de agotamiento por calor',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '💧 Aumentar ingesta de agua (2-3 litros/día)',
      action: 'Esencial',
      priority: 'high',
    });
  }

  // Humidity-specific recommendations
  if (humidity > 70 && temperature > 25) {
    recommendations.push({
      text: '🌬️ Usar ventiladores para circulación de aire',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '👕 Ropa de algodón ligero y transpirable',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  return recommendations;
}

/**
 * Generate air quality recommendations based on WHO guidelines
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of air quality recommendations
 */
export function getAirQualityRecommendations(weatherData) {
  const { windspeed, humidity, pressure, temperature } = weatherData;
  const recommendations = [];

  // WHO Air Quality Guidelines 2021 - Based on meteorological conditions that affect air quality

  // Low wind conditions (<5 km/h) - WHO identifies this as high pollution risk
  if (windspeed < 5) {
    recommendations.push({
      text: '🚫 Evitar ejercicio intenso al aire libre - viento bajo',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🏠 Mantener ventanas cerradas en zonas urbanas',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '🌬️ Usar purificadores de aire con filtros HEPA',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '👥 Evitar actividades grupales al aire libre',
      action: 'Considerar',
      priority: 'medium',
    });
  }

  // Very low wind conditions (<2 km/h) - Critical air quality risk
  if (windspeed < 2) {
    recommendations.push({
      text: '🚨 Condiciones críticas - evitar salir de casa',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🏥 Personas con asma/EPOC deben usar medicación preventiva',
      action: 'Crítico',
      priority: 'high',
    });
  }

  // High pressure systems (>1020 hPa) - WHO identifies as pollution trapping conditions
  if (pressure > 1020) {
    recommendations.push({
      text: '🌿 Buscar espacios verdes alejados del tráfico',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '⏰ Evitar horas pico de tráfico (7-9am, 5-7pm)',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '🚗 Evitar caminar cerca de carreteras principales',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  // Very high pressure (>1030 hPa) - Extreme pollution trapping
  if (pressure > 1030) {
    recommendations.push({
      text: '⚠️ Sistema de alta presión - máxima contaminación',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🏠 Permanecer en interiores con ventilación controlada',
      action: 'Esencial',
      priority: 'high',
    });
  }

  // High humidity (>80%) - WHO notes this worsens air quality perception and health effects
  if (humidity > 80) {
    recommendations.push({
      text: '🌬️ Usar purificadores de aire en interiores',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '🏠 Controlar humedad interior (30-60% ideal)',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '🧽 Limpiar superficies para reducir alérgenos',
      action: 'Considerar',
      priority: 'low',
    });
  }

  // Temperature inversion conditions (cold air trapped near ground)
  if (temperature < 10 && windspeed < 3 && pressure > 1015) {
    recommendations.push({
      text: '🌡️ Inversión térmica - contaminación atrapada',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🚫 Evitar actividades al aire libre hasta mediodía',
      action: 'Esencial',
      priority: 'high',
    });
  }

  // WHO recommendations for vulnerable populations
  if (windspeed < 5 || pressure > 1020) {
    recommendations.push({
      text: '👶 Niños y embarazadas evitar salir al exterior',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '👴 Adultos mayores usar mascarillas N95',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '🏥 Personas con enfermedades respiratorias - máxima precaución',
      action: 'Crítico',
      priority: 'high',
    });
  }

  return recommendations;
}

/**
 * Generate workplace safety recommendations for outdoor workers
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of workplace safety recommendations
 */
export function getWorkplaceSafetyRecommendations(weatherData) {
  const { temperature, uvIndex, windspeed } = weatherData;
  const recommendations = [];

  if (temperature >= 30) {
    recommendations.push({
      text: '👷 Implementar pausas cada 15-20 minutos',
      action: 'Obligatorio',
      priority: 'high',
    });
    recommendations.push({
      text: '🏥 Designar área de descanso con sombra',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '💧 Proporcionar agua fresca constantemente',
      action: 'Obligatorio',
      priority: 'high',
    });
  }

  if (uvIndex >= 6) {
    recommendations.push({
      text: '👷 Proporcionar equipos de protección UV',
      action: 'Obligatorio',
      priority: 'high',
    });
    recommendations.push({
      text: '⏰ Rotar trabajos en horarios de menor UV',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  if (windspeed > 15) {
    recommendations.push({
      text: '⚠️ Suspender trabajos en altura',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '👷 Usar equipos de protección adicional',
      action: 'Obligatorio',
      priority: 'high',
    });
  }

  return recommendations;
}

/**
 * Generate recommendations for vulnerable populations
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of vulnerable population recommendations
 */
export function getVulnerablePopulationRecommendations(weatherData) {
  const { temperature } = weatherData;
  const recommendations = [];

  // Children-specific recommendations
  if (temperature >= 30) {
    recommendations.push({
      text: '👶 Supervisar constantemente a niños pequeños',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🍼 Aumentar frecuencia de alimentación en bebés',
      action: 'Esencial',
      priority: 'high',
    });
  }

  // Elderly-specific recommendations
  if (temperature <= 10 || temperature >= 30) {
    recommendations.push({
      text: '👴 Verificar estado de adultos mayores regularmente',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🏠 Mantener temperatura ambiente estable',
      action: 'Recomendado',
      priority: 'medium',
    });
  }

  // Pregnant women recommendations
  if (temperature >= 30) {
    recommendations.push({
      text: '🤰 Evitar sobrecalentamiento - riesgo fetal',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '💧 Hidratación extra para embarazadas',
      action: 'Esencial',
      priority: 'high',
    });
  }

  return recommendations;
}

/**
 * Generate water safety and hydration recommendations
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of water safety recommendations
 */
export function getWaterSafetyRecommendations(weatherData) {
  const { temperature, humidity } = weatherData;
  const recommendations = [];

  // WHO guidelines for hydration during heat stress
  if (temperature >= 30) {
    recommendations.push({
      text: '💧 Beber agua antes de sentir sed (WHO recomienda)',
      action: 'Esencial',
      priority: 'high',
    });
    recommendations.push({
      text: '🥤 Evitar alcohol y cafeína - aumentan deshidratación',
      action: 'Recomendado',
      priority: 'high',
    });
    recommendations.push({
      text: '🧂 Considerar bebidas con electrolitos si sudas mucho',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '🍉 Consumir frutas con alto contenido de agua',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '⏰ Hidratación programada cada 15-20 minutos',
      action: 'Esencial',
      priority: 'high',
    });
  }

  // WHO guidelines for dry air conditions
  if (humidity < 30) {
    recommendations.push({
      text: '💧 Hidratación extra por aire seco (WHO)',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '👄 Usar bálsamo labial para prevenir grietas',
      action: 'Recomendado',
      priority: 'medium',
    });
    recommendations.push({
      text: '👁️ Gotas para ojos secos si es necesario',
      action: 'Considerar',
      priority: 'low',
    });
  }

  // WHO guidelines for extreme heat (>35°C)
  if (temperature >= 35) {
    recommendations.push({
      text: '🚨 Hidratación médica supervisada si hay síntomas graves',
      action: 'Crítico',
      priority: 'high',
    });
    recommendations.push({
      text: '🏥 Buscar atención médica si hay signos de deshidratación severa',
      action: 'Crítico',
      priority: 'high',
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
  if (!weatherData)
    return {
      clothing: [],
      equipment: [],
      health: [],
      sunscreen: [],
      heatStress: [],
      airQuality: [],
      workplaceSafety: [],
      vulnerablePopulations: [],
      waterSafety: [],
    };

  const clothing = getClothingRecommendations(weatherData);
  const equipment = getEquipmentRecommendations(weatherData);
  const health = getHealthRecommendations(weatherData);
  const sunscreen = getSunscreenRecommendations(weatherData);
  const heatStress = getHeatStressRecommendations(weatherData);
  const airQuality = getAirQualityRecommendations(weatherData);
  const workplaceSafety = getWorkplaceSafetyRecommendations(weatherData);
  const vulnerablePopulations =
    getVulnerablePopulationRecommendations(weatherData);
  const waterSafety = getWaterSafetyRecommendations(weatherData);

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
    sunscreen: sunscreen.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    heatStress: heatStress.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    airQuality: airQuality.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    workplaceSafety: workplaceSafety.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    vulnerablePopulations: vulnerablePopulations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    waterSafety: waterSafety.sort((a, b) => {
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
