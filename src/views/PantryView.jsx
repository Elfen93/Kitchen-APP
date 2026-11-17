import { useState } from 'react';
import { ChefHat, Plus, X } from 'lucide-react';
import { COMMON_INGREDIENTS } from '../data/guide.js';
import { useI18n } from '../i18n/index.jsx';

export default function PantryView({ pantry, setPantry, onCookWithPantry }) {
  const { t, tg } = useI18n();
  const [custom, setCustom] = useState('');
  const has = new Set(pantry.map((p) => p.toLowerCase()));
  const toggle = (item) =>
    setPantry((list) => (list.some((x) => x.toLowerCase() === item.toLowerCase())
      ? list.filter((x) => x.toLowerCase() !== item.toLowerCase())
      : [...list, item]));
  const add = (e) => {
    e.preventDefault();
    const v = custom.trim().slice(0, 40);
    if (v && !has.has(v.toLowerCase())) setPantry((l) => [...l, v]);
    setCustom('');
  };

  return (
    <>
      <div className="section-head">
        <h2>{t('myPantry')}</h2>
        <p>{t('pantryIntro')}</p>
      </div>

      {pantry.length > 0 && (
        <div className="card mb">
          <div className="row" style={{ marginBottom: 8 }}>
            <p className="eyebrow grow" style={{ margin: 0 }}>{t('atHome', { n: pantry.length })}</p>
            <button className="btn sm ghost" onClick={() => setPantry([])}>{t('clear')}</button>
          </div>
          <div className="row wrap">
            {pantry.map((p) => (
              <button key={p} className="chip good" aria-pressed="true" onClick={() => toggle(p)} aria-label={`${t('remove')} ${tg(p)}`}>
                {tg(p)} <X size={12} />
              </button>
            ))}
          </div>
          <button className="btn primary block mt" onClick={onCookWithPantry}>
            <ChefHat size={16} /> {t('showPantryRecipes')}
          </button>
        </div>
      )}

      <form className="row mb" onSubmit={add}>
        <input className="input grow" placeholder={t('addAnything')} value={custom} onChange={(e) => setCustom(e.target.value)} aria-label={t('addAnything')} />
        <button className="icon-btn" type="submit" aria-label={t('add')}><Plus size={18} /></button>
      </form>

      <p className="eyebrow">{t('commonItems')}</p>
      <div className="row wrap">
        {COMMON_INGREDIENTS.filter((i) => !has.has(i.toLowerCase())).map((i) => (
          <button key={i} className="chip" aria-pressed="false" onClick={() => toggle(i)}>
            <Plus size={12} /> {tg(i)}
          </button>
        ))}
      </div>
    </>
  );
}
