// Reusable statistics card component
import React from 'react';

export default function StatisticsCard({
  title,
  value,
  unit = '',
  subtitle = '',
  trend = null,
  color = '#2eaadc',
  icon = null,
  onClick = null,
}) {
  const formatValue = val => {
    if (typeof val === 'number') {
      return val.toFixed(1);
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend > 0) {
      return (
        <span style={{ color: '#ef4444', fontSize: '12px' }}>
          ↗ +{trend.toFixed(1)}%
        </span>
      );
    } else if (trend < 0) {
      return (
        <span style={{ color: '#10b981', fontSize: '12px' }}>
          ↘ {trend.toFixed(1)}%
        </span>
      );
    } else {
      return <span style={{ color: '#6b7280', fontSize: '12px' }}>→ 0%</span>;
    }
  };

  return (
    <div
      className='card card--pad'
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        border: onClick ? '1px solid transparent' : '1px solid #e5e7eb',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        if (onClick) {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
            <h3
              style={{
                margin: '0',
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500',
              }}
            >
              {title}
            </h3>
          </div>

          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: color,
              marginBottom: '4px',
            }}
          >
            {formatValue(value)}
            {unit}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              {subtitle}
            </div>
          )}

          {getTrendIcon()}
        </div>
      </div>
    </div>
  );
}
