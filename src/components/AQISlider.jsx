import { useEffect, useMemo, useState } from 'react';
import { getCategory, AQI_CATEGORIES, clampToScale, actionableTips } from '../utils/aqi';

const buildUrl = (lat, lon) =>
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=us_aqi,pm2_5,pm10` +
    `&hourly=us_aqi,pm2_5,pm10&forecast_days=1&timezone=auto`;

export default function AQISlider({ lat, lon, onAqiChange }) {
    const [aqiRaw, setAqiRaw] = useState(null);
    const [aqi, setAqi] = useState(null);
    const [pm25, setPm25] = useState(null);
    const [pm10, setPm10] = useState(null);
    const [bestHourText, setBestHourText] = useState('—');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cat = useMemo(() => (aqi != null ? getCategory(aqi) : null), [aqi]);
    const tips = actionableTips(aqi ?? 0);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(buildUrl(lat, lon));
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                const cur = data?.current;
                if (!cur || cur.us_aqi == null) throw new Error('Sin us_aqi');

                setAqiRaw(cur.us_aqi);
                const clamped = clampToScale(cur.us_aqi);
                setAqi(clamped);
                onAqiChange?.(clamped); // 👈 avisamos al padre

                setPm25(typeof cur.pm2_5 === 'number' ? cur.pm2_5 : null);
                setPm10(typeof cur.pm10 === 'number' ? cur.pm10 : null);

                const h = data?.hourly;
                const i6 = h?.time?.findIndex?.(t => t.endsWith('T06:00')) ?? -1;
                const i20 = h?.time?.findIndex?.(t => t.endsWith('T20:00')) ?? -1;
                const a6 = i6 >= 0 ? h.us_aqi[i6] : null;
                const a20 = i20 >= 0 ? h.us_aqi[i20] : null;
                if (a6 != null || a20 != null) {
                    const best = a6 == null ? a20 : a20 == null ? a6 : Math.min(a6, a20);
                    const label = best === a6 ? '6:00 a. m.' : '8:00 p. m.';
                    setBestHourText(`${label} (US AQI ~ ${Math.round(best)})`);
                } else {
                    setBestHourText('—');
                }
            } catch (e) {
                setError(e.message || 'Error al obtener datos');
            } finally {
                setLoading(false);
            }
        })();
    }, [lat, lon, onAqiChange]);

    const widthPct = (min, max) => (((max - min) / 300) * 100).toFixed(4) + '%';

    if (loading) return <div className="card">Cargando calidad del aire…</div>;
    if (error) return <div className="card">Error: {error}</div>;

    return (
        <div className="card">
            <div className="card-head">
                <h3>Calidad del Aire (AQI)</h3>
                {cat && <span className="badge" style={{ background: cat.color }}>{cat.name}</span>}
            </div>

            {/* Slider bloqueado (semáforo) */}
            <div className="slider-row" style={{ marginBottom: 8 }}>
                <input type="range" min="0" max="300" value={aqi ?? 0} readOnly className="aqi-slider" />
            </div>

            {/* Barra 0–300 + aguja */}
            <div className="aqi-scale">
                {AQI_CATEGORIES.map(c => (
                    <div key={c.name} title={`${c.name}: ${c.min}-${c.max}`}
                         style={{ background: c.color, width: widthPct(c.min, c.max) }} />
                ))}
                <div className={`needle ${aqi >= 151 ? 'shake' : ''}`}
                     style={{ left: `calc(${(aqi ?? 0) / 3}% - 6px)` }} />
            </div>

            <div className="scale-labels">
                <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span><span>300</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div className="aqi-value" style={{ fontWeight: 700, fontSize: 18 }}>
                    {aqi ?? '-'}
                    <small style={{ display: 'block', opacity: .75, fontWeight: 400 }}>
                        US AQI real: {aqiRaw ?? '-'}
                        {pm25 != null && ` · PM2.5: ${pm25} μg/m³`}
                        {pm10 != null && ` · PM10: ${pm10} μg/m³`}
                    </small>
                </div>
                <div style={{ fontSize: 13, opacity: .85 }}>
                    Mejor hora hoy: <b>{bestHourText}</b>
                </div>
            </div>

            <div className="advice" style={{ borderColor: cat?.color, marginTop: 10 }}>
                <p className="advice-title">Recomendación</p>
                <p>{cat?.msg ?? '—'}</p>
                <ul style={{ margin: '6px 0 0 16px' }}>
                    {tips.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
            </div>
        </div>
    );
}
