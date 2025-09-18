import AlertBox from "../components/AlertBox";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import {
  fetchAllWeatherData,
  fetchPrecipitationProbability,
} from "../utils/openMeteo";
import { locations, defaultLocation } from "../data/locations";
import "../styles/global.css";
import "../styles/Home.css";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [weather, setWeather] = useState(null);
  const [rainProb, setRainProb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [weatherData, rainData] = await Promise.all([
          fetchAllWeatherData(selectedLocation.lat, selectedLocation.lon),
          fetchPrecipitationProbability(selectedLocation.lat, selectedLocation.lon),
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
  }, [selectedLocation]);

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
      <main className="home-main">
        <div className="main-content">
          {/* Left Section - Map */}
          <section className="home-left-section">
            <div className="card card--pad">
              {/* Location Selector */}
              <div className="location-selector">
                <span className="location-label">📍 Ubicación:</span>
                <select 
                  className="location-dropdown"
                  value={selectedLocation.id}
                  onChange={(e) => {
                    const location = locations.find(loc => loc.id === e.target.value);
                    setSelectedLocation(location);
                  }}
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}, {location.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="location-info">
                Coordenadas: {selectedLocation.lat.toFixed(2)}°, {selectedLocation.lon.toFixed(2)}°
              </div>
              
              <div className="home-time-controls">
                <span className="kbd home-time-kbd">Ahora</span>
                <span className="kbd home-time-kbd">Próximo</span>
                <span className="kbd home-time-kbd">Siguiente 3 hrs</span>
              </div>
              
              {/* Dynamic Map */}
              <iframe
                className="map-frame"
                title={`Mapa ${selectedLocation.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.bbox}&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lon}`}
              ></iframe>
            </div>
          </section>

          {/* Right Section - Stats and Alerts */}
          <section className="home-right-section">
            {/* Stat Cards */}
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

            {/* Alert Boxes */}
            <div className="alert-stack">
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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
