export default function Modal({ open, onClose, children, title }) {
    if (!open) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <h3>{title}</h3>
                    <button className="icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
