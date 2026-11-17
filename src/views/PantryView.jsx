import { useState } from 'react';
import { ChefHat, Plus, X } from 'lucide-react';
import { COMMON_INGREDIENTS } from '../data/guide.js';

export default function PantryView({ pantry, setPantry, onCookWithPantry }) {
  const [custom, setCustom] = useState('');
  const has = new Set(pantry.map((p) => p.toLowerCase()));
  const toggle = (item) =>
    setPantry((list) => (list.some((x) => x.toLowerCase() === item.toLowerCase())
      ? list.filter((x) => x.toLowerCase() !== item.toLowerCase())
      : [...list, item]));
  const add = (e) => {
    e.preventDefault();
    const t = custom.trim().slice(0, 40);
    if (t && !has.has(t.toLowerCase())) setPantry((l) => [...l, t]);
    setCustom('');
  };

  return (
    <>
      <div className="section-head">
        <h2>My pantry</h2>
        <p>Mark what's already in your kitchen. Recipes that use it go first, so less food gets thrown away and you buy less.</p>
      </div>

      {pantry.length > 0 && (
        <div className="card mb">
          <div className="row" style={{ marginBottom: 8 }}>
            <p className="eyebrow grow" style={{ margin: 0 }}>{pantry.length} at home</p>
            <button className="btn sm ghost" onClick={() => setPantry([])}>Clear</button>
          </div>
          <div className="row wrap">
            {pantry.map((p) => (
              <button key={p} className="chip good" aria-pressed="true" onClick={() => toggle(p)} aria-label={`Remove ${p}`}>
                {p} <X size={12} />
              </button>
            ))}
          </div>
          <button className="btn primary block mt" onClick={onCookWithPantry}>
            <ChefHat size={16} /> Show recipes that use these
          </button>
        </div>
      )}

      <form className="row mb" onSubmit={add}>
        <input className="input grow" placeholder="Add anything, e.g. leftover kabocha" value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Add pantry item" />
        <button className="icon-btn" type="submit" aria-label="Add"><Plus size={18} /></button>
      </form>

      <p className="eyebrow">Common items</p>
      <div className="row wrap">
        {COMMON_INGREDIENTS.filter((i) => !has.has(i.toLowerCase())).map((i) => (
          <button key={i} className="chip" aria-pressed="false" onClick={() => toggle(i)}>
            <Plus size={12} /> {i}
          </button>
        ))}
      </div>
    </>
  );
}
