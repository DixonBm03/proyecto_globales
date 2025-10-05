import React, { useEffect, useMemo, useState } from 'react';
import LineChart from '../components/LineChart';
import LocationMap from '../components/LocationMap';

// --- helpers de íconos por weathercode (muy simple con emojis) ---
function iconForCode(code) {
    // https://open-meteo.com/en/docs (tabla weathercode)
    if ([0].includes(code)) return '☀️';
    if ([1, 2].includes(code)) return '🌤️';
    if ([3].includes(code)) return '☁️';
    if ([45, 48].includes(code)) return '🌫️';
    if ([51, 53, 55, 56, 57].includes(code)) return '🌦️';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
    if ([95, 96, 99].includes(code)) return '⛈️';
    return '🌀';
}

function dowLabel(dateISO) {
    // etiqueta corta del día (locale)
    const d = new Date(dateISO + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short' }); // lun, mar, ...
}

// --- construye la URL de Open-Meteo ---
const buildUrl = (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&timezone=auto` +
    `&hourly=temperature_2m,precipitation_probability` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&forecast_days=7`;

// --- derivar consejo por día ---
function adviceForDay(max, rainProb) {
    if (rainProb >= 70) return 'Lleva paraguas y plan B bajo techo.';
    if (max >= 30) return 'Hidrátate y evita sol del mediodía.';
    if (rainProb >= 40) return 'Probables lluvias: revisa el radar antes de salir.';
    return 'Buen día para actividades al aire libre.';
}

export default function Forecast() {
    // ubicación seleccionada (inicial: San José)
    const [coords, setCoords] = useState({ lat: 9.9281, lon: -84.0907 });

    // estado de datos reales
    const [daily, setDaily] = useState(null);
    const [hourly, setHourly] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    // UI: índice del día seleccionado (null = ninguno)
    const [selectedIndex, setSelectedIndex] = useState(null);

    // cargar datos cuando cambian coords
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const res = await fetch(buildUrl(coords.lat, coords.lon));
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                setDaily(json.daily);
                setHourly(json.hourly);
                setSelectedIndex(null); // resetea selección al cambiar ubicación
            } catch (e) {
                setErr(e.message || 'Error al obtener pronóstico');
            } finally {
                setLoading(false);
            }
        })();
    }, [coords.lat, coords.lon]);

    // construir tira semanal con datos reales
    const weekly = useMemo(() => {
        if (!daily) return [];
        const out = [];
        for (let i = 0; i < daily.time.length; i++) {
            out.push({
                day: dowLabel(daily.time[i]),
                date: daily.time[i],
                icon: iconForCode(daily.weathercode[i]),
                max: Math.round(daily.temperature_2m_max[i]),
                min: Math.round(daily.temperature_2m_min[i]),
                rainProb: `${daily.precipitation_probability_max[i] ?? 0}%`,
                advice: adviceForDay(daily.temperature_2m_max[i], daily.precipitation_probability_max[i] ?? 0),
            });
        }
        return out;
    }, [daily]);

    // día seleccionado
    const selectedDay = selectedIndex !== null ? weekly[selectedIndex] : null;

    // serie horaria para el gráfico (para el día seleccionado; si no hay selección, próximas 12 horas)
    const hourlyTempsForChart = useMemo(() => {
        if (!hourly) return [];
        const { time, temperature_2m } = hourly;

        if (selectedDay) {
            const dayPrefix = selectedDay.date; // 'YYYY-MM-DD'
            const indices = time.map((t, i) => (t.startsWith(dayPrefix) ? i : -1)).filter(i => i >= 0);
            const temps = indices.map(i => Math.round(temperature_2m[i]));
            // si hay muchas horas, tomamos cada 2 para que el gráfico no quede sobrecargado
            return temps.length > 16 ? temps.filter((_, i) => i % 2 === 0) : temps;
        }

        // por defecto: próximas 12 horas a partir de ahora
        const nowISO = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
        const startIdx = time.findIndex(t => t.startsWith(nowISO.slice(0, 13).split('T')[0]) && t >= nowISO);
        const slice = startIdx >= 0 ? temperature_2m.slice(startIdx, startIdx + 12) : temperature_2m.slice(0, 12);
        return slice.map(v => Math.round(v));
    }, [hourly, selectedDay]);

    const tempMin = useMemo(() => (hourlyTempsForChart.length ? Math.min(...hourlyTempsForChart) - 2 : 10), [hourlyTempsForChart]);
    const tempMax = useMemo(() => (hourlyTempsForChart.length ? Math.max(...hourlyTempsForChart) + 2 : 28), [hourlyTempsForChart]);

    const handleDayClick = index => setSelectedIndex(prev => (index === prev ? null : index));

    return (
        <>
            <h1 className='h1'>Pronóstico semanal</h1>
            <p className='p' style={{ textAlign: 'center' }}>
                Haz clic en el mapa para elegir ubicación. Luego toca un día para ver resumen y el gráfico de temperatura por horas.
            </p>

            {/* Mapa para elegir lugar */}
            <div className='card' style={{ marginBottom: 12 }}>
                <h3 style={{ marginTop: 0 }}>Selecciona un lugar</h3>
                <LocationMap onLocationSelected={setCoords} autoLocate={true} />
                <p style={{ marginTop: 8, fontSize: 13, opacity: .75 }}>
                    Ubicación actual: {coords.lat.toFixed(3)}, {coords.lon.toFixed(3)}
                </p>
            </div>

            {loading && <div className='card'>Cargando pronóstico…</div>}
            {err && <div className='card'>Error: {err}</div>}

            {!loading && !err && (
                <>
                    {/* Tira semanal */}
                    <div className='day-strip'>
                        {weekly.map((d, index) => (
                            <div
                                className={`day-card ${index === selectedIndex ? 'selected' : ''}`}
                                key={d.date}
                                onClick={() => handleDayClick(index)}
                                role='button'
                            >
                                <div className='top'>{d.day}</div>
                                <div style={{ fontSize: 28 }}>{d.icon}</div>
                                <div className='temp-range'>{d.max}°C | {d.min}°C</div>
                            </div>
                        ))}
                    </div>

                    {/* Detalle del día */}
                    {selectedDay && (
                        <div className='detail-box'>
                            <h3 className='h3-detail'>{selectedDay.day}: Resumen y Consejos</h3>
                            <p><strong>Probabilidad de lluvia:</strong> {selectedDay.rainProb}</p>
                            <p><strong>Consejo del día:</strong> {selectedDay.advice}</p>
                        </div>
                    )}

                    {/* Gráfico horario */}
                    <h2 className='h2'>Temperatura</h2>
                    <LineChart data={hourlyTempsForChart} min={tempMin} max={tempMax} />
                </>
            )}
        </>
    );
}
