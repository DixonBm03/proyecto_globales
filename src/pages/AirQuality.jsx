import { useState } from 'react';
import AQISlider from '../components/AQISlider';
import AirQualityMap from '../components/AirQualityMap';
import AQIInfoSlider from '../components/AQIInfoSlider';

export default function AirQuality() {
    // Coordenadas que controlan la barra (San José por defecto)
    const [selected, setSelected] = useState({ lat: 9.9281, lon: -84.0907 });
    // AQI real que emite el semáforo
    const [realAqi, setRealAqi] = useState(null);

    return (
        <section className='page'>
            <h1>Aprende sobre el Clima y la Calidad del Aire</h1>
            <p className='lead'>
                Proyecto sobre cambio climático combinado con niveles de calidad del aire. Explora, entiende y actúa.
            </p>

            <div className='grid-2'>
                {/* 💡 Slider educativo que responde las preguntas y se sincroniza con el AQI real */}
                <AQIInfoSlider realAqi={realAqi} />

                {/* Semáforo en tiempo real (bloqueado) que emite el AQI al padre */}
                <AQISlider lat={selected.lat} lon={selected.lon} onAqiChange={setRealAqi} />
            </div>

            {/* Mapa que emite nuevas coords al hacer clic o al geolocalizar */}
            <div style={{ marginTop: 16 }}>
                <AirQualityMap
                    autoLocate={true}
                    refreshMinutes={20}
                    onLocationSelected={setSelected}
                />
            </div>
        </section>
    );
}
