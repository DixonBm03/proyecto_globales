export default function Modal({
  open,
  onClose,
  children,
  title,
  emergency = false,
}) {
  if (!open) return null;

  const backdropClass = emergency
    ? 'modal-backdrop emergency'
    : 'modal-backdrop';
  const modalClass = emergency ? 'modal emergency' : 'modal';

  return (
    <div className={backdropClass} onClick={onClose}>
      <div className={modalClass} onClick={e => e.stopPropagation()}>
        <div className='modal-head'>
          <h3>{title}</h3>
          <button className='icon-btn' onClick={onClose} aria-label='Cerrar'>
            ✕
          </button>
        </div>
        <div className='modal-body'>{children}</div>
      </div>
    </div>
  );
}
