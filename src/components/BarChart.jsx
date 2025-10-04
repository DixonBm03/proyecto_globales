// Bar chart component for precipitation and other categorical data
import React, { useState } from 'react';

export default function BarChart({
  data,
  height = 200,
  max = 50,
  title = 'Gráfico de Barras',
  showTooltip = true,
  color = '#3b82f6',
  barWidth = 20,
  showValues = false,
  yAxisLabel = '',
  xAxisLabels = [],
}) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const padX = 60; // Increased to accommodate larger Y-axis values
  const padY = 30;
  const W = 1000;
  const H = height;

  const barSpacing = (W - 2 * padX) / data.length;
  const maxBarWidth = Math.min(barWidth, barSpacing * 0.8);

  const scaleY = value => {
    const t = value / max;
    return H - padY - t * (H - 2 * padY);
  };

  const formatValue = value => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return value;
  };

  const handleMouseOver = (index, value) => {
    if (showTooltip) {
      setHoveredBar({ index, value, x: padX + index * barSpacing });
    }
  };

  const handleMouseOut = () => {
    if (showTooltip) {
      setHoveredBar(null);
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
          const value = max - (i * max) / 4; // Fix: reverse the order so 0 is at bottom
          const y = padY + i * ((H - 2 * padY) / 4);
          return (
            <text
              key={`y-label-${i}`}
              x={padX - 12}
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
            x={4}
            y={H / 2}
            textAnchor='middle'
            fontSize='12'
            fill='#6b7280'
            transform={`rotate(-90, 4, ${H / 2})`}
            style={{ fontWeight: '500' }}
          >
            {yAxisLabel}
          </text>
        )}

        {/* Bars */}
        {data.map((value, index) => {
          const x = padX + index * barSpacing - maxBarWidth / 2;
          const barHeight = H - padY - scaleY(value);
          const y = scaleY(value);
          const isHovered = hoveredBar?.index === index;

          return (
            <g key={`bar-${index}`}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={maxBarWidth}
                height={barHeight}
                fill={isHovered ? '#1d4ed8' : color}
                stroke={isHovered ? '#1e40af' : 'none'}
                strokeWidth={isHovered ? '2' : '0'}
                style={{
                  cursor: showTooltip ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={() => handleMouseOver(index, value)}
                onMouseOut={handleMouseOut}
              />

              {/* Value labels on bars - only show for shorter time ranges to avoid clutter */}
              {showValues && value > 0 && data.length <= 14 && (
                <text
                  x={x + maxBarWidth / 2}
                  y={y - 5}
                  textAnchor='middle'
                  fontSize='10'
                  fill='#374151'
                  fontWeight='500'
                >
                  {formatValue(value)}
                </text>
              )}
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredBar && showTooltip && (
          <g>
            <rect
              x={hoveredBar.x - 30}
              y={scaleY(hoveredBar.value) - 35}
              width='60'
              height='25'
              fill='rgba(0, 0, 0, 0.8)'
              rx='4'
            />
            <text
              x={hoveredBar.x}
              y={scaleY(hoveredBar.value) - 15}
              textAnchor='middle'
              fontSize='12'
              fill='white'
              fontWeight='bold'
            >
              {formatValue(hoveredBar.value)}
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
    </div>
  );
}
