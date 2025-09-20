export default function StatCard({ icon = '☁️', label = 'N/A', value = '—' }) {
  return (
    <div className='card weather-mini'>
      <div className='weather-mini__icon' aria-hidden>
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className='weather-mini__temp'>{value}</div>
        <div className='p' style={{ fontSize: 12 }}>
          {label}
        </div>
      </div>
    </div>
  );
}
