export const AQI_CATEGORIES = [
    { name: "Bueno",           min: 0,   max: 50,  color: "#00e400",
        msg: "Puedes salir con normalidad." },
    { name: "Moderado",        min: 50,  max: 100, color: "#ffff00",
        msg: "Personas sensibles: limiten actividades intensas al aire libre." },
    { name: "Sensible",        min: 100, max: 150, color: "#ff7e00",
        msg: "Personas sensibles deben reducir esfuerzos y tiempo al aire libre." },
    { name: "No recomendable", min: 150, max: 200, color: "#ff0000",
        msg: "Evita actividades al aire libre; permanece bajo techo si es posible." },
    { name: "Muy peligroso",   min: 200, max: 300, color: "#8f3f97",
        msg: "Permanece en interiores; cierra ventanas y usa ventilación/filtrado." },
];

export function getCategory(aqi) {
    for (let i = 0; i < AQI_CATEGORIES.length; i++) {
        const c = AQI_CATEGORIES[i];
        const isLast = i === AQI_CATEGORIES.length - 1;
        if (aqi >= c.min && (isLast ? aqi <= c.max : aqi < c.max)) return c;
    }
    return AQI_CATEGORIES[0];
}
