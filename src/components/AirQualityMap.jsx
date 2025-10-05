import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getCategory, clampToScale, actionableTips } from '../utils/aqi';

const DEFAULT_CENTER = [9.9281, -84.0907]; // San José
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTR = '&copy; OpenStreetMap contributors';

const buildUrl = (lat, lon) =>
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=us_aqi,pm2_5,pm10` +
    `&hourly=us_aqi,pm2_5,pm10&forecast_days=1&timezone=auto`;

const pin = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -36],
});

function ClickHandler({ onClick }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function AirQualityMap({
                                          autoLocate = true,
                                          refreshMinutes = 20,     // auto-refresco
                                          onLocationSelected,      // 👈 emitimos coords al padre
                                      }) {
    const [center, setCenter] = useState(DEFAULT_CENTER);
    const [point, setPoint] = useState(null);      // { lat, lon }
    const [data, setData] = useState(null);        // { aqi, aqiRaw, pm25, pm10, bestHourText, category }
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const timerRef = useRef(null);

    // geolocalización inicial
    useEffect(() => {
        if (!autoLocate || !('geolocation' in navigator)) return;
        navigator.geolocation.getCurrentPosition(
            pos => {
                const c = [pos.coords.latitude, pos.coords.longitude];
                setCenter(c);
                setPoint({ lat: c[0], lon: c[1] });
                onLocationSelected?.({ lat: c[0], lon: c[1] }); // 👈 avisar al padre
            },
            () => {}, // si falla, seguimos con default
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, [autoLocate, onLocationSelected]);

    // función para traer datos
    async function fetchAQ(lat, lon) {
        try {
            setLoading(true);
            setErr(null);
            const res = await fetch(buildUrl(lat, lon));
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const cur = json?.current;
            if (!cur || cur.us_aqi == null) throw new Error('Sin us_aqi en la respuesta');

            const aqiRaw = Number(cur.us_aqi);
            const aqi = clampToScale(aqiRaw);
            const pm25 = typeof cur.pm2_5 === 'number' ? cur.pm2_5 : null;
            const pm10 = typeof cur.pm10 === 'number' ? cur.pm10 : null;

            // mejor hora 6am vs 8pm
            const hourly = json?.hourly;
            let bestHourText = '—';
            if (hourly?.time?.length && hourly.us_aqi?.length) {
                const idx6  = hourly.time.findIndex(t => t.endsWith('T06:00'));
                const idx20 = hourly.time.findIndex(t => t.endsWith('T20:00'));
                const aqi6  = idx6  >= 0 ? hourly.us_aqi[idx6]  : null;
                const aqi20 = idx20 >= 0 ? hourly.us_aqi[idx20] : null;
                if (aqi6 != null || aqi20 != null) {
                    const best   = aqi6 == null ? aqi20 : aqi20 == null ? aqi6 : Math.min(aqi6, aqi20);
                    const label  = best === aqi6 ? '6:00 a. m.' : '8:00 p. m.';
                    bestHourText = `${label} (US AQI ~ ${Math.round(best)})`;
                }
            }

            const category = getCategory(aqi);
            setData({ aqi, aqiRaw, pm25, pm10, bestHourText, category });
        } catch (e) {
            setErr(e.message || 'Error al obtener datos');
        } finally {
            setLoading(false);
        }
    }

    // traer datos cuando seleccionamos punto
    useEffect(() => {
        if (!point) return;
        fetchAQ(point.lat, point.lon);

        // auto-refresco
        clearInterval(timerRef.current);
        if (refreshMinutes > 0) {
            timerRef.current = setInterval(() => fetchAQ(point.lat, point.lon), refreshMinutes * 60 * 1000);
        }
        return () => clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [point?.lat, point?.lon, refreshMinutes]);

    const tips = useMemo(() => actionableTips(data?.aqi ?? 0), [data?.aqi]);

    return (
        <div className="map-wrap">
            <MapContainer
                center={center}
                zoom={12}
                scrollWheelZoom
                style={{ height: 420, width: '100%', borderRadius: 12 }}
            >
                <TileLayer url={TILE_URL} attribution={ATTR} />
                <ClickHandler
                    onClick={(la, lo) => {
                        setPoint({ lat: la, lon: lo });
                        setCenter([la, lo]);
                        onLocationSelected?.({ lat: la, lon: lo }); // 👈 avisar al padre
                    }}
                />

                {point && (
                    <>
                        <Marker position={[point.lat, point.lon]} icon={pin}>
                            <Popup>
                                {loading ? 'Cargando...' : err ? `Error: ${err}` : (
                                    <div>
                                        <b>AQI:</b> {data?.aqi ?? '-'} (US AQI real: {data?.aqiRaw ?? '-'})<br />
                                        {data?.pm25 != null && <>PM2.5: {data.pm25} μg/m³<br /></>}
                                        {data?.pm10 != null && <>PM10: {data.pm10} μg/m³<br /></>}
                                        {data?.bestHourText && <>Mejor hora: {data.bestHourText}<br /></>}
                                        {data?.category && <>Categoría: <span style={{ color: data.category.color }}>{data.category.name}</span></>}
                                    </div>
                                )}
                            </Popup>
                        </Marker>

                        {data?.category && (
                            <CircleMarker
                                center={[point.lat, point.lon]}
                                radius={18}
                                pathOptions={{ color: data.category.color, fillColor: data.category.color, fillOpacity: 0.35 }}
                            />
                        )}
                    </>
                )}
            </MapContainer>

            <div className="map-side">
                <h4 style={{ marginTop: 0 }}>Recomendaciones</h4>
                {loading && <p>Cargando…</p>}
                {err && <p style={{ color: '#c00' }}>Error: {err}</p>}
                {!loading && !err && data && (
                    <>
                        <p style={{ margin: '6px 0' }}>
                            <b>Estado:</b>{' '}
                            <span style={{ background: data.category.color, color: '#fff', padding: '2px 8px', borderRadius: 999 }}>
                {data.category.name}
              </span>
                        </p>
                        <p style={{ margin: '4px 0 8px' }}>
                            <b>AQI</b>: {data.aqi} <small style={{ opacity: .75 }}>(US AQI real: {data.aqiRaw})</small>
                        </p>
                        {data.pm25 != null && <p>PM2.5: {data.pm25} μg/m³</p>}
                        {data.pm10 != null && <p>PM10: {data.pm10} μg/m³</p>}
                        {data.bestHourText && <p>Mejor hora hoy: <b>{data.bestHourText}</b></p>}
                        <ul style={{ margin: '8px 0 0 18px' }}>
                            {tips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </>
                )}
                {!point && !loading && !err && <p>Haz clic en el mapa para consultar un punto.</p>}
            </div>
        </div>
    );
}
