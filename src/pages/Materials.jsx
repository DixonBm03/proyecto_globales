import { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import '../styles/Material.css';

const CATEGORIES = [
    'Conceptos',
    'Salud',
    'Prevención',
    'Actividades',
    'Escuelas',
    'Incendios',
    'Calor & Aire',
];

const RESOURCES = [
    {
        question: '¿Qué significa la calidad del aire a lo largo del día?',
        definition:
            'El índice AQI (0–300+) resume múltiples contaminantes (PM2.5, PM10, ozono, etc.) y puede variar por hora según emisiones y condiciones meteorológicas.',
        category: 'Conceptos',
        tags: ['AQI', 'PM2.5', 'PM10', 'Ozono'],
        audience: 'Público general',
        actions: [
            'Revisar el AQI por hora antes de planificar actividades.',
            'Preferir mañana temprano o tarde/noche cuando el ozono suele bajar.',
        ],
        links: [
            { label: 'Explicación del AQI (EPA)', url: 'https://www.airnow.gov/aqi/aqi-basics/' },
            { label: 'Salud y PM2.5 (OMS)', url: 'https://www.who.int/' },
        ],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'Todos',
    },
    {
        question: 'PM2.5 vs PM10 vs Ozono (O3): ¿en qué se diferencian?',
        definition:
            'PM2.5 y PM10 son partículas; las PM2.5 son más finas y penetran más en los pulmones. El ozono a nivel del suelo es un gas irritante que aumenta con el sol y el tráfico.',
        category: 'Conceptos',
        tags: ['PM2.5', 'PM10', 'O3'],
        audience: 'Público general',
        actions: [
            'En días de ozono, limita actividades intensas al aire libre por la tarde.',
            'En días de PM2.5, cierra ventanas y filtra el aire interior.',
        ],
        links: [{ label: 'Guía PM (AirNow)', url: 'https://www.airnow.gov/pm/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'Todos',
    },
    {
        question: 'Grupos sensibles y señales de alarma',
        definition:
            'Niñez, embarazadas, mayores, y personas con asma, EPOC o cardiopatías son más vulnerables. Señales: tos, falta de aire, pecho apretado, fatiga inusual.',
        category: 'Salud',
        tags: ['asma', 'EPOC', 'cardio'],
        audience: 'Grupos sensibles y cuidadores',
        actions: [
            'Tener inhalador/medicación a mano y plan de acción personal.',
            'Reducir exposición: permanecer en interiores y evitar picos de AQI.',
        ],
        links: [{ label: 'Calidad del aire y salud', url: 'https://www.airnow.gov/air-quality-and-health/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'USG/Insalubre',
    },
    {
        question: '¿Qué debemos evitar cuando sube el AQI?',
        definition:
            'Evita ejercicio vigoroso al aire libre. Usa mascarilla N95/KN95 bien ajustada y aléjate de carreteras o zonas con tráfico pesado.',
        category: 'Prevención',
        tags: ['N95', 'exposición', 'tráfico'],
        audience: 'Público general',
        actions: [
            'Reprogramar entrenamientos intensos para cuando el AQI mejore.',
            'Usar rutas con menos tráfico y espacios verdes interiores.',
        ],
        links: [{ label: 'Consejos de exposición', url: 'https://www.airnow.gov/air-quality-and-health/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'USG/Insalubre',
    },
    {
        question: 'Mascarillas: ¿cuándo y cómo usarlas?',
        definition:
            'Las N95/KN95 bien selladas pueden reducir la inhalación de PM2.5. No protegen del ozono. Cambia la mascarilla si está húmeda o dañada.',
        category: 'Prevención',
        tags: ['N95', 'KN95', 'PM2.5'],
        audience: 'Público general',
        actions: [
            'Usarla en exteriores cuando el AQI por PM2.5 sea elevado.',
            'Evitar esfuerzos intensos aun con mascarilla si el AQI es muy alto.',
        ],
        links: [{ label: 'Guía rápida PM2.5', url: 'https://www.airnow.gov/pm/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'Insalubre/Muy insalubre',
    },
    {
        question: 'Ventilación y filtrado del aire en interiores',
        definition:
            'Mejora el aire interior con filtros MERV 13+ si tu sistema lo soporta, o purificadores HEPA. Ventila estratégicamente cuando el AQI exterior sea más bajo.',
        category: 'Prevención',
        tags: ['HEPA', 'MERV 13', 'ventilación'],
        audience: 'Hogares y oficinas',
        actions: [
            'Crear una “habitación limpia” con purificador HEPA y puertas cerradas.',
            'Sellar filtraciones en ventanas/puertas en episodios de humo.',
        ],
        links: [{ label: 'Guía de interiores (AirNow)', url: 'https://www.airnow.gov/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'USG/Insalubre',
    },
    {
        question: 'Planificar ejercicio y actividades al aire libre',
        definition:
            'Ajusta intensidad, duración y horario según el AQI horario. Prefiere actividades suaves (caminar) cuando el índice esté moderado.',
        category: 'Actividades',
        tags: ['deporte', 'rutina', 'planificación'],
        audience: 'Deportistas y público activo',
        actions: [
            'Usar apps/servicios con pronóstico horario de AQI.',
            'Trasladar sesiones intensas a interiores ventilados/filtrados.',
        ],
        links: [{ label: 'AQI y actividad física', url: 'https://www.airnow.gov/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'Moderado/USG',
    },
    {
        question: 'Escuelas y niñez: pautas prácticas',
        definition:
            'En AQI moderado, reducir intensidad; en USG o peor, mover a interiores y considerar purificadores. Priorizar recreos en horas con mejor AQI.',
        category: 'Escuelas',
        tags: ['niñez', 'recreo', 'clases'],
        audience: 'Docentes y centros educativos',
        actions: [
            'Tener un plan por niveles AQI (verde/amarillo/naranja/rojo).',
            'Comunicar a familias cuando se activen medidas especiales.',
        ],
        links: [{ label: 'Actividades escolares y AQI', url: 'https://www.airnow.gov/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'Moderado/USG',
    },
    {
        question: 'Incendios forestales y humo',
        definition:
            'El humo eleva las PM2.5 de forma intensa y a veces súbita. Monitorea alertas locales, prepara purificadores y evita fuentes internas de humo.',
        category: 'Incendios',
        tags: ['humo', 'PM2.5', 'alertas'],
        audience: 'Público general',
        actions: [
            'Mantener medicación y equipo listos si eres sensible.',
            'Evitar cocinar con aceite a alta temperatura o usar velas/incienso.',
        ],
        links: [{ label: 'Consejos en humo', url: 'https://www.airnow.gov/wildfires/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'Insalubre/Muy insalubre',
    },
    {
        question: 'Calor extremo y mala calidad del aire',
        definition:
            'El combo calor + ozono/PM incrementa el riesgo de salud. Hidrátate, planifica descansos y permanece en interiores frescos y filtrados.',
        category: 'Calor & Aire',
        tags: ['calor', 'ozono', 'riesgo combinado'],
        audience: 'Público general',
        actions: [
            'Evitar entrenar en la hora más calurosa con AQI alto.',
            'Revisar pronóstico de calor y AQI en conjunto.',
        ],
        links: [{ label: 'Salud y olas de calor', url: 'https://www.who.int/' }],
        pdf: '/docs/air-quality-guide_particle_SPA.pdf',
        riskLevel: 'USG/Insalubre',
    },
];

function Badge({ text, tone = false }) {
    return <span className={`badge${tone ? ' tone' : ''}`}>{text}</span>;
}

export default function Material() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(null);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('Todas');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return RESOURCES.filter(r => {
            const inCategory = category === 'Todas' || r.category === category;
            if (!q) return inCategory;
            const haystack = [
                r.question,
                r.definition,
                r.category,
                r.audience,
                ...(r.tags || []),
            ].join(' ').toLowerCase();
            return inCategory && haystack.includes(q);
        });
    }, [query, category]);

    return (
        <section className="material-page">
            <header className="page-hero">
                <div className="container">
                    <h1 className="page-title">📘 Recursos sobre Calidad del Aire</h1>
                    <p className="page-subtitle">
                        Explora materiales breves y accionables para comprender los índices, los riesgos y las medidas preventivas.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className="toolbar">
                    <input
                        type="search"
                        className="input"
                        placeholder="Buscar (ej. PM2.5, ozono, escuelas)…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Buscar recursos"
                    />
                    <select
                        className="select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        aria-label="Filtrar por categoría"
                    >
                        <option value="Todas">Todas las categorías</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="cards-grid">
                    {filtered.map((r, idx) => (
                        <article
                            key={`${r.question}-${idx}`}
                            className="resource-card"
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (setActive(r), setOpen(true))}
                        >
                            <div className="card-tags">
                                <Badge text={r.category} />
                                <Badge text={r.riskLevel} tone />
                            </div>

                            <h3 className="card-title">{r.question}</h3>
                            <p className="card-excerpt">{r.definition.slice(0, 140)}…</p>

                            <div className="card-meta">
                                <span className="audience">👥 {r.audience}</span>
                                <div className="tags">
                                    {(r.tags || []).slice(0, 3).map(t => (
                                        <span key={t} className="chip">#{t}</span>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="btn-ghost"
                                onClick={() => { setActive(r); setOpen(true); }}
                            >
                                Ver recurso
                            </button>
                        </article>
                    ))}

                    {filtered.length === 0 && (
                        <div className="empty">
                            <p>No se encontraron recursos para tu búsqueda.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title={active?.question}>
                {active && (
                    <>
                        <p className="definition">{active.definition}</p>

                        {active.actions?.length > 0 && (
                            <div className="actions-block">
                                <h4>✅ Acciones recomendadas</h4>
                                <ul className="actions-list">
                                    {active.actions.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="links-list">
                            {active.links?.map(l => (
                                <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                                    🔗 {l.label}
                                </a>
                            ))}
                        </div>

                        {active.pdf && (
                            <div className="pdf-section">
                                <a className="btn-secondary" href={active.pdf} target="_blank" rel="noreferrer">
                                    📄 Abrir PDF
                                </a>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </section>
    );
}
