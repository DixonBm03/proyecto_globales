import { weekly, hourlyTempsForChart } from '../data/mockWeather';
import LineChart from '../components/LineChart';

export default function Forecast() {
  return (
    <>
      <h1 className='h1'>Pronóstico semanal</h1>
      <p className='p' style={{ textAlign: 'center' }}>
        Aquí tienes un resumen del pronóstico semanal de temperatura y de
        lluvia.
      </p>

      <div className='day-strip'>
        {weekly.map(d => (
          <div className='day-card' key={d.day}>
            <div className='top'>{d.day}</div>
            <div style={{ fontSize: 28 }}>{d.icon}</div>
            <div className='temp-range'>
              {d.max}°C | {d.min}°C
            </div>
          </div>
        ))}
      </div>

      <h2 className='h2'>Temperatura</h2>
      <LineChart data={hourlyTempsForChart} min={15} max={26} />
    </>
  );
}
