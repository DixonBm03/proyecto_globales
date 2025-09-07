import AQISlider from "../components/AQISlider";

export default function AirQuality() {
    return (
        <section className="page">
            <h1>Aprende sobre el Clima y la Calidad del Aire</h1>
            <p className="lead">
                Proyecto sobre cambio climático combinado con niveles de calidad del aire. Explora, entiende y actúa.
            </p>

            <div className="grid-2">
                <div className="card">
                    <h3>Preguntas útiles</h3>
                    <ul className="bullets">
                        <li>¿Qué significa la calidad del aire a lo largo del día?</li>
                        <li>Salud: ¿qué debemos evitar, reducir o aprender cuando el AQI sube?</li>
                        <li>Protección: ¿qué hacer con PM2.5 y PM10 en días críticos?</li>
                    </ul>
                </div>

                <AQISlider />
            </div>
        </section>
    );
}
