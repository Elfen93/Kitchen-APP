import { useI18n } from '../i18n/index.jsx';

const KOFI = import.meta.env.VITE_KOFI_URL;
const PAYPAL = import.meta.env.VITE_PAYPAL_URL;

export default function AboutView() {
  const { t } = useI18n();
  const share = async () => {
    const data = { title: '買い物 Cook', text: t('tagline'), url: location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); alert(t('linkCopied')); }
    } catch { /* cancelled */ }
  };
  return (
    <div className="stack">
      <div className="card">
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>{t('why')}</h2>
        <p className="muted">{t('whyBody')}</p>
      </div>
      <div className="card">
        <p className="eyebrow">{t('yourData')}</p>
        <p className="small muted">{t('dataBody')}</p>
      </div>
      <div className="card">
        <p className="eyebrow">{t('prices')}</p>
        <p className="small muted">{t('pricesBody')}</p>
      </div>
      {(KOFI || PAYPAL) && (
        <div className="card">
          <p className="eyebrow">{t('support')}</p>
          <p className="small muted mb">{t('supportBody')}</p>
          <div className="stack" style={{ gap: 8 }}>
            {KOFI && <a className="btn accent block" href={KOFI} target="_blank" rel="noopener noreferrer">☕ Ko-fi</a>}
            {PAYPAL && <a className="btn block" href={PAYPAL} target="_blank" rel="noopener noreferrer">PayPal</a>}
          </div>
        </div>
      )}
      <button className="btn block" onClick={share}>{t('shareApp')}</button>
    </div>
  );
}
