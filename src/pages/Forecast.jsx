import React, { useState } from 'react';
import { weekly, hourlyTempsForChart } from '../data/mockWeather';
import LineChart from '../components/LineChart';

export default function Forecast() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedDay = selectedIndex !== null ? weekly[selectedIndex] : null;

  const handleDayClick = index => {
    if (index === selectedIndex) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <>
      <h1 className='h1'>Pronóstico semanal</h1>
      <p className='p' style={{ textAlign: 'center' }}>
        Aquí tienes un resumen del pronóstico semanal de temperatura y de
        lluvia.
      </p>

      <div className='day-strip'>
        {weekly.map((d, index) => (
          <div
            className={`day-card ${index === selectedIndex ? 'selected' : ''}`}
            key={d.day}
            onClick={() => handleDayClick(index)}
            role='button'
          >
            <div className='top'>{d.day}</div>
            <div style={{ fontSize: 28 }}>{d.icon}</div>
            <div className='temp-range'>
              {d.max}°C | {d.min}°C
            </div>
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className='detail-box'>
          <h3 className='h3-detail'>{selectedDay.day}: Resumen y Consejos</h3>
          <p>
            <strong>Probabilidad de lluvia:</strong> {selectedDay.rainProb}
          </p>
          <p>
            <strong>Consejo del día:</strong> {selectedDay.advice}
          </p>
        </div>
      )}

      <h2 className='h2'>Temperatura</h2>
      <LineChart data={hourlyTempsForChart} min={15} max={26} />
    </>
  );
}
