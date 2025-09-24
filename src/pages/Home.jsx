import AlertBox from '../components/AlertBox';
import StatAccordion from '../components/StatAccordion';
import { useEffect, useState } from 'react';
import {
  fetchAllWeatherData,
  fetchPrecipitationProbability,
} from '../utils/openMeteo';
import { defaultLocation } from '../data/locations';
import { getWeatherDescription } from '../utils/recommendations';
import {
  getWeatherDataForPeriod,
  processWeatherAlerts,
  prepareRecommendationData,
  getTimePeriodOptions,
} from '../utils/weatherData';
import {
  processRecommendationsForDisplay,
  mapRecommendationsToStats,
} from '../utils/recommendationHelpers';
import {
  findLocationById,
  getLocationOptions,
  formatCoordinates,
} from '../utils/locationHelpers';
import { generateMapUrl } from '../utils/mapHelpers';
import '../styles/global.css';
import '../styles/Home.css';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [weather, setWeather] = useState(null);
  const [rainProb, setRainProb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('now'); // 'now', 'next', 'next3h'

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [weatherData, rainData] = await Promise.all([
          fetchAllWeatherData(selectedLocation.lat, selectedLocation.lon),
          fetchPrecipitationProbability(
            selectedLocation.lat,
            selectedLocation.lon
          ),
        ]);
        setWeather(weatherData);
        setRainProb(rainData);
        setLoading(false);
      } catch (err) {
        setError('No se pudo obtener datos del clima.');
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedLocation]);

  // Process data using utility functions
  const alertas = processWeatherAlerts(weather);
  const weatherData = getWeatherDataForPeriod(
    selectedTimePeriod,
    weather,
    rainProb
  );
  const recommendationData = prepareRecommendationData(weatherData);
  const recommendations = processRecommendationsForDisplay(recommendationData);
  const mappedRecommendations = mapRecommendationsToStats(
    recommendations,
    weatherData
  );
  const weatherDescription = getWeatherDescription(weatherData.weathercode);
  const coordinates = formatCoordinates(selectedLocation);
  const locationOptions = getLocationOptions();
  const timePeriodOptions = getTimePeriodOptions();
  const mapUrl = generateMapUrl(selectedLocation);

  return (
    <div className='home-root'>
      <main className='home-main'>
        <div className='main-content'>
          {/* Left Section - Map */}
          <section className='home-left-section'>
            <div className='card card--pad'>
              {/* Location Selector with Coordinates */}
              <div className='location-section'>
                <div className='location-header'>
                  <span className='location-label'>📍 Ubicación:</span>
                  <select
                    className='location-dropdown'
                    value={selectedLocation.id}
                    onChange={e => {
                      const location = findLocationById(e.target.value);
                      setSelectedLocation(location);
                    }}
                  >
                    {locationOptions.map(option => (
                      <option key={option.key} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='coordinates-row'>
                  <div className='coordinate-item'>
                    <span className='coordinate-icon'>🌐</span>
                    <div className='coordinate-details'>
                      <span className='coordinate-label'>Latitud</span>
                      <span className='coordinate-value'>
                        {coordinates.latitude}°
                      </span>
                    </div>
                  </div>
                  <div className='coordinate-item'>
                    <span className='coordinate-icon'>🌐</span>
                    <div className='coordinate-details'>
                      <span className='coordinate-label'>Longitud</span>
                      <span className='coordinate-value'>
                        {coordinates.longitude}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='home-time-controls'>
                {timePeriodOptions.map(option => (
                  <button
                    key={option.value}
                    className={`kbd home-time-kbd ${selectedTimePeriod === option.value ? 'active' : ''}`}
                    onClick={() => setSelectedTimePeriod(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Map */}
              <iframe
                className='map-frame'
                title={`Mapa ${selectedLocation.name}`}
                src={mapUrl}
                key={`map-${selectedLocation.id}-${selectedLocation.lat}-${selectedLocation.lon}`}
              ></iframe>
            </div>
          </section>

          {/* Right Section - Stats and Alerts */}
          <section className='home-right-section'>
            {/* Stat Cards Accordion */}
            <StatAccordion
              loading={loading}
              error={error}
              recommendations={mappedRecommendations}
              cards={
                loading || error
                  ? []
                  : [
                      {
                        icon: '🌡️',
                        label: 'Temperatura',
                        statKey: 'temperature',
                        value: weatherData.temperature
                          ? `${weatherData.temperature}°C`
                          : '—',
                        description: weatherData.weathercode
                          ? `${weatherDescription} (${weatherData.timeLabel})`
                          : 'Condiciones actuales',
                      },
                      {
                        icon: '🌧️',
                        label: 'Probabilidad de Lluvia',
                        statKey: 'rainProbability',
                        value:
                          weatherData.rainProbability !== undefined
                            ? `${weatherData.rainProbability}%`
                            : '—',
                        description:
                          weatherData.rainProbability > 50
                            ? 'Lleva paraguas contigo'
                            : weatherData.rainProbability > 20
                              ? 'Posible llovizna'
                              : 'Sin precipitaciones',
                      },
                      {
                        icon: '💨',
                        label: 'Velocidad del Viento',
                        statKey: 'windspeed',
                        value: weatherData.windspeed
                          ? `${weatherData.windspeed} km/h`
                          : '—',
                        description:
                          weatherData.windspeed > 20
                            ? 'Viento fuerte - ten cuidado'
                            : weatherData.windspeed > 10
                              ? 'Brisa moderada'
                              : 'Viento suave',
                      },
                      {
                        icon: '💧',
                        label: 'Humedad Relativa',
                        statKey: 'humidity',
                        value:
                          weatherData.humidity !== undefined
                            ? `${weatherData.humidity}%`
                            : '—',
                        description:
                          weatherData.humidity > 80
                            ? 'Muy húmedo'
                            : weatherData.humidity > 60
                              ? 'Humedad moderada'
                              : weatherData.humidity > 30
                                ? 'Humedad baja'
                                : 'Muy seco',
                      },
                      {
                        icon: '📊',
                        label: 'Presión Atmosférica',
                        statKey: 'pressure',
                        value:
                          weatherData.pressure !== undefined
                            ? `${weatherData.pressure} hPa`
                            : '—',
                        description:
                          weatherData.pressure > 1020
                            ? 'Alta presión - buen tiempo'
                            : weatherData.pressure > 1000
                              ? 'Presión normal'
                              : 'Baja presión - posible cambio',
                      },
                      {
                        icon: '☀️',
                        label: 'Índice UV',
                        statKey: 'uvIndex',
                        value:
                          weatherData.uvIndex !== undefined &&
                          weatherData.uvIndex !== null
                            ? `${weatherData.uvIndex.toFixed(1)}`
                            : '—',
                        description:
                          weatherData.uvIndex >= 8
                            ? 'Muy alto - evita el sol'
                            : weatherData.uvIndex >= 6
                              ? 'Alto - usa protector solar'
                              : weatherData.uvIndex >= 3
                                ? 'Moderado - protección básica'
                                : 'Bajo - exposición segura',
                      },
                    ]
              }
            />

            {/* Alert Boxes */}
            <div className='alert-stack'>
              {alertas.length > 0 && (
                <AlertBox
                  title='⚠️ Alerta - Emergencia'
                  items={alertas}
                  tone='alert'
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
