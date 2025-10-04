import React, { useState, useEffect, useCallback } from 'react';
import { getLocationOptions, findLocationById } from '../utils/locationHelpers';
import {
  fetchHistoricalWeather,
  formatHistoricalData,
  getDateRangeOptions,
  getCacheKey,
  cacheData,
  getCachedData,
  fetchHistoricalClimateData,
  calculateClimateAnomalies,
} from '../utils/historicalWeather';
import {
  useErrorMonitoring,
  ERROR_TYPES,
  ERROR_SEVERITY,
} from '../utils/errorHandling';
import { usePerformanceMonitor } from '../utils/performanceUtils';
import { useScreenReader } from '../utils/accessibilityUtils';
import EnhancedLineChart from '../components/EnhancedLineChart';
import BarChart from '../components/BarChart';
import StatisticsCard from '../components/StatisticsCard';
import DataTable from '../components/DataTable';
import ClimateInsights from '../components/ClimateInsights';
import ComparisonMode from '../components/ComparisonMode';

export default function HistoricalWeather() {
  // State management
  const [selectedLocation, setSelectedLocation] = useState('san-jose');
  const [dateRange, setDateRange] = useState('month');
  const [weatherData, setWeatherData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [climateAnomalies, setClimateAnomalies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [climateLoading, setClimateLoading] = useState(false);
  const [error, setError] = useState(null);

  // Advanced features state
  const [showCharts, setShowCharts] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showClimateInsights, setShowClimateInsights] = useState(false);

  // Error monitoring and performance tracking
  const { logError, isOnline } = useErrorMonitoring('HistoricalWeather');
  const { logPerformance } = usePerformanceMonitor('HistoricalWeather');
  const { announce } = useScreenReader();

  // Get date range options
  const dateRangeOptions = getDateRangeOptions();
  const locationOptions = getLocationOptions();

  // Load data when location or date range changes
  useEffect(() => {
    loadWeatherData();
  }, [selectedLocation, dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadWeatherData = useCallback(async () => {
    const startTime = performance.now();

    try {
      const location = findLocationById(selectedLocation);
      if (!location) {
        const error = new Error('Ubicación no encontrada');
        logError(error, ERROR_TYPES.VALIDATION_ERROR, ERROR_SEVERITY.MEDIUM);
        setError('Ubicación no encontrada');
        return;
      }

      // Check online status
      if (!isOnline) {
        const error = new Error('Sin conexión a internet');
        logError(error, ERROR_TYPES.NETWORK_ERROR, ERROR_SEVERITY.HIGH);
        setError('Sin conexión a internet. Verifica tu conexión.');
        return;
      }

      // Determine date range
      const rangeOption = dateRangeOptions.find(opt => opt.value === dateRange);
      if (!rangeOption) return;
      const startDate = rangeOption.startDate;
      const endDate = rangeOption.endDate;

      // Check cache first
      const cacheKey = getCacheKey(selectedLocation, startDate, endDate);
      const cachedData = getCachedData(cacheKey);

      if (cachedData) {
        setWeatherData(cachedData);
        announce('Datos del clima cargados desde caché');
        logPerformance('Cache hit');
        return;
      }

      setLoading(true);
      setError(null);
      announce('Cargando datos del clima...');

      const rawData = await fetchHistoricalWeather(
        location.lat,
        location.lon,
        startDate,
        endDate
      );

      if (!rawData) {
        throw new Error('No se pudieron obtener los datos del clima');
      }

      const formattedData = formatHistoricalData(rawData);

      if (!formattedData) {
        throw new Error('Error al procesar los datos del clima');
      }

      // Cache the data
      cacheData(cacheKey, formattedData);

      setWeatherData(formattedData);
      announce('Datos del clima cargados exitosamente');

      // Load climate data for comparison
      loadClimateData(location, startDate, endDate, formattedData);
    } catch (err) {
      console.error('Error loading weather data:', err);
      logError(err, ERROR_TYPES.API_ERROR, ERROR_SEVERITY.HIGH);
      setError(err.message || 'Error al cargar los datos del clima');
      announce('Error al cargar los datos del clima');
    } finally {
      setLoading(false);
      const duration = performance.now() - startTime;
      logPerformance(`Weather data load completed in ${duration.toFixed(2)}ms`);
    }
  }, [
    selectedLocation,
    dateRange,
    isOnline,
    logError,
    logPerformance,
    announce,
    dateRangeOptions,
  ]);

  const loadClimateData = async (location, startDate, endDate, currentData) => {
    if (!currentData || currentData.days < 3) {
      setClimateAnomalies(null);
      setHistoricalData(null);
      return;
    }

    setClimateLoading(true);

    try {
      // Calculate historical period (same period, previous year)
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      const historicalStartDate = new Date(
        startDateObj.getFullYear() - 1,
        startDateObj.getMonth(),
        startDateObj.getDate()
      );
      const historicalEndDate = new Date(
        endDateObj.getFullYear() - 1,
        endDateObj.getMonth(),
        endDateObj.getDate()
      );

      const historicalRawData = await fetchHistoricalClimateData(
        location.lat,
        location.lon,
        historicalStartDate.toISOString().split('T')[0],
        historicalEndDate.toISOString().split('T')[0]
      );

      if (historicalRawData) {
        const historicalFormattedData = formatHistoricalData(historicalRawData);
        setHistoricalData(historicalFormattedData);

        // Calculate climate anomalies
        const anomalies = calculateClimateAnomalies(
          currentData,
          historicalFormattedData
        );
        setClimateAnomalies(anomalies);
      }
    } catch (err) {
      console.error('Error loading climate data:', err);
      // Don't set error for climate data as it's optional
    } finally {
      setClimateLoading(false);
    }
  };

  const handleLocationChange = e => {
    setSelectedLocation(e.target.value);
  };

  const handleDateRangeChange = e => {
    setDateRange(e.target.value);
  };

  const renderSummaryCards = () => {
    if (!weatherData) return null;

    const { stats } = weatherData;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatisticsCard
          title='Temperatura Promedio'
          value={stats.avgTemp}
          unit='°C'
          subtitle={`Rango: ${stats.minTemp.toFixed(1)}° - ${stats.maxTemp.toFixed(1)}°C`}
          color='#f59e0b'
          icon='🌡️'
        />

        <StatisticsCard
          title='Precipitación Total'
          value={stats.totalPrecipitation}
          unit=' mm'
          subtitle={`Promedio: ${(stats.totalPrecipitation / weatherData.days).toFixed(1)} mm/día`}
          color='#3b82f6'
          icon='🌧️'
        />

        <StatisticsCard
          title='Velocidad del Viento'
          value={stats.avgWindSpeed}
          unit=' km/h'
          subtitle={`Máxima: ${stats.maxWindSpeed.toFixed(1)} km/h`}
          color='#10b981'
          icon='💨'
        />

        <StatisticsCard
          title='Humedad Relativa'
          value={stats.avgHumidity}
          unit='%'
          subtitle={`Presión: ${stats.avgPressure.toFixed(1)} hPa`}
          color='#8b5cf6'
          icon='💧'
        />
      </div>
    );
  };

  const renderCharts = () => {
    if (!weatherData || !weatherData.chartData) return null;

    const { chartData } = weatherData;

    // Temperature chart with min/max bands
    const tempSeries = [
      {
        data: chartData.temperature.map(item => item.max),
        color: '#ef4444',
        label: 'Máxima',
      },
      {
        data: chartData.temperature.map(item => item.mean),
        color: '#f59e0b',
        label: 'Promedio',
      },
      {
        data: chartData.temperature.map(item => item.min),
        color: '#3b82f6',
        label: 'Mínima',
      },
    ];

    const minTemp = Math.min(...chartData.temperature.map(item => item.min));
    const maxTemp = Math.max(...chartData.temperature.map(item => item.max));
    const maxPrecipitation = Math.max(
      ...chartData.precipitation.map(item => item.value)
    );

    return (
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Temperature Chart */}
        <EnhancedLineChart
          series={tempSeries}
          min={Math.floor(minTemp - 2)}
          max={Math.ceil(maxTemp + 2)}
          height={250}
          title='Tendencia de Temperatura (°C)'
          showLegend={true}
          showTooltip={true}
          yAxisLabel='Temperatura (°C)'
          xAxisLabels={chartData.temperature.map(item => item.date)}
        />

        {/* Precipitation Chart */}
        <BarChart
          data={chartData.precipitation.map(item => item.value)}
          max={Math.ceil(maxPrecipitation * 1.1)}
          height={200}
          title='Precipitación Diaria (mm)'
          color='#3b82f6'
          showValues={true}
          showTooltip={true}
          yAxisLabel='Precipitación (mm)'
          xAxisLabels={chartData.precipitation.map(item => item.date)}
        />

        {/* Humidity Chart */}
        <EnhancedLineChart
          data={chartData.humidity.map(item => item.value)}
          min={0}
          max={100}
          height={200}
          title='Humedad Relativa (%)'
          showTooltip={true}
          showLegend={false}
          yAxisLabel='Humedad (%)'
          xAxisLabels={chartData.humidity.map(item => item.date)}
        />
      </div>
    );
  };

  const renderDataTable = () => {
    if (!weatherData || !weatherData.chartData) return null;

    const { chartData } = weatherData;

    // Prepare table data
    const tableData = chartData.temperature.map((tempItem, index) => ({
      date: tempItem.date,
      tempMax: tempItem.max,
      tempMin: tempItem.min,
      tempAvg: tempItem.mean,
      precipitation: chartData.precipitation[index]?.value || 0,
      windSpeed: chartData.wind[index]?.speed || 0,
      windDirection: chartData.wind[index]?.direction || 0,
      humidity: chartData.humidity[index]?.value || 0,
    }));

    const columns = [
      { field: 'date', header: 'Fecha', type: 'date' },
      { field: 'tempMax', header: 'Temp. Máx', type: 'temperature' },
      { field: 'tempMin', header: 'Temp. Mín', type: 'temperature' },
      { field: 'tempAvg', header: 'Temp. Prom', type: 'temperature' },
      {
        field: 'precipitation',
        header: 'Precipitación',
        type: 'precipitation',
      },
      { field: 'windSpeed', header: 'Viento', type: 'wind' },
      { field: 'humidity', header: 'Humedad', type: 'humidity' },
    ];

    return (
      <DataTable
        data={tableData}
        columns={columns}
        title='Datos Diarios Detallados'
        showSearch={true}
        pageSize={15}
      />
    );
  };

  const renderControls = () => (
    <div className='card card--pad' style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end',
        }}
      >
        {/* Location Selector */}
        <div>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            Ubicación
          </label>
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className='input-field'
            style={{ width: '100%' }}
          >
            {locationOptions.map(option => (
              <option key={option.key} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Selector */}
        <div>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            Período
          </label>
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className='input-field'
            style={{ width: '100%' }}
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Controls */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          className='btn'
          onClick={() => setShowCharts(!showCharts)}
          style={{ fontSize: '14px', padding: '6px 12px' }}
        >
          📈 {showCharts ? 'Ocultar' : 'Mostrar'} Gráficos
        </button>

        <button
          className='btn'
          onClick={() => setShowDataTable(!showDataTable)}
          style={{ fontSize: '14px', padding: '6px 12px' }}
        >
          📋 {showDataTable ? 'Ocultar' : 'Mostrar'} Tabla
        </button>

        <button
          className='btn'
          onClick={() => setShowComparison(!showComparison)}
          style={{ fontSize: '14px', padding: '6px 12px' }}
        >
          🔍 Comparar
        </button>

        <button
          className='btn'
          onClick={() => setShowClimateInsights(!showClimateInsights)}
          style={{ fontSize: '14px', padding: '6px 12px' }}
        >
          📊 Análisis Climático
        </button>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div
      className='card card--pad'
      style={{ textAlign: 'center', padding: '40px' }}
    >
      <div style={{ fontSize: '18px', marginBottom: '16px' }}>
        Cargando datos del clima...
      </div>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2eaadc',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto',
        }}
      ></div>
    </div>
  );

  const renderErrorState = () => (
    <div
      className='card card--pad'
      style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
      }}
    >
      <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '16px' }}>
        Error al cargar los datos
      </div>
      <div style={{ color: '#6b7280', marginBottom: '16px' }}>{error}</div>
      <button
        className='btn'
        onClick={loadWeatherData}
        style={{ marginTop: '8px' }}
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <section className='page'>
      <h1 className='h1'>Datos Históricos del Clima</h1>
      <p className='lead'>
        Explora los datos históricos del clima para las principales ciudades de
        Costa Rica. Selecciona una ubicación y período para ver las tendencias
        meteorológicas.
      </p>

      <div
        style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#0369a1',
        }}
      >
        <strong>ℹ️ Nota:</strong> Los datos históricos tienen un retraso de 5
        días. Las fechas disponibles van desde 1940 hasta hace 5 días.
      </div>

      {renderControls()}

      {loading && renderLoadingState()}
      {error && !loading && renderErrorState()}
      {/* Advanced Features */}

      {showComparison && weatherData && (
        <ComparisonMode
          primaryLocation={selectedLocation}
          primaryData={weatherData}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Main Content */}
      {weatherData && !loading && !error && (
        <>
          {renderSummaryCards()}
          {showCharts && renderCharts()}

          {/* Climate Insights */}
          {showClimateInsights && (
            <ClimateInsights
              anomalies={climateAnomalies}
              historicalData={historicalData}
              currentData={weatherData}
              loading={climateLoading}
            />
          )}

          {showDataTable && renderDataTable()}
        </>
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
    </section>
  );
}
