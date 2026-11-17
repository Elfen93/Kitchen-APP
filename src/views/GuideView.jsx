import { PANTRY_STAPLES, SEASONAL, SHELF_WORDS, STORES, currentSeason } from '../data/guide.js';
import { useI18n } from '../i18n/index.jsx';

export default function GuideView() {
  const { t, tg, lang } = useI18n();
  const season = currentSeason();
  return (
    <div className="stack">
      <div className="card dark">
        <p className="eyebrow faint">{t('inSeason', { s: t(season) })}</p>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>{t('seasonBody')}</p>
        <div className="row wrap">{SEASONAL[season].map((p) => <span key={p} className="tag" style={{ background: 'rgba(255,255,255,0.12)', color: 'inherit' }}>{tg(p)}</span>)}</div>
      </div>

      <div>
        <p className="eyebrow">{t('whereShop')}</p>
        <div className="stack" style={{ gap: 6 }}>
          {STORES.map((s) => (
            <details key={s.name} className="card">
              <summary>{tg(s.name)} {lang !== 'ja' && <span className="ja faint small">{s.ja}</span>}</summary>
              <p className="small muted">{tg(s.tip)}</p>
            </details>
          ))}
        </div>
        <p className="small faint" style={{ marginTop: 6 }}>{t('flyerNote')}</p>
      </div>

      <div className="card">
        <p className="eyebrow">{t('shelfWords')}</p>
        <div className="kv">
          {SHELF_WORDS.map((w) => [<span key={w.ja + 'k'} className="k ja">{w.ja}</span>, <span key={w.ja + 'v'} className="muted">{tg(w.en)}</span>])}
        </div>
      </div>

      <div>
        <p className="eyebrow">{t('pantryBasics')}</p>
        <div className="stack" style={{ gap: 6 }}>
          {PANTRY_STAPLES.map((s) => (
            <div key={s.en} className="card">
              <p><b>{tg(s.en)}</b> {lang !== 'ja' && <span className="ja faint small">{s.ja}</span>}</p>
              <p className="small muted">{tg(s.tip)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
