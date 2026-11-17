import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/** Bottom sheet / dialog. Closes on backdrop tap and Escape. */
export default function Sheet({ title, eyebrow, onClose, children, labelledBy }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} ref={ref}>
        <div className="sheet-grip" />
        {title !== undefined && (
          <div className="sheet-head">
            <div>
              {eyebrow && <p className="eyebrow" style={{ marginBottom: 2 }}>{eyebrow}</p>}
              <h2 id={labelledBy}>{title}</h2>
            </div>
            <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
