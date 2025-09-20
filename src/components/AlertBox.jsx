export default function AlertBox({ title, items = [], tone = 'alert' }) {
  return (
    <div className='card card--pad'>
      <div className='alert-title'>
        <span
          className='alert-dot'
          style={{ background: tone === 'alert' ? '#f59e0b' : '#22c55e' }}
        />
        <span>{title}</span>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
        {items.map((it, idx) => (
          <div key={idx} className='reco-item'>
            <span>{it.text}</span>
            <a href='#!' className='kbd'>
              {it.action}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
