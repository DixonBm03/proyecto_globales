/**
 * Fetch precipitation probability (rain probability) for a given location.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object|null>} Precipitation probability data or null on error
 */
export async function fetchPrecipitationProbability(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation_probability`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching precipitation probability:', error);
    return null;
  }
}
/**
 * Fetch air quality data (e.g., PM10, PM2.5, ozone, etc.) for a given location.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string[]} variables - Array of air quality variable names (e.g., ["pm10", "pm2_5", "ozone"])
 * @returns {Promise<Object|null>} Air quality data or null on error
 */
export async function fetchAirQuality(
  latitude,
  longitude,
  variables = [
    'pm10',
    'pm2_5',
    'carbon_monoxide',
    'nitrogen_dioxide',
    'sulphur_dioxide',
    'ozone',
    'dust',
    'uv_index',
  ]
) {
  const vars = variables.join(',');
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=${vars}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return null;
  }
}

/**
 * Fetch current air quality index (AQI) for a given location (if available).
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object|null>} AQI data or null on error
 */
export async function fetchCurrentAQI(latitude, longitude) {
  // The Open Meteo Air Quality API provides hourly AQI, so fetch the latest hour
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi,eu_aqi`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching AQI:', error);
    return null;
  }
}
// Utility functions for interacting with the Open Meteo API

/**
 * Fetch current weather data (temperature, wind, etc.) for a given location.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object|null>} Weather data or null on error
 */
export async function fetchCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return null;
  }
}

/**
 * Fetch hourly weather data (temperature, humidity, wind, pressure) for a given location.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string[]} variables - Array of variable names (e.g., ["temperature_2m", "relative_humidity_2m"])
 * @returns {Promise<Object|null>} Hourly weather data or null on error
 */
export async function fetchHourlyWeather(
  latitude,
  longitude,
  variables = [
    'temperature_2m',
    'relative_humidity_2m',
    'windspeed_10m',
    'surface_pressure',
  ]
) {
  const vars = variables.join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${vars}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching hourly weather:', error);
    return null;
  }
}

/**
 * Fetch weather alerts for a given location (if available).
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object|null>} Weather alerts data or null on error
 */
export async function fetchWeatherAlerts(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&weather_alerts=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    return null;
  }
}

/**
 * General function to fetch both current and hourly weather, and alerts in one call.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string[]} hourlyVars
 * @returns {Promise<Object|null>} Combined weather data or null on error
 */
export async function fetchAllWeatherData(
  latitude,
  longitude,
  hourlyVars = [
    'temperature_2m',
    'relative_humidity_2m',
    'windspeed_10m',
    'surface_pressure',
  ]
) {
  const vars = hourlyVars.join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=${vars}&weather_alerts=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching all weather data:', error);
    return null;
  }
}
