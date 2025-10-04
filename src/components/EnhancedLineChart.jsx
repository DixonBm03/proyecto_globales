// Enhanced line chart with multiple data series support
import React, { useState } from 'react';

export default function EnhancedLineChart({
  data,
  height = 200,
  min = 10,
  max = 28,
  title = 'Gráfico de Líneas',
  showTooltip = true,
  showLegend = false,
  series = [],
  yAxisLabel = '',
  xAxisLabels = [],
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const padX = 60;
  const padY = 30;
  const W = 1000;
  const H = height;

  // Handle both single data array and multiple series
  const chartData =
    series.length > 0 ? series : [{ data, color: '#f59e0b', label: 'Datos' }];

  const maxDataLength = Math.max(...chartData.map(s => s.data.length));
  const xs = Array.from(
    { length: maxDataLength },
    (_, i) => padX + (i * (W - 2 * padX)) / (maxDataLength - 1)
  );

  const scaleY = v => {
    const t = (v - min) / (max - min);
    return padY + (1 - t) * (H - 2 * padY);
  };

  const formatValue = value => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return value;
  };

  const handleMouseOver = (index, value, seriesIndex = 0) => {
    if (showTooltip) {
      setHoveredPoint({ x: xs[index], y: scaleY(value), value, seriesIndex });
      setHoveredIndex(index);
    }
  };

  const handleMouseOut = () => {
    if (showTooltip) {
      setHoveredPoint(null);
      setHoveredIndex(null);
    }
  };

  return (
    <div
      className='card card--pad'
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      {title && (
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>
          {title}
        </h3>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width='100%'
        height={H}
        role='img'
        aria-label={title}
        style={{ cursor: showTooltip ? 'crosshair' : 'default' }}
      >
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={`grid-${i}`}
            x1={padX}
            x2={W - padX}
            y1={padY + i * ((H - 2 * padY) / 4)}
            y2={padY + i * ((H - 2 * padY) / 4)}
            stroke='#e5e7eb'
            strokeWidth='1'
          />
        ))}

        {/* Y-axis labels */}
        {[...Array(5)].map((_, i) => {
          const value = max - (i * (max - min)) / 4;
          const y = padY + i * ((H - 2 * padY) / 4);
          return (
            <text
              key={`y-label-${i}`}
              x={padX - 8}
              y={y + 4}
              textAnchor='end'
              fontSize='12'
              fill='#6b7280'
            >
              {formatValue(value)}
            </text>
          );
        })}

        {/* Y-axis label */}
        {yAxisLabel && (
          <text
            x={15}
            y={H / 2}
            textAnchor='middle'
            fontSize='12'
            fill='#6b7280'
            transform={`rotate(-90, 15, ${H / 2})`}
            style={{ fontWeight: '500' }}
          >
            {yAxisLabel}
          </text>
        )}

        {/* Data series */}
        {chartData.map((series, seriesIndex) => {
          const path = series.data
            .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${scaleY(v)}`)
            .join(' ');

          return (
            <g key={`series-${seriesIndex}`}>
              {/* Line path */}
              <path
                d={path}
                fill='none'
                stroke={series.color}
                strokeWidth='3'
                strokeLinejoin='round'
                strokeLinecap='round'
              />

              {/* Data points */}
              {series.data.map((value, i) => {
                const x = xs[i];
                const y = scaleY(value);
                const isHovered = hoveredIndex === i;

                return (
                  <g key={`point-${seriesIndex}-${i}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? '8' : '5'}
                      fill={series.color}
                      stroke={isHovered ? '#fff' : 'none'}
                      strokeWidth={isHovered ? '2' : '0'}
                      style={{
                        cursor: showTooltip ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={() => handleMouseOver(i, value, seriesIndex)}
                      onMouseOut={handleMouseOut}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredPoint && showTooltip && (
          <g>
            <rect
              x={hoveredPoint.x - 30}
              y={hoveredPoint.y - 35}
              width='60'
              height='25'
              fill='rgba(0, 0, 0, 0.8)'
              rx='4'
            />
            <text
              x={hoveredPoint.x}
              y={hoveredPoint.y - 15}
              textAnchor='middle'
              fontSize='12'
              fill='white'
              fontWeight='bold'
            >
              {formatValue(hoveredPoint.value)}
            </text>
          </g>
        )}
      </svg>

      {/* X-axis labels */}
      {xAxisLabels.length > 0 && xAxisLabels.length <= 14 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            padding: '0 60px',
            fontSize: '10px',
            color: '#6b7280',
          }}
        >
          {xAxisLabels.map((label, index) => (
            <span
              key={`x-label-${index}`}
              style={{
                transform: 'rotate(-45deg)',
                transformOrigin: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {new Date(label).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          ))}
        </div>
      )}

      {/* Legend */}
      {showLegend && chartData.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {chartData.map((series, index) => (
            <div
              key={`legend-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '3px',
                  backgroundColor: series.color,
                  borderRadius: '2px',
                }}
              ></div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {series.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
