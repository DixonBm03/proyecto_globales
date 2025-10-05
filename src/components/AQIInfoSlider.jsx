import { useMemo, useState, useEffect } from 'react';
import { getCategory, actionableTips } from '../utils/aqi';

export default function AQIInfoSlider({ defaultAqi = 80, realAqi }) {
  // si llega un realAqi, lo usamos; si cambia, actualizamos
  const [aqi, setAqi] = useState(realAqi ?? defaultAqi);
  useEffect(() => {
    if (typeof realAqi === 'number') setAqi(realAqi);
  }, [realAqi]);

  const cat = useMemo(() => getCategory(aqi), [aqi]);
  const tips = useMemo(() => actionableTips(aqi), [aqi]);

  const dayMeaning = useMemo(() => {
    if (aqi <= 50) {
      return [
        'Mañana (6–9 am): suele ser la mejor hora (menos ozono y tráfico).',
        'Mediodía (12–17 h): aceptable; hidrátate si haces deporte.',
        'Noche (19–22 h): condiciones estables; ejercicio suave ok.',
      ];
    }
    if (aqi <= 100) {
      return [
        'Mañana (6–9 am): mejor ventana para entrenar afuera.',
        'Mediodía (12–17 h): sube ozono; baja intensidad si eres sensible.',
        'Noche (19–22 h): condición media; rutas con menos tráfico.',
      ];
    }
    if (aqi <= 150) {
      return [
        'Mañana (6–8 am): elige esfuerzos cortos y moderados.',
        'Mediodía (12–17 h): evita pleno sol; prefiere interiores.',
        'Noche (19–22 h): mejor que al mediodía, pero mantén baja intensidad.',
      ];
    }
    if (aqi <= 200) {
      return [
        'Mañana: sólo actividad suave o muévela a interiores.',
        'Mediodía: evita salir; ozono y partículas altos.',
        'Noche: aún desfavorable; limita exposición.',
      ];
    }
    return [
      'Mañana: permanece en interiores siempre que sea posible.',
      'Mediodía: muy dañino; evita exposición.',
      'Noche: peligroso; pospone actividades al aire libre.',
    ];
  }, [aqi]);

  const health = useMemo(() => {
    if (aqi <= 50) {
      return [
        'Actividad normal para todos.',
        'Personas sensibles: sin restricciones especiales.',
        'Mantén tus tratamientos habituales si los tienes.',
      ];
    }
    if (aqi <= 100) {
      return [
        'Sensibles: evita esfuerzos intensos prolongados.',
        'Si tienes asma/cardiopatía: lleva medicación de rescate.',
        'Elige rutas arboladas o alejadas de tráfico.',
      ];
    }
    if (aqi <= 150) {
      return [
        'Sensibles: reduce tiempo e intensidad al aire libre.',
        'Considera mascarilla (N95/KN95) si debes exponerte.',
        'Presta atención a tos, sibilancias o irritación ocular.',
      ];
    }
    if (aqi <= 200) {
      return [
        'Evita ejercicio al aire libre; prefiere interiores ventilados/filtrados.',
        'Usa recirculación en el auto para no inhalar humo/tráfico.',
        'Reprograma actividades físicas para otro día/hora.',
      ];
    }
    return [
      'Peligroso para todos: permanece en interiores.',
      'Usa purificador/filtro HEPA si es posible.',
      'Contacta a tu médico ante síntomas respiratorios intensos.',
    ];
  }, [aqi]);

  const protection = useMemo(() => {
    if (aqi <= 50) {
      return [
        'PM2.5/PM10 bajos: ventilar el hogar con normalidad.',
        'No se requieren medidas especiales.',
      ];
    }
    if (aqi <= 100) {
      return [
        'Evita vías muy transitadas; elige parques/calles secundarias.',
        'Para limpiar, usa paño húmedo (no levantes polvo).',
      ];
    }
    if (aqi <= 150) {
      return [
        'Cierra ventanas en horas pico de tráfico.',
        'Considera pre-filtrar el aire (HEPA) en una habitación.',
      ];
    }
    if (aqi <= 200) {
      return [
        'Cierra ventanas/puertas; reduce ventilación natural temporalmente.',
        'Usa filtro HEPA/DIY box-fan; controla polvo interior.',
      ];
    }
    return [
      'Mantente en interiores con filtración; evita cocinar/fumar/velas.',
      'Mascarilla N95 si debes salir; evita vías rápidas.',
    ];
  }, [aqi]);

  return (
    <div className='card'>
      <div className='card-head' style={{ alignItems: 'center' }}>
        <h3>Preguntas útiles — Guía interactiva</h3>
        <span className='badge' style={{ background: cat.color }}>
          {cat.name}
        </span>
      </div>

      {/* Slider para explorar (si tienes realAqi, el slider empieza ahí) */}
      <div className='slider-row' style={{ marginBottom: 8 }}>
        <input
          type='range'
          min='0'
          max='300'
          value={aqi}
          onChange={e => setAqi(parseInt(e.target.value, 10))}
          className='aqi-slider'
          aria-label='Explorar respuestas por nivel de AQI'
        />
        <div className='aqi-value'>
          <strong>{aqi}</strong>
        </div>
      </div>

      <div
        className='grid-3'
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <div className='subcard'>
          <div className='subcard-head'>
            <span>📈</span>
            <h4 style={{ margin: 0 }}>A lo largo del día</h4>
          </div>
          <ul className='bullets' style={{ marginTop: 8 }}>
            {dayMeaning.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className='subcard'>
          <div className='subcard-head'>
            <span>🩺</span>
            <h4 style={{ margin: 0 }}>Salud</h4>
          </div>
          <ul className='bullets' style={{ marginTop: 8 }}>
            {health.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className='subcard'>
          <div className='subcard-head'>
            <span>🛡️</span>
            <h4 style={{ margin: 0 }}>Protección (PM2.5/PM10)</h4>
          </div>
          <ul className='bullets' style={{ marginTop: 8 }}>
            {protection.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className='advice' style={{ borderColor: cat.color, marginTop: 12 }}>
        <p className='advice-title'>Tips accionables</p>
        <ul style={{ margin: '6px 0 0 16px' }}>
          {tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      {typeof realAqi === 'number' && (
        <p style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
          Valor real actual: <b>{realAqi}</b> (mueve el slider para aprender)
        </p>
      )}
    </div>
  );
}
