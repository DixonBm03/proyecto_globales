// Weather data processing utilities
// Handles extraction and processing of weather data for different time periods

/**
 * Get weather data for a specific time period
 * @param {string} period - Time period ('now', 'next', 'next3h')
 * @param {Object} weather - Weather data from API
 * @param {Object} rainProb - Rain probability data from API
 * @returns {Object} Processed weather data for the selected period
 */
export function getWeatherDataForPeriod(period, weather, rainProb) {
  const current = weather?.current_weather;
  const hourly = weather?.hourly;

  switch (period) {
    case 'now':
      return {
        temperature: current?.temperature,
        weathercode: current?.weathercode,
        windspeed: current?.windspeed,
        humidity: hourly?.relative_humidity_2m?.[0],
        pressure: hourly?.surface_pressure?.[0],
        rainProbability: rainProb?.hourly?.precipitation_probability?.[0],
        timeLabel: 'Ahora',
      };
    case 'next':
      return {
        temperature: hourly?.temperature_2m?.[1],
        weathercode: hourly?.weathercode?.[1],
        windspeed: hourly?.windspeed_10m?.[1],
        humidity: hourly?.relative_humidity_2m?.[1],
        pressure: hourly?.surface_pressure?.[1],
        rainProbability: rainProb?.hourly?.precipitation_probability?.[1],
        timeLabel: 'Próxima hora',
      };
    case 'next3h':
      return {
        temperature: hourly?.temperature_2m?.[3],
        weathercode: hourly?.weathercode?.[3],
        windspeed: hourly?.windspeed_10m?.[3],
        humidity: hourly?.relative_humidity_2m?.[3],
        pressure: hourly?.surface_pressure?.[3],
        rainProbability: rainProb?.hourly?.precipitation_probability?.[3],
        timeLabel: 'En 3 horas',
      };
    default:
      return {
        temperature: current?.temperature,
        weathercode: current?.weathercode,
        windspeed: current?.windspeed,
        humidity: hourly?.relative_humidity_2m?.[0],
        pressure: hourly?.surface_pressure?.[0],
        rainProbability: rainProb?.hourly?.precipitation_probability?.[0],
        timeLabel: 'Ahora',
      };
  }
}

/**
 * Process weather alerts from API data
 * @param {Object} weather - Weather data from API
 * @returns {Array} Processed alert items
 */
export function processWeatherAlerts(weather) {
  if (
    !weather ||
    !weather.weather_alerts ||
    weather.weather_alerts.length === 0
  ) {
    return [];
  }

  return weather.weather_alerts.map(alert => ({
    text: alert.event,
    action: alert.description || 'Ver',
  }));
}

/**
 * Prepare recommendation data from weather data
 * @param {Object} weatherData - Weather data for selected time period
 * @returns {Object} Data formatted for recommendation engine
 */
export function prepareRecommendationData(weatherData) {
  return {
    temperature: weatherData.temperature,
    weathercode: weatherData.weathercode,
    humidity: weatherData.humidity,
    windspeed: weatherData.windspeed,
  };
}

/**
 * Get time period options for the UI
 * @returns {Array} Array of time period options
 */
export function getTimePeriodOptions() {
  return [
    { value: 'now', label: 'Ahora' },
    { value: 'next', label: 'Próximo' },
    { value: 'next3h', label: 'Siguiente 3 hrs' },
  ];
}
