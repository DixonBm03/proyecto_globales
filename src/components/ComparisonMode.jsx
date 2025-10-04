// Comparison mode component for comparing weather data between locations
import React, { useState, useEffect } from 'react';
import { getLocationOptions, findLocationById } from '../utils/locationHelpers';
import {
  fetchHistoricalWeather,
  formatHistoricalData,
} from '../utils/historicalWeather';
import StatisticsCard from './StatisticsCard';
import EnhancedLineChart from './EnhancedLineChart';

export default function ComparisonMode({
  primaryLocation,
  primaryData,
  onClose,
}) {
  const [secondaryLocation, setSecondaryLocation] = useState('');
  const [secondaryData, setSecondaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('temperature'); // Track which chart to show

  const locationOptions = getLocationOptions();

  useEffect(() => {
    if (secondaryLocation && primaryData) {
      loadSecondaryData();
    }
  }, [secondaryLocation, primaryData]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSecondaryData = async () => {
    const location = findLocationById(secondaryLocation);
    if (!location) {
      setError('Ubicación no encontrada');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the same date range as primary data
      const startDate = primaryData.rawData.time[0];
      const endDate =
        primaryData.rawData.time[primaryData.rawData.time.length - 1];

      const rawData = await fetchHistoricalWeather(
        location.lat,
        location.lon,
        startDate,
        endDate
      );

      if (!rawData) {
        throw new Error('No se pudieron obtener los datos de comparación');
      }

      const formattedData = formatHistoricalData(rawData);

      if (!formattedData) {
        throw new Error('Error al procesar los datos de comparación');
      }

      setSecondaryData(formattedData);
    } catch (err) {
      console.error('Error loading secondary data:', err);
      setError(err.message || 'Error al cargar datos de comparación');
    } finally {
      setLoading(false);
    }
  };

  const renderComparisonCards = () => {
    if (!primaryData || !secondaryData) return null;

    const primary = primaryData.stats;
    const secondary = secondaryData.stats;

    const tempDiff = primary.avgTemp - secondary.avgTemp;
    const precipDiff =
      primary.totalPrecipitation - secondary.totalPrecipitation;
    const windDiff = primary.avgWindSpeed - secondary.avgWindSpeed;
    const humidityDiff = primary.avgHumidity - secondary.avgHumidity;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          onClick={() => setActiveChart('temperature')}
          style={{ cursor: 'pointer' }}
        >
          <StatisticsCard
            title='Diferencia de Temperatura'
            value={tempDiff}
            unit='°C'
            subtitle={`${primary.avgTemp.toFixed(1)}°C vs ${secondary.avgTemp.toFixed(1)}°C`}
            color={tempDiff > 0 ? '#ef4444' : '#3b82f6'}
            icon={tempDiff > 0 ? '🔥' : '❄️'}
            style={{
              border:
                activeChart === 'temperature'
                  ? '2px solid #f59e0b'
                  : '1px solid #e5e7eb',
              transform:
                activeChart === 'temperature' ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          />
        </div>

        <div
          onClick={() => setActiveChart('precipitation')}
          style={{ cursor: 'pointer' }}
        >
          <StatisticsCard
            title='Diferencia de Precipitación'
            value={precipDiff}
            unit=' mm'
            subtitle={`${primary.totalPrecipitation.toFixed(1)}mm vs ${secondary.totalPrecipitation.toFixed(1)}mm`}
            color={precipDiff > 0 ? '#3b82f6' : '#f59e0b'}
            icon={precipDiff > 0 ? '🌧️' : '☀️'}
            style={{
              border:
                activeChart === 'precipitation'
                  ? '2px solid #3b82f6'
                  : '1px solid #e5e7eb',
              transform:
                activeChart === 'precipitation' ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          />
        </div>

        <div
          onClick={() => setActiveChart('wind')}
          style={{ cursor: 'pointer' }}
        >
          <StatisticsCard
            title='Diferencia de Viento'
            value={windDiff}
            unit=' km/h'
            subtitle={`${primary.avgWindSpeed.toFixed(1)}km/h vs ${secondary.avgWindSpeed.toFixed(1)}km/h`}
            color={windDiff > 0 ? '#10b981' : '#8b5cf6'}
            icon={windDiff > 0 ? '💨' : '🌤️'}
            style={{
              border:
                activeChart === 'wind'
                  ? '2px solid #10b981'
                  : '1px solid #e5e7eb',
              transform: activeChart === 'wind' ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          />
        </div>

        <div
          onClick={() => setActiveChart('humidity')}
          style={{ cursor: 'pointer' }}
        >
          <StatisticsCard
            title='Diferencia de Humedad'
            value={humidityDiff}
            unit='%'
            subtitle={`${primary.avgHumidity.toFixed(1)}% vs ${secondary.avgHumidity.toFixed(1)}%`}
            color={humidityDiff > 0 ? '#8b5cf6' : '#f59e0b'}
            icon={humidityDiff > 0 ? '💧' : '🏜️'}
            style={{
              border:
                activeChart === 'humidity'
                  ? '2px solid #8b5cf6'
                  : '1px solid #e5e7eb',
              transform:
                activeChart === 'humidity' ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          />
        </div>
      </div>
    );
  };

  const renderComparisonChart = () => {
    if (!primaryData || !secondaryData) return null;

    const primaryLocationName =
      findLocationById(primaryLocation)?.name || 'Ubicación 1';
    const secondaryLocationName =
      findLocationById(secondaryLocation)?.name || 'Ubicación 2';

    switch (activeChart) {
      case 'temperature':
        return renderTemperatureChart(
          primaryLocationName,
          secondaryLocationName
        );
      case 'precipitation':
        return renderPrecipitationChart(
          primaryLocationName,
          secondaryLocationName
        );
      case 'wind':
        return renderWindChart(primaryLocationName, secondaryLocationName);
      case 'humidity':
        return renderHumidityChart(primaryLocationName, secondaryLocationName);
      default:
        return renderTemperatureChart(
          primaryLocationName,
          secondaryLocationName
        );
    }
  };

  const renderTemperatureChart = (
    primaryLocationName,
    secondaryLocationName
  ) => {
    const tempSeries = [
      {
        data: primaryData.chartData.temperature.map(item => item.mean),
        color: '#f59e0b',
        label: primaryLocationName,
      },
      {
        data: secondaryData.chartData.temperature.map(item => item.mean),
        color: '#3b82f6',
        label: secondaryLocationName,
      },
    ];

    const minTemp = Math.min(
      ...primaryData.chartData.temperature.map(item => item.min),
      ...secondaryData.chartData.temperature.map(item => item.min)
    );
    const maxTemp = Math.max(
      ...primaryData.chartData.temperature.map(item => item.max),
      ...secondaryData.chartData.temperature.map(item => item.max)
    );

    return (
      <EnhancedLineChart
        series={tempSeries}
        min={Math.floor(minTemp - 2)}
        max={Math.ceil(maxTemp + 2)}
        height={250}
        title='Comparación de Temperaturas'
        showLegend={true}
        showTooltip={true}
        yAxisLabel='Temperatura (°C)'
        xAxisLabels={primaryData.chartData.temperature.map(item => item.date)}
      />
    );
  };

  const renderPrecipitationChart = (
    primaryLocationName,
    secondaryLocationName
  ) => {
    const precipSeries = [
      {
        data: primaryData.chartData.precipitation.map(item => item.value),
        color: '#3b82f6',
        label: primaryLocationName,
      },
      {
        data: secondaryData.chartData.precipitation.map(item => item.value),
        color: '#10b981',
        label: secondaryLocationName,
      },
    ];

    const maxPrecip = Math.max(
      ...primaryData.chartData.precipitation.map(item => item.value),
      ...secondaryData.chartData.precipitation.map(item => item.value)
    );

    return (
      <EnhancedLineChart
        series={precipSeries}
        min={0}
        max={Math.ceil(maxPrecip * 1.1)}
        height={250}
        title='Comparación de Precipitación'
        showLegend={true}
        showTooltip={true}
        yAxisLabel='Precipitación (mm)'
        xAxisLabels={primaryData.chartData.precipitation.map(item => item.date)}
      />
    );
  };

  const renderWindChart = (primaryLocationName, secondaryLocationName) => {
    const windSeries = [
      {
        data: primaryData.chartData.wind.map(item => item.speed),
        color: '#10b981',
        label: primaryLocationName,
      },
      {
        data: secondaryData.chartData.wind.map(item => item.speed),
        color: '#8b5cf6',
        label: secondaryLocationName,
      },
    ];

    const maxWind = Math.max(
      ...primaryData.chartData.wind.map(item => item.speed),
      ...secondaryData.chartData.wind.map(item => item.speed)
    );

    return (
      <EnhancedLineChart
        series={windSeries}
        min={0}
        max={Math.ceil(maxWind * 1.1)}
        height={250}
        title='Comparación de Velocidad del Viento'
        showLegend={true}
        showTooltip={true}
        yAxisLabel='Velocidad del Viento (km/h)'
        xAxisLabels={primaryData.chartData.wind.map(item => item.date)}
      />
    );
  };

  const renderHumidityChart = (primaryLocationName, secondaryLocationName) => {
    const humiditySeries = [
      {
        data: primaryData.chartData.humidity.map(item => item.value),
        color: '#8b5cf6',
        label: primaryLocationName,
      },
      {
        data: secondaryData.chartData.humidity.map(item => item.value),
        color: '#f59e0b',
        label: secondaryLocationName,
      },
    ];

    return (
      <EnhancedLineChart
        series={humiditySeries}
        min={0}
        max={100}
        height={250}
        title='Comparación de Humedad Relativa'
        showLegend={true}
        showTooltip={true}
        yAxisLabel='Humedad Relativa (%)'
        xAxisLabels={primaryData.chartData.humidity.map(item => item.date)}
      />
    );
  };

  return (
    <div className='card card--pad'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 className='h2' style={{ margin: 0 }}>
          🔍 Modo Comparación
        </h2>
        {onClose && (
          <button
            className='btn'
            onClick={onClose}
            style={{ fontSize: '14px', padding: '6px 12px' }}
          >
            Cerrar
          </button>
        )}
      </div>

      {/* Location Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Comparar con:
        </label>
        <select
          value={secondaryLocation}
          onChange={e => setSecondaryLocation(e.target.value)}
          className='input-field'
          style={{ width: '100%' }}
        >
          <option value=''>Selecciona una ubicación</option>
          {locationOptions
            .filter(option => option.value !== primaryLocation)
            .map(option => (
              <option key={option.key} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '16px', marginBottom: '12px' }}>
            Cargando datos de comparación...
          </div>
          <div
            style={{
              width: '30px',
              height: '30px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #2eaadc',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          ></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{ fontSize: '16px', color: '#dc2626', marginBottom: '8px' }}
          >
            Error al cargar datos
          </div>
          <div style={{ color: '#6b7280' }}>{error}</div>
        </div>
      )}

      {/* Comparison Results */}
      {secondaryData && !loading && !error && (
        <>
          <div
            style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            💡 Haz clic en cualquier tarjeta para ver su gráfico de comparación
          </div>
          {renderComparisonCards()}
          {renderComparisonChart()}
        </>
      )}

      {/* Instructions */}
      {!secondaryLocation && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#6b7280',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            📊 Selecciona una ubicación para comparar
          </div>
          <div style={{ fontSize: '14px' }}>
            Compara los datos meteorológicos entre diferentes ubicaciones
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
