export const AQI_CATEGORIES = [
  {
    name: 'Bueno',
    min: 0,
    max: 50,
    color: '#00e400',
    msg: 'Puedes salir con normalidad.',
  },
  {
    name: 'Moderado',
    min: 50,
    max: 100,
    color: '#ffff00',
    msg: 'Personas sensibles: limiten actividades intensas al aire libre.',
  },
  {
    name: 'Sensible',
    min: 100,
    max: 150,
    color: '#ff7e00',
    msg: 'Personas sensibles deben reducir esfuerzos y tiempo al aire libre.',
  },
  {
    name: 'No recomendable',
    min: 150,
    max: 200,
    color: '#ff0000',
    msg: 'Evita actividades al aire libre; permanece bajo techo si es posible.',
  },
  {
    name: 'Muy peligroso',
    min: 200,
    max: 300,
    color: '#8f3f97',
    msg: 'Permanece en interiores; cierra ventanas y usa ventilación/filtrado.',
  },
];

export function getCategory(aqi) {
  for (let i = 0; i < AQI_CATEGORIES.length; i++) {
    const c = AQI_CATEGORIES[i];
    const isLast = i === AQI_CATEGORIES.length - 1;
    if (aqi >= c.min && (isLast ? aqi <= c.max : aqi < c.max)) return c;
  }
  return AQI_CATEGORIES[0];
}

/** Recorta el AQI a tu escala visual 0–300 */
export function clampToScale(aqi) {
  if (aqi == null || Number.isNaN(aqi)) return null;
  return Math.max(0, Math.min(300, Math.round(aqi)));
}

/** Devuelve un número de severidad para comparar cambios (0..5 aprox) */
export function severityIndex(aqi) {
  if (aqi == null) return 0;
  if (aqi < 51) return 1; // Bueno
  if (aqi < 101) return 2; // Moderado
  if (aqi < 151) return 3; // Sensible
  if (aqi < 201) return 4; // No recomendable
  return 5; // Muy peligroso (200+)
}

export function actionableTips(aqi) {
  if (aqi >= 150) {
    return [
      'Cerrar ventanas y puertas.',
      'Usar purificador/filtro HEPA si es posible.',
      'Evitar vías con alto tráfico.',
      'Limitar ejercicio intenso al aire libre.',
      'Usar mascarilla (N95/KN95) si debes salir.',
    ];
  }
  if (aqi >= 100) {
    return [
      'Personas sensibles: reducir esfuerzos al aire libre.',
      'Preferir horas tempranas o nocturnas.',
      'Evitar zonas con mucho tráfico.',
    ];
  }
  return ['Actividad normal.', 'Ventilar tu casa de forma habitual.'];
}
