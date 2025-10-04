/**
 * Historical Weather API integration functions
 * Handles fetching and processing historical weather data from OpenMeteo
 */

/**
 * Fetch historical weather data for a given location and date range
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object|null>} Historical weather data or null on error
 */
export async function fetchHistoricalWeather(
  latitude,
  longitude,
  startDate,
  endDate
) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'temperature_2m_mean',
      'precipitation_sum',
      'windspeed_10m_max',
      'winddirection_10m_dominant',
      'relative_humidity_2m_mean',
      'surface_pressure_mean',
      'cloudcover_mean',
      'uv_index_max',
    ].join(','),
  });

  const url = `https://archive-api.open-meteo.com/v1/archive?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical weather:', error);
    return null;
  }
}

/**
 * Fetch climate change data for long-term trends
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object|null>} Climate data or null on error
 */
export async function fetchClimateData(
  latitude,
  longitude,
  startDate,
  endDate
) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    models: [
      'CMCC_CM2_VHR4',
      'FGOALS_f3_H',
      'HiRAM_SIT_HR',
      'MPI_ESM1_2_XR',
      'NICAM16_8S',
    ].join(','),
    daily: 'temperature_2m_mean,precipitation_sum',
  });

  const url = `https://climate-api.open-meteo.com/v1/climate?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching climate data:', error);
    return null;
  }
}

/**
 * Fetch historical climate data for comparison (past 30 years)
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object|null>} Historical climate data or null on error
 */
export async function fetchHistoricalClimateData(
  latitude,
  longitude,
  startDate,
  endDate
) {
  // For historical climate data, we'll use the archive API with past data
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'temperature_2m_mean',
      'precipitation_sum',
      'windspeed_10m_max',
      'winddirection_10m_dominant',
      'relative_humidity_2m_mean',
      'surface_pressure_mean',
      'cloudcover_mean',
      'uv_index_max',
    ].join(','),
  });

  const url = `https://archive-api.open-meteo.com/v1/archive?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical climate data:', error);
    return null;
  }
}

/**
 * Calculate climate anomalies (differences from historical averages)
 * @param {Object} currentData - Current weather data
 * @param {Object} historicalData - Historical climate data
 * @returns {Object} Climate anomalies and trends
 */
export function calculateClimateAnomalies(currentData, historicalData) {
  if (
    !currentData ||
    !historicalData ||
    !currentData.stats ||
    !historicalData.stats
  ) {
    return null;
  }

  const current = currentData.stats;
  const historical = historicalData.stats;

  return {
    temperatureAnomaly: current.avgTemp - historical.avgTemp,
    precipitationAnomaly:
      current.totalPrecipitation - historical.totalPrecipitation,
    temperatureTrend:
      ((current.avgTemp - historical.avgTemp) / historical.avgTemp) * 100,
    precipitationTrend:
      ((current.totalPrecipitation - historical.totalPrecipitation) /
        historical.totalPrecipitation) *
      100,
    isWarmer: current.avgTemp > historical.avgTemp,
    isWetter: current.totalPrecipitation > historical.totalPrecipitation,
    confidence: calculateConfidenceLevel(currentData.days, historicalData.days),
  };
}

/**
 * Calculate confidence level based on data availability
 * @param {number} currentDays - Number of days in current data
 * @param {number} historicalDays - Number of days in historical data
 * @returns {string} Confidence level (high, medium, low)
 */
function calculateConfidenceLevel(currentDays, historicalDays) {
  // High confidence: 30+ days current, 365+ days historical
  if (currentDays >= 30 && historicalDays >= 365) return 'high';

  // Medium confidence: 7+ days current, 90+ days historical
  if (currentDays >= 7 && historicalDays >= 90) return 'medium';

  // Low confidence: 3+ days current, 30+ days historical
  if (currentDays >= 3 && historicalDays >= 30) return 'low';

  // Very low confidence: less than 3 days or insufficient historical data
  return 'very-low';
}

/**
 * Format and process raw historical weather data
 * @param {Object} rawData - Raw API response data
 * @returns {Object} Formatted data with calculated statistics
 */
export function formatHistoricalData(rawData) {
  if (!rawData || !rawData.daily) {
    return null;
  }

  const { daily } = rawData;
  const days = daily.time.length;

  // Calculate statistics
  const stats = {
    avgTemp: calculateAverage(daily.temperature_2m_mean),
    maxTemp: Math.max(...daily.temperature_2m_max),
    minTemp: Math.min(...daily.temperature_2m_min),
    totalPrecipitation: daily.precipitation_sum.reduce(
      (sum, val) => sum + (val || 0),
      0
    ),
    avgWindSpeed: calculateAverage(daily.windspeed_10m_max),
    maxWindSpeed: Math.max(...daily.windspeed_10m_max),
    avgHumidity: calculateAverage(daily.relative_humidity_2m_mean),
    avgPressure: calculateAverage(daily.surface_pressure_mean),
    avgCloudCover: calculateAverage(daily.cloudcover_mean),
    avgUVIndex: calculateAverage(daily.uv_index_max),
  };

  // Format data for charts
  const chartData = {
    temperature: daily.time.map((date, index) => ({
      date,
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
      mean: daily.temperature_2m_mean[index],
    })),
    precipitation: daily.time.map((date, index) => ({
      date,
      value: daily.precipitation_sum[index] || 0,
    })),
    wind: daily.time.map((date, index) => ({
      date,
      speed: daily.windspeed_10m_max[index],
      direction: daily.winddirection_10m_dominant[index],
    })),
    humidity: daily.time.map((date, index) => ({
      date,
      value: daily.relative_humidity_2m_mean[index],
    })),
  };

  return {
    stats,
    chartData,
    rawData: daily,
    days,
    location: {
      latitude: rawData.latitude,
      longitude: rawData.longitude,
    },
  };
}

/**
 * Calculate weather statistics from data
 * @param {Array} data - Array of weather data points
 * @returns {Object} Calculated statistics
 */
export function calculateWeatherStatistics(data) {
  if (!data || data.length === 0) {
    return null;
  }

  const validData = data.filter(val => val !== null && val !== undefined);

  if (validData.length === 0) {
    return null;
  }

  const sum = validData.reduce((acc, val) => acc + val, 0);
  const avg = sum / validData.length;
  const sorted = [...validData].sort((a, b) => a - b);

  return {
    average: avg,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median: sorted[Math.floor(sorted.length / 2)],
    count: validData.length,
  };
}

/**
 * Helper function to calculate average
 * @param {Array} values - Array of values
 * @returns {number} Average value
 */
function calculateAverage(values) {
  const validValues = values.filter(val => val !== null && val !== undefined);
  if (validValues.length === 0) return 0;
  return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
}

/**
 * Generate date range options for the UI
 * @returns {Array} Array of date range options
 */
export function getDateRangeOptions() {
  const today = new Date();
  // Account for 5-day delay in historical data availability
  const availableEndDate = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
  const formatDate = date => date.toISOString().split('T')[0];

  return [
    {
      label: 'Última semana',
      value: 'week',
      startDate: formatDate(
        new Date(availableEndDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      ),
      endDate: formatDate(availableEndDate),
    },
    {
      label: 'Último mes',
      value: 'month',
      startDate: formatDate(
        new Date(availableEndDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      ),
      endDate: formatDate(availableEndDate),
    },
    {
      label: 'Últimos 3 meses',
      value: '3months',
      startDate: formatDate(
        new Date(availableEndDate.getTime() - 90 * 24 * 60 * 60 * 1000)
      ),
      endDate: formatDate(availableEndDate),
    },
    {
      label: 'Últimos 6 meses',
      value: '6months',
      startDate: formatDate(
        new Date(availableEndDate.getTime() - 180 * 24 * 60 * 60 * 1000)
      ),
      endDate: formatDate(availableEndDate),
    },
  ];
}

/**
 * Cache key generator for localStorage
 * @param {string} locationId - Location identifier
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {string} Cache key
 */
export function getCacheKey(locationId, startDate, endDate) {
  return `historical_weather_${locationId}_${startDate}_${endDate}`;
}

/**
 * Cache data in localStorage
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
 */
export function cacheData(key, data, ttl = 60 * 60 * 1000) {
  const cacheItem = {
    data,
    timestamp: Date.now(),
    ttl,
  };

  try {
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

/**
 * Retrieve cached data from localStorage
 * @param {string} key - Cache key
 * @returns {Object|null} Cached data or null if expired/not found
 */
export function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheItem = JSON.parse(cached);
    const now = Date.now();

    if (now - cacheItem.timestamp > cacheItem.ttl) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheItem.data;
  } catch (error) {
    console.warn('Failed to retrieve cached data:', error);
    return null;
  }
}

/**
 * Bookmark management functions
 */
export function getBookmarks() {
  try {
    const bookmarks = localStorage.getItem('weather_bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.warn('Failed to retrieve bookmarks:', error);
    return [];
  }
}

export function addBookmark(locationId, dateRange, customDates = null) {
  try {
    const bookmarks = getBookmarks();
    const bookmark = {
      id: Date.now().toString(),
      locationId,
      dateRange,
      customDates,
      createdAt: new Date().toISOString(),
      name: generateBookmarkName(locationId, dateRange, customDates),
    };

    bookmarks.push(bookmark);
    localStorage.setItem('weather_bookmarks', JSON.stringify(bookmarks));
    return bookmark;
  } catch (error) {
    console.warn('Failed to add bookmark:', error);
    return null;
  }
}

export function removeBookmark(bookmarkId) {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem('weather_bookmarks', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.warn('Failed to remove bookmark:', error);
    return false;
  }
}

export function generateBookmarkName(locationId, dateRange, customDates) {
  const locationNames = {
    'san-jose': 'San José',
    cartago: 'Cartago',
    alajuela: 'Alajuela',
    heredia: 'Heredia',
  };

  const locationName = locationNames[locationId] || locationId;

  if (customDates) {
    return `${locationName} - ${customDates.start} a ${customDates.end}`;
  }

  const rangeNames = {
    week: 'Última semana',
    month: 'Último mes',
    '3months': 'Últimos 3 meses',
    '6months': 'Últimos 6 meses',
  };

  return `${locationName} - ${rangeNames[dateRange] || dateRange}`;
}
