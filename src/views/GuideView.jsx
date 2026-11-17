import { PANTRY_STAPLES, SEASONAL, SHELF_WORDS, STORES, currentSeason } from '../data/guide.js';

export default function GuideView() {
  const season = currentSeason();
  return (
    <div className="stack">
      <div className="card dark">
        <p className="eyebrow faint">In season now · {season}</p>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>Cheapest and best produce right now</p>
        <div className="row wrap">{SEASONAL[season].map((p) => <span key={p} className="tag" style={{ background: 'rgba(255,255,255,0.12)', color: 'inherit' }}>{p}</span>)}</div>
      </div>

      <div>
        <p className="eyebrow">Where to shop</p>
        <div className="stack" style={{ gap: 6 }}>
          {STORES.map((s) => (
            <details key={s.name} className="card">
              <summary>{s.name} <span className="ja faint small">{s.ja}</span></summary>
              <p className="small muted">{s.tip}</p>
            </details>
          ))}
        </div>
        <p className="small faint" style={{ marginTop: 6 }}>Sales days and app deals change often — check the store's own flyer (チラシ) before relying on them.</p>
      </div>

      <div className="card">
        <p className="eyebrow">Words on the shelf</p>
        <div className="kv">
          {SHELF_WORDS.map((w) => [<span key={w.ja + 'k'} className="k ja">{w.ja}</span>, <span key={w.ja + 'v'} className="muted">{w.en}</span>])}
        </div>
      </div>

      <div>
        <p className="eyebrow">Pantry basics</p>
        <div className="stack" style={{ gap: 6 }}>
          {PANTRY_STAPLES.map((s) => (
            <div key={s.en} className="card">
              <p><b>{s.en}</b> <span className="ja faint small">{s.ja}</span></p>
              <p className="small muted">{s.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
