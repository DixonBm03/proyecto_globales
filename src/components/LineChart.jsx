// Simple line chart con SVG puro
export default function LineChart({ data, height=160, min=10, max=28 }) {
    const padX = 24, padY = 20;
    const W = 1000, H = height;
    const xs = data.map((_,i)=> padX + (i*(W-2*padX))/(data.length-1));
    const scaleY = v => {
        const t = (v - min) / (max - min);
        return H - padY - t*(H-2*padY);
    };
    const path = data
        .map((v,i)=> `${i===0?'M':'L'} ${xs[i]} ${scaleY(v)}`)
        .join(" ");

    return (
        <div className="card card--pad" style={{overflow:"hidden"}}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Gráfico de temperatura">
                {/* grid */}
                {[...Array(4)].map((_,i)=>(
                    <line key={i} x1={padX} x2={W-padX}
                          y1={padY + i*((H-2*padY)/3)}
                          y2={padY + i*((H-2*padY)/3)}
                          stroke="#e5e7eb"/>
                ))}
                <path d={path} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
        </div>
    );
}
