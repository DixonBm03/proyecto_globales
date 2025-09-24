// Weather data processing utilities
// Handles extraction and processing of weather data for different time periods

/**
 * Find the hourly index that corresponds to the current weather time
 * @param {Object} weather - Weather data from API
 * @returns {number} Index in hourly arrays
 */
function findCurrentHourlyIndex(weather) {
  if (!weather?.current_weather?.time || !weather?.hourly?.time) {
    return 0;
  }

  const currentTime = new Date(weather.current_weather.time);
  const hourlyTimes = weather.hourly.time;

  // Find the closest hourly time to current time
  let closestIndex = 0;
  let minDiff = Infinity;

  for (let i = 0; i < hourlyTimes.length; i++) {
    const hourlyTime = new Date(hourlyTimes[i]);
    const diff = Math.abs(currentTime - hourlyTime);

    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

/**
 * Get weather data for a specific time period
 * @param {string} period - Time period ('now', 'hour1', 'hour2', etc.)
 * @param {Object} weather - Weather data from API
 * @param {Object} rainProb - Rain probability data from API
 * @returns {Object} Processed weather data for the selected period
 */
export function getWeatherDataForPeriod(period, weather, rainProb) {
  const current = weather?.current_weather;
  const hourly = weather?.hourly;
  const currentIndex = findCurrentHourlyIndex(weather);

  // Handle 'now' case
  if (period === 'now') {
    return {
      temperature: current?.temperature,
      weathercode: current?.weathercode,
      windspeed: current?.windspeed,
      humidity: hourly?.relative_humidity_2m?.[currentIndex],
      pressure: hourly?.surface_pressure?.[currentIndex],
      rainProbability:
        rainProb?.hourly?.precipitation_probability?.[currentIndex],
      uvIndex: hourly?.uv_index?.[currentIndex],
      timeLabel: 'Ahora',
    };
  }

  // Handle hourly cases (hour1, hour2, etc.)
  if (period.startsWith('hour')) {
    const hourOffset = parseInt(period.replace('hour', ''));
    const targetIndex = currentIndex + hourOffset;

    return {
      temperature: hourly?.temperature_2m?.[targetIndex],
      weathercode: hourly?.weathercode?.[targetIndex],
      windspeed: hourly?.windspeed_10m?.[targetIndex],
      humidity: hourly?.relative_humidity_2m?.[targetIndex],
      pressure: hourly?.surface_pressure?.[targetIndex],
      rainProbability:
        rainProb?.hourly?.precipitation_probability?.[targetIndex],
      uvIndex: hourly?.uv_index?.[targetIndex],
      timeLabel: hourOffset === 1 ? 'En 1 hora' : `En ${hourOffset} horas`,
    };
  }

  // Default fallback to current weather
  return {
    temperature: current?.temperature,
    weathercode: current?.weathercode,
    windspeed: current?.windspeed,
    humidity: hourly?.relative_humidity_2m?.[currentIndex],
    pressure: hourly?.surface_pressure?.[currentIndex],
    rainProbability:
      rainProb?.hourly?.precipitation_probability?.[currentIndex],
    uvIndex: hourly?.uv_index?.[currentIndex],
    timeLabel: 'Ahora',
  };
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
    uvIndex: weatherData.uvIndex,
  };
}

/**
 * Get time period options for the UI - hourly from now to next 6 hours
 * @returns {Array} Array of time period options
 */
export function getTimePeriodOptions() {
  const options = [{ value: 'now', label: 'Ahora' }];

  // Add hourly options for the next 6 hours
  for (let i = 1; i <= 6; i++) {
    const hour = i === 1 ? '1 hora' : `${i} horas`;
    options.push({
      value: `hour${i}`,
      label: `+${hour}`,
    });
  }

  return options;
}
