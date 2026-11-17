import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { fetchCommunity, likeCommunity, submitCommunity } from '../lib/api.js';
import { isAllowed } from '../lib/diet.js';
import { MEAL_TYPES } from '../data/guide.js';
import { useI18n } from '../i18n/index.jsx';

export default function CommunityView({ settings, onOpen, liked, setLiked }) {
  const { t } = useI18n();
  const [sort, setSort] = useState('new');
  const [state, setState] = useState({ loading: true, error: null, disabled: false, recipes: [] });
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const r = await fetchCommunity(sort);
      setState({ loading: false, error: null, disabled: r.disabled, recipes: r.recipes });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, [sort]);
  useEffect(() => { load(); }, [load]);

  const like = async (id) => {
    if (liked.includes(id)) return;
    setLiked((l) => [...l, id]);
    setState((s) => ({ ...s, recipes: s.recipes.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r)) }));
    try { await likeCommunity(id); } catch { /* keep optimistic */ }
  };

  const visible = state.recipes
    .map((r) => ({ ...r, key: `c-${r.id}`, source: 'community' }))
    .filter((r) => isAllowed(r, settings.diet, settings.allergies));

  return (
    <>
      <div className="section-head">
        <h2>{t('pageCommunity')}</h2>
        <p>{t('communityIntro')}</p>
      </div>

      {state.disabled ? (
        <div className="notice info"><AlertCircle size={16} /><span>{t('communityOff')}</span></div>
      ) : (
        <>
          <div className="row mb">
            <div className="seg grow">
              <button className="chip" aria-pressed={sort === 'new'} onClick={() => setSort('new')}>{t('newest')}</button>
              <button className="chip" aria-pressed={sort === 'top'} onClick={() => setSort('top')}>{t('mostLiked')}</button>
            </div>
            <button className="btn sm primary" onClick={() => setShowForm(true)}><Plus size={14} /> {t('share')}</button>
          </div>
          {state.error && <div className="notice mb"><AlertCircle size={16} /><span>{state.error}</span></div>}
          <div className="stack">
            {state.loading && <div className="skeleton" />}
            {!state.loading && !visible.length && !state.error && (
              <div className="empty card"><div className="big">🍲</div><h3>{t('nothingYet')}</h3><p className="small">{t('nothingYetBody')}</p></div>
            )}
            {visible.map((r) => (
              <div key={r.key}>
                <RecipeCard recipe={r} onOpen={onOpen} mealBudget={settings.weeklyBudget / 21} />
                <div className="row small faint" style={{ padding: '4px 6px' }}>
                  <span className="grow">{t('by')} {r.author}</span>
                  <button className="btn sm ghost" onClick={() => like(r.id)} disabled={liked.includes(r.id)} aria-label={t('like')}>
                    <ThumbsUp size={14} /> {r.likes || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showForm && <SubmitForm onClose={() => setShowForm(false)} onDone={() => { setShowForm(false); setSort('new'); load(); }} />}
    </>
  );
}

const emptyIng = () => ({ en: '', ja: '', amount: '', unit: 'g', price: '' });

function SubmitForm({ onClose, onDone }) {
  const { t, tg } = useI18n();
  const [f, setF] = useState({ title: '', titleJa: '', author: '', mealType: 'dinner', servings: 2, prepTime: 10, cookTime: 15, tip: '' });
  const [ings, setIngs] = useState([emptyIng(), emptyIng()]);
  const [steps, setSteps] = useState(['', '']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const setIng = (i, k, v) => setIngs((l) => l.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await submitCommunity({
        ...f,
        servings: Number(f.servings), prepTime: Number(f.prepTime), cookTime: Number(f.cookTime),
        ingredients: ings.filter((i) => i.en.trim()).map((i) => ({ ...i, amount: Number(i.amount) || 0, price: Number(i.price) || 0 })),
        steps: steps.filter((s) => s.trim()),
      });
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Sheet title={t('shareRecipe')} eyebrow={t('community')} onClose={onClose} labelledBy="share-title">
      <form className="stack" onSubmit={submit}>
        <div className="notice info small"><span>{t('publicNote')}</span></div>
        <label className="field">{t('dishName')}<input className="input" required maxLength={80} value={f.title} onChange={set('title')} /></label>
        <div className="grid-2">
          <label className="field">{t('jaName')}<input className="input" maxLength={60} value={f.titleJa} onChange={set('titleJa')} /></label>
          <label className="field">{t('yourName')}<input className="input" maxLength={40} placeholder={t('anonymous')} value={f.author} onChange={set('author')} /></label>
        </div>
        <div className="seg">
          {MEAL_TYPES.map((m) => <button type="button" key={m.id} className="chip" aria-pressed={f.mealType === m.id} onClick={() => setF((x) => ({ ...x, mealType: m.id }))}>{tg(m.label)}</button>)}
        </div>
        <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <label className="field">{t('servings')}<input className="input" type="number" min={1} max={12} value={f.servings} onChange={set('servings')} /></label>
          <label className="field">{t('prepMin')}<input className="input" type="number" min={0} value={f.prepTime} onChange={set('prepTime')} /></label>
          <label className="field">{t('cookMin')}<input className="input" type="number" min={0} value={f.cookTime} onChange={set('cookTime')} /></label>
        </div>

        <p className="eyebrow" style={{ marginBottom: 0 }}>{t('ingredientsReq')}</p>
        {ings.map((ing, i) => (
          <div key={i} className="card" style={{ padding: 10 }}>
            <div className="row">
              <input className="input grow" placeholder={t('ingredient')} value={ing.en} onChange={(e) => setIng(i, 'en', e.target.value)} aria-label={t('ingredient')} />
              <input className="input" style={{ width: 110 }} placeholder="日本語" value={ing.ja} onChange={(e) => setIng(i, 'ja', e.target.value)} aria-label={t('jaName')} />
              <button type="button" className="remove" onClick={() => setIngs((l) => l.filter((_, j) => j !== i))} aria-label={t('remove')}><Trash2 size={15} /></button>
            </div>
            <div className="row" style={{ marginTop: 6 }}>
              <input className="input" inputMode="decimal" placeholder={t('amount')} value={ing.amount} onChange={(e) => setIng(i, 'amount', e.target.value)} aria-label={t('amount')} />
              <select className="input" value={ing.unit} onChange={(e) => setIng(i, 'unit', e.target.value)} aria-label={t('unit')}>
                <option value="g">g</option><option value="ml">ml</option><option value="unit">{t('pieces')}</option><option value="pack">{t('packs')}</option>
              </select>
              <input className="input" inputMode="numeric" placeholder={t('costYen')} value={ing.price} onChange={(e) => setIng(i, 'price', e.target.value)} aria-label={t('costYen')} />
            </div>
          </div>
        ))}
        <button type="button" className="btn sm ghost" onClick={() => setIngs((l) => [...l, emptyIng()])}><Plus size={14} /> {t('addIngredient')}</button>

        <p className="eyebrow" style={{ marginBottom: 0 }}>{t('stepsReq')}</p>
        {steps.map((s, i) => (
          <div key={i} className="row">
            <span className="mono small faint" style={{ width: 18 }}>{i + 1}</span>
            <textarea className="input grow" style={{ minHeight: 56 }} value={s} onChange={(e) => setSteps((l) => l.map((x, j) => (j === i ? e.target.value : x)))} aria-label={`${t('addStep')} ${i + 1}`} />
          </div>
        ))}
        <button type="button" className="btn sm ghost" onClick={() => setSteps((l) => [...l, ''])}><Plus size={14} /> {t('addStep')}</button>

        <label className="field">{t('tipField')}<textarea className="input" maxLength={300} value={f.tip} onChange={set('tip')} /></label>
        {error && <div className="notice"><AlertCircle size={16} /><span>{error}</span></div>}
        <button className="btn primary block" disabled={busy} type="submit">{busy ? t('sharing') : t('shareRecipe')}</button>
      </form>
    </Sheet>
  );
}
