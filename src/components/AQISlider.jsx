import { useEffect, useMemo, useState } from 'react';
import { getCategory, AQI_CATEGORIES } from '../utils/aqi';

export default function AQISlider() {
  const [aqi, setAqi] = useState(82);
  const cat = useMemo(() => getCategory(aqi), [aqi]);

  // ancho correcto por tramo: (max - min) / 300
  const widthPct = (min, max) => (((max - min) / 300) * 100).toFixed(4) + '%';

  return (
    <div className='card'>
      <div className='card-head'>
        <h3>Calidad del Aire (AQI)</h3>
        <span className='badge' style={{ background: cat.color }}>
          {cat.name}
        </span>
      </div>

      {/* Barra graduada 0–300 */}
      <div className='aqi-scale'>
        {AQI_CATEGORIES.map(c => (
          <div
            key={c.name}
            title={`${c.name}: ${c.min}-${c.max}`}
            style={{ background: c.color, width: widthPct(c.min, c.max) }}
          />
        ))}
        <div
          className={`needle ${aqi >= 151 ? 'shake' : ''}`}
          style={{ left: `calc(${aqi / 3}% - 6px)` }}
        />
      </div>
      {/* Etiquetas debajo (ya no dentro de la barra) */}
      <div className='scale-labels'>
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200</span>
        <span>300</span>
      </div>

      {/* Slider */}
      <div className='slider-row'>
        <input
          type='range'
          min='0'
          max='300'
          value={aqi}
          onChange={e => setAqi(parseInt(e.target.value, 10))}
          className='aqi-slider'
        />
        <div className='aqi-value'>
          <strong>{aqi}</strong>
        </div>
      </div>

      {/* Mensaje dinámico */}
      <div className='advice' style={{ borderColor: cat.color }}>
        <p className='advice-title'>Recomendación</p>
        <p>{cat.msg}</p>
        {aqi <= 50 && (
          <p>
            Estado general: <b>actividad normal</b>.
          </p>
        )}
        {aqi > 50 && aqi <= 100 && <p>Evita esfuerzos intensos prolongados.</p>}
        {aqi > 100 && aqi <= 150 && (
          <p>Personas sensibles: usar mascarilla si es necesario.</p>
        )}
        {aqi >= 151 && aqi <= 200 && (
          <p>
            <b>No recomendable salir</b>. Prefiere espacios cerrados.
          </p>
        )}
        {aqi > 200 && (
          <p>
            <b>Peligroso</b>: quédate en casa, filtra el aire si puedes.
          </p>
        )}
      </div>
    </div>
  );
}
