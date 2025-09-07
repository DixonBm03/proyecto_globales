import AlertBox from "../components/AlertBox";
import StatCard from "../components/StatCard";

export default function Home(){
    const recos = [
        { text:"Diálogo: Recomendaciones", action:"Acción 1" },
        { text:"Diálogo: Recomendaciones", action:"Acción 2" }
    ];
    const alertas = [
        { text:"Alerta - Emergencia", action:"Ver" }
    ];

    return (
        <>
            <h1 className="h1">Plataforma Climática GAM</h1>

            <div className="grid grid--2" style={{alignItems:"start"}}>
                <div className="card card--pad">
                    <div style={{display:"flex", gap:8, marginBottom:10}}>
                        <span className="kbd">Short time now</span>
                        <span className="kbd">Short time next</span>
                        <span className="kbd">Siguiente 3 hrs</span>
                    </div>
                    {/* Mapa embed (se puede reemplazar fácil por Leaflet/API) */}
                    <iframe
                        className="map-frame"
                        title="Mapa GAM"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-84.30%2C9.79%2C-83.80%2C10.16&layer=mapnik&marker=9.93%2C-84.08">
                    </iframe>
                </div>

                <div className="side-stack">
                    <AlertBox title="Alerta - Emergencia" items={alertas} tone="alert" />
                    <AlertBox title="Diálogo: Recomendaciones" items={recos} tone="ok" />
                    <AlertBox title="Diálogo: Recomendaciones" items={recos} tone="ok" />
                </div>
            </div>

            {/* Widgets inferiores */}
            <div className="grid grid--4" style={{marginTop:16}}>
                <StatCard icon="☁️" label="19° | Mayormente nublado" value="19°C" />
                <StatCard icon="🌧️" label="Prob. lluvia" value="60%" />
                <StatCard icon="💨" label="Viento" value="14 km/h" />
                <StatCard icon="🫧" label="Humedad" value="83%" />
            </div>
        </>
    );
}
