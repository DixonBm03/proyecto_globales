import { useEffect, useRef } from 'react';
import '../styles/Modal.css';

export default function Modal({ open, onClose, children, title, emergency = false }) {
    const closeRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    const backdropClass = emergency ? 'modal-backdrop emergency' : 'modal-backdrop';
    const modalClass = emergency ? 'modal emergency' : 'modal';

    return (
        <div className={backdropClass} onClick={onClose} aria-hidden="true">
            <div
                className={`${modalClass} show`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 id="modal-title">{title}</h3>
                    <button
                        ref={closeRef}
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        title="Cerrar"
                    >
                        ✕
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
