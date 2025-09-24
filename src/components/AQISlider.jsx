import { useEffect, useMemo, useState } from 'react';
import { getCategory, AQI_CATEGORIES } from '../utils/aqi';
import emailjs from '@emailjs/browser';
import { useAlerts } from '../context/AlertContext';

// Env (opcional) – CRA
const ENV_SERVICE =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.REACT_APP_EMAILJS_SERVICE_ID
    ? process.env.REACT_APP_EMAILJS_SERVICE_ID
    : '';
const ENV_TEMPLATE =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.REACT_APP_EMAILJS_TEMPLATE_ID
    ? process.env.REACT_APP_EMAILJS_TEMPLATE_ID
    : '';
const ENV_PUBLIC =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    ? process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    : '';

// Permite configurar desde la UI (localStorage) sin .env
const LS_SERVICE =
  typeof window !== 'undefined' ? localStorage.getItem('emailjs_service') : '';
const LS_TEMPLATE =
  typeof window !== 'undefined' ? localStorage.getItem('emailjs_template') : '';
const LS_PUBLIC =
  typeof window !== 'undefined' ? localStorage.getItem('emailjs_public') : '';

const SERVICE_ID = LS_SERVICE || ENV_SERVICE;
const TEMPLATE_ID = LS_TEMPLATE || ENV_TEMPLATE;
const PUBLIC_KEY = LS_PUBLIC || ENV_PUBLIC;
const EMAIL_READY = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export default function AQISlider() {
  const [aqi, setAqi] = useState(82);
  const cat = useMemo(() => getCategory(aqi), [aqi]);
  const { email, enabled } = useAlerts();

  useEffect(() => {
    const danger = aqi >= 151;
    if (!danger || !enabled || !email) return;

    const already = sessionStorage.getItem('lastAlertCat');
    const now = cat.name;
    if (already === now) return;
    sessionStorage.setItem('lastAlertCat', now);

    if (!EMAIL_READY) {
      console.info('Correo NO enviado: EmailJS no configurado (opcional).');
      return;
    }

    try {
      emailjs.init(PUBLIC_KEY);
      emailjs
        .send(SERVICE_ID, TEMPLATE_ID, {
          to_email: email,
          subject: `⚠️ Alerta AQI: ${now} (${aqi})`,
          aqi_value: aqi,
          aqi_status: now,
          aqi_message: cat.msg,
        })
        .then(() => console.log('Alerta enviada'))
        .catch(err => console.error('EmailJS error', err));
    } catch (e) {
      console.error('EmailJS init error', e);
    }
  }, [aqi, cat, email, enabled]);

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
