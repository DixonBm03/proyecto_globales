import AlertBox from '../components/AlertBox';
import StatCard from '../components/StatCard';
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
  shouldShowRecommendations,
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
  const showRecommendations = shouldShowRecommendations(recommendations);
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
              {/* Location Selector */}
              <div className='location-selector'>
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
              <div className='location-info'>
                <div className='coordinate-display'>
                  <div className='coordinate-item'>
                    <span className='coordinate-icon'>📍</span>
                    <div className='coordinate-details'>
                      <span className='coordinate-label'>Latitud</span>
                      <span className='coordinate-value'>
                        {coordinates.latitude}°
                      </span>
                    </div>
                  </div>
                  <div className='coordinate-item'>
                    <span className='coordinate-icon'>📍</span>
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
            {/* Stat Cards */}
            <div className='statcard-row'>
              {loading ? (
                <>
                  <StatCard icon='☁️' label='Cargando...' value='—' />
                  <StatCard icon='🌧️' label='Cargando...' value='—' />
                  <StatCard icon='💨' label='Cargando...' value='—' />
                  <StatCard icon='🫧' label='Cargando...' value='—' />
                  <StatCard icon='🔵' label='Cargando...' value='—' />
                </>
              ) : error ? (
                <StatCard icon='⚠️' label={error} value='—' />
              ) : (
                <>
                  <StatCard
                    icon='☁️'
                    label={
                      weatherData.weathercode
                        ? `${weatherDescription} (${weatherData.timeLabel})`
                        : 'Mayormente nublado'
                    }
                    value={
                      weatherData.temperature
                        ? `${weatherData.temperature}°C`
                        : '—'
                    }
                  />
                  <StatCard
                    icon='🌧️'
                    label='Prob. lluvia'
                    value={
                      weatherData.rainProbability !== undefined
                        ? `${weatherData.rainProbability}%`
                        : '—'
                    }
                  />
                  <StatCard
                    icon='💨'
                    label='Viento'
                    value={
                      weatherData.windspeed
                        ? `${weatherData.windspeed} km/h`
                        : '—'
                    }
                  />
                  <StatCard
                    icon='🫧'
                    label='Humedad'
                    value={
                      weatherData.humidity !== undefined
                        ? `${weatherData.humidity}%`
                        : '—'
                    }
                  />
                  <StatCard
                    icon='🔵'
                    label='Presión'
                    value={
                      weatherData.pressure !== undefined
                        ? `${weatherData.pressure} hPa`
                        : '—'
                    }
                  />
                </>
              )}
            </div>

            {/* Alert Boxes */}
            <div className='alert-stack'>
              {alertas.length > 0 && (
                <AlertBox
                  title='⚠️ Alerta - Emergencia'
                  items={alertas}
                  tone='alert'
                />
              )}

              {showRecommendations.clothing && (
                <AlertBox
                  title='👕 Recomendaciones de Ropa'
                  items={recommendations.clothing}
                  tone='ok'
                />
              )}

              {showRecommendations.equipment && (
                <AlertBox
                  title='🎒 Equipo Recomendado'
                  items={recommendations.equipment}
                  tone='ok'
                />
              )}

              {showRecommendations.health && (
                <AlertBox
                  title='🧴 Cuidado Personal'
                  items={recommendations.health}
                  tone='ok'
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
