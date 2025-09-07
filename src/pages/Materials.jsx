import { useState } from "react";
import Modal from "../components/Modal";

const RESOURCES = [
    {
        question: "¿Qué significa la calidad del aire a lo largo del día?",
        definition: `El índice AQI (0–300) resume múltiples contaminantes. Cambia por hora según emisiones y clima.`,
        links: [
            { label: "Explicación del AQI (EPA)", url: "https://www.airnow.gov/aqi/aqi-basics/" },
            { label: "Salud y PM2.5 (OMS)", url: "https://www.who.int/" },
        ],
        pdf: "/docs/air-quality-guide_particle_SPA.pdf",
    },
    {
        question: "¿Qué debemos evitar cuando sube el AQI?",
        definition: `Reducir actividad vigorosa al aire libre, usar mascarilla certificada (N95/KN95) y evitar zonas con tráfico.`,
        links: [{ label: "Consejos de exposición", url: "https://www.airnow.gov/air-quality-and-health/" }],
        pdf: "/docs/air-quality-guide_particle_SPA.pdf",
    },
    {
        question: "¿Qué hacer con PM2.5 y PM10 en días críticos?",
        definition: `Permanecer en interiores, cerrar ventanas, filtrar el aire si es posible y seguir alertas locales.`,
        links: [{ label: "Guía rápida PM2.5", url: "https://www.airnow.gov/pm/" }],
        pdf: "/docs/air-quality-guide_particle_SPA.pdf",
    },
];

export default function Material() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(null);

    return (
        <section className="page">
            <h1>Material</h1>
            <p className="lead">Recursos breves para cada pregunta. Abre “Ver recurso”.</p>

            <div className="cards">
                {RESOURCES.map((r, idx) => (
                    <div key={idx} className="card">
                        <h3>{r.question}</h3>
                        <button className="btn" onClick={() => { setActive(r); setOpen(true); }}>
                            Ver recurso
                        </button>
                    </div>
                ))}
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title={active?.question}>
                {active && (
                    <>
                        <p>{active.definition}</p>
                        <div className="links">
                            {active.links.map((l) => (
                                <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
                            ))}
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <a className="btn" href={active.pdf} target="_blank" rel="noreferrer">Abrir PDF</a>
                        </div>
                    </>
                )}
            </Modal>
        </section>
    );
}
