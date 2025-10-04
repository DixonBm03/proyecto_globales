// Climate insights component for displaying climate change data and anomalies
import React from 'react';
import StatisticsCard from './StatisticsCard';

export default function ClimateInsights({
  anomalies,
  historicalData,
  currentData,
  loading = false,
}) {
  if (loading) {
    return (
      <div className='card card--pad'>
        <h2 className='h2'>Análisis Climático</h2>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '16px', marginBottom: '12px' }}>
            Analizando datos climáticos...
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
      </div>
    );
  }

  if (!anomalies || !historicalData || !currentData) {
    return (
      <div className='card card--pad'>
        <h2 className='h2'>Análisis Climático</h2>
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#6b7280',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            📊 Datos climáticos no disponibles
          </div>
          <div style={{ fontSize: '14px' }}>
            Selecciona un período de al menos 3 días para ver el análisis
            climático
          </div>
        </div>
      </div>
    );
  }

  const getAnomalyColor = (anomaly, isPositive) => {
    if (anomaly === 0) return '#6b7280';
    return isPositive ? '#ef4444' : '#10b981';
  };

  const getAnomalyIcon = (anomaly, isPositive) => {
    if (anomaly === 0) return '→';
    return isPositive ? '↗' : '↘';
  };

  const getConfidenceColor = confidence => {
    switch (confidence) {
      case 'high':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#ef4444';
      case 'very-low':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getConfidenceText = confidence => {
    switch (confidence) {
      case 'high':
        return 'Alta confianza';
      case 'medium':
        return 'Confianza media';
      case 'low':
        return 'Baja confianza';
      case 'very-low':
        return 'Muy baja confianza';
      default:
        return 'Confianza desconocida';
    }
  };

  return (
    <div className='card card--pad'>
      <h2 className='h2'>Análisis Climático</h2>
      <p
        style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '20px',
          lineHeight: '1.5',
        }}
      >
        Comparación con datos históricos para identificar tendencias climáticas
        y anomalías.
        {currentData.days < 7 && (
          <span
            style={{
              display: 'block',
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#92400e',
            }}
          >
            ⚠️ Análisis basado en {currentData.days} días. Para mayor precisión,
            selecciona un período más largo.
          </span>
        )}
      </p>

      {/* Climate Anomalies */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatisticsCard
          title='Anomalía de Temperatura'
          value={anomalies.temperatureAnomaly}
          unit='°C'
          subtitle={`vs promedio histórico de ${historicalData.stats.avgTemp.toFixed(1)}°C`}
          color={getAnomalyColor(
            anomalies.temperatureAnomaly,
            anomalies.isWarmer
          )}
          icon={getAnomalyIcon(
            anomalies.temperatureAnomaly,
            anomalies.isWarmer
          )}
          trend={anomalies.temperatureTrend}
        />

        <StatisticsCard
          title='Anomalía de Precipitación'
          value={anomalies.precipitationAnomaly}
          unit=' mm'
          subtitle={`vs promedio histórico de ${historicalData.stats.totalPrecipitation.toFixed(1)} mm`}
          color={getAnomalyColor(
            anomalies.precipitationAnomaly,
            anomalies.isWetter
          )}
          icon={getAnomalyIcon(
            anomalies.precipitationAnomaly,
            anomalies.isWetter
          )}
          trend={anomalies.precipitationTrend}
        />
      </div>

      {/* Climate Summary */}
      <div
        style={{
          backgroundColor: '#f9fafb',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Resumen Climático
        </h3>

        <div style={{ display: 'grid', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Temperatura:
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: anomalies.isWarmer ? '#ef4444' : '#10b981',
              }}
            >
              {anomalies.isWarmer ? 'Más cálido' : 'Más frío'} que el promedio
              histórico
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Precipitación:
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: anomalies.isWetter ? '#3b82f6' : '#f59e0b',
              }}
            >
              {anomalies.isWetter ? 'Más lluvioso' : 'Más seco'} que el promedio
              histórico
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
            }}
          >
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Confianza:
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: getConfidenceColor(anomalies.confidence),
              }}
            >
              {getConfidenceText(anomalies.confidence)}
            </span>
          </div>
        </div>
      </div>

      {/* Data Periods */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          fontSize: '12px',
          color: '#6b7280',
        }}
      >
        <div
          style={{
            backgroundColor: '#f0f9ff',
            padding: '8px',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: '500', color: '#1e40af' }}>
            Período Actual
          </div>
          <div>{currentData.days} días</div>
        </div>

        <div
          style={{
            backgroundColor: '#f0fdf4',
            padding: '8px',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: '500', color: '#166534' }}>
            Período Histórico
          </div>
          <div>{historicalData.days} días</div>
        </div>
      </div>

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
