import AlertBox from "../components/AlertBox";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import {
  fetchAllWeatherData,
  fetchPrecipitationProbability,
} from "../utils/openMeteo";
import "../styles/global.css";
import "../styles/Home.css";

export default function Home() {
  // Example: San José, Costa Rica
  const LAT = 9.93;
  const LON = -84.08;
  const [weather, setWeather] = useState(null);
  const [rainProb, setRainProb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [weatherData, rainData] = await Promise.all([
          fetchAllWeatherData(LAT, LON),
          fetchPrecipitationProbability(LAT, LON),
        ]);
        setWeather(weatherData);
        setRainProb(rainData);
        setLoading(false);
      } catch (err) {
        setError("No se pudo obtener datos del clima.");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Prepare alert items
  let alertas = [];
  if (weather && weather.weather_alerts && weather.weather_alerts.length > 0) {
    alertas = weather.weather_alerts.map((alert) => ({
      text: alert.event,
      action: alert.description || "Ver",
    }));
  }

  const recos = [
    { text: "Diálogo: Recomendaciones", action: "Acción 1" },
    { text: "Diálogo: Recomendaciones", action: "Acción 2" },
  ];

  // Extract weather data
  const current = weather?.current_weather;
  const hourly = weather?.hourly;
  // Get the first value for each variable (current hour)
  const humidity = hourly?.relative_humidity_2m?.[0];
  const pressure = hourly?.surface_pressure?.[0];
  const rainProbability = rainProb?.hourly?.precipitation_probability?.[0];

  return (
    <div className="home-root">
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem 1rem 1rem 1rem",
        }}
      >
        <div className="main-content">
          <section style={{ flex: 2, minWidth: 320 }}>
            <div className="card card--pad">
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span className="kbd">Ahora</span>
                <span className="kbd">Próximo</span>
                <span className="kbd">Siguiente 3 hrs</span>
              </div>
              {/* Mapa embed (se puede reemplazar fácil por Leaflet/API) */}
              <iframe
                className="map-frame"
                title="Mapa GAM"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-84.30%2C9.79%2C-83.80%2C10.16&layer=mapnik&marker=9.93%2C-84.08"
              ></iframe>
            </div>
          </section>
          <aside className="side-stack">
            {alertas.length > 0 && (
              <AlertBox
                title="Alerta - Emergencia"
                items={alertas}
                tone="alert"
              />
            )}
            <AlertBox
              title="Diálogo: Recomendaciones"
              items={recos}
              tone="ok"
            />
            <AlertBox
              title="Diálogo: Recomendaciones"
              items={recos}
              tone="ok"
            />
          </aside>
        </div>

        {/* Widgets inferiores */}
        <div className="statcard-row">
          {loading ? (
            <>
              <StatCard icon="☁️" label="Cargando..." value="—" />
              <StatCard icon="🌧️" label="Cargando..." value="—" />
              <StatCard icon="💨" label="Cargando..." value="—" />
              <StatCard icon="🫧" label="Cargando..." value="—" />
              <StatCard icon="🔵" label="Cargando..." value="—" />
            </>
          ) : error ? (
            <StatCard icon="⚠️" label={error} value="—" />
          ) : (
            <>
              <StatCard
                icon="☁️"
                label={
                  current?.weathercode
                    ? `Código: ${current.weathercode}`
                    : "Mayormente nublado"
                }
                value={current?.temperature ? `${current.temperature}°C` : "—"}
              />
              <StatCard
                icon="🌧️"
                label="Prob. lluvia"
                value={
                  rainProbability !== undefined ? `${rainProbability}%` : "—"
                }
              />
              <StatCard
                icon="💨"
                label="Viento"
                value={current?.windspeed ? `${current.windspeed} km/h` : "—"}
              />
              <StatCard
                icon="🫧"
                label="Humedad"
                value={humidity !== undefined ? `${humidity}%` : "—"}
              />
              <StatCard
                icon="🔵"
                label="Presión"
                value={pressure !== undefined ? `${pressure} hPa` : "—"}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
