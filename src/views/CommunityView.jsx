import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { fetchCommunity, likeCommunity, submitCommunity } from '../lib/api.js';
import { isAllowed } from '../lib/diet.js';
import { MEAL_TYPES } from '../data/guide.js';

export default function CommunityView({ settings, onOpen, liked, setLiked }) {
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
        <h2>Community</h2>
        <p>Cheap dishes shared by other people cooking in Japan.</p>
      </div>

      {state.disabled ? (
        <div className="notice info"><AlertCircle size={16} /><span>Community recipes aren't switched on for this server yet. Everything else works normally.</span></div>
      ) : (
        <>
          <div className="row mb">
            <div className="seg grow">
              <button className="chip" aria-pressed={sort === 'new'} onClick={() => setSort('new')}>Newest</button>
              <button className="chip" aria-pressed={sort === 'top'} onClick={() => setSort('top')}>Most liked</button>
            </div>
            <button className="btn sm primary" onClick={() => setShowForm(true)}><Plus size={14} /> Share</button>
          </div>
          {state.error && <div className="notice mb"><AlertCircle size={16} /><span>{state.error}</span></div>}
          <div className="stack">
            {state.loading && <div className="skeleton" />}
            {!state.loading && !visible.length && !state.error && (
              <div className="empty card"><div className="big">🍲</div><h3>Nothing here yet</h3><p className="small">Share the cheap dish you make every week.</p></div>
            )}
            {visible.map((r) => (
              <div key={r.key}>
                <RecipeCard recipe={r} onOpen={onOpen} mealBudget={settings.weeklyBudget / 21} />
                <div className="row small faint" style={{ padding: '4px 6px' }}>
                  <span className="grow">by {r.author}</span>
                  <button className="btn sm ghost" onClick={() => like(r.id)} disabled={liked.includes(r.id)} aria-label="Like">
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
    <Sheet title="Share a recipe" eyebrow="Community" onClose={onClose} labelledBy="share-title">
      <form className="stack" onSubmit={submit}>
        <div className="notice info small"><span>Public for everyone. Please don't include personal details.</span></div>
        <label className="field">Dish name *<input className="input" required maxLength={80} value={f.title} onChange={set('title')} /></label>
        <div className="grid-2">
          <label className="field">Japanese name<input className="input" maxLength={60} value={f.titleJa} onChange={set('titleJa')} /></label>
          <label className="field">Your name<input className="input" maxLength={40} placeholder="Anonymous" value={f.author} onChange={set('author')} /></label>
        </div>
        <div className="seg">
          {MEAL_TYPES.map((m) => <button type="button" key={m.id} className="chip" aria-pressed={f.mealType === m.id} onClick={() => setF((x) => ({ ...x, mealType: m.id }))}>{m.label}</button>)}
        </div>
        <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <label className="field">Servings<input className="input" type="number" min={1} max={12} value={f.servings} onChange={set('servings')} /></label>
          <label className="field">Prep min<input className="input" type="number" min={0} value={f.prepTime} onChange={set('prepTime')} /></label>
          <label className="field">Cook min<input className="input" type="number" min={0} value={f.cookTime} onChange={set('cookTime')} /></label>
        </div>

        <p className="eyebrow" style={{ marginBottom: 0 }}>Ingredients *</p>
        {ings.map((ing, i) => (
          <div key={i} className="card" style={{ padding: 10 }}>
            <div className="row">
              <input className="input grow" placeholder="Ingredient" value={ing.en} onChange={(e) => setIng(i, 'en', e.target.value)} aria-label="Ingredient name" />
              <input className="input" style={{ width: 110 }} placeholder="日本語" value={ing.ja} onChange={(e) => setIng(i, 'ja', e.target.value)} aria-label="Japanese name" />
              <button type="button" className="remove" onClick={() => setIngs((l) => l.filter((_, j) => j !== i))} aria-label="Remove ingredient"><Trash2 size={15} /></button>
            </div>
            <div className="row" style={{ marginTop: 6 }}>
              <input className="input" inputMode="decimal" placeholder="Amount" value={ing.amount} onChange={(e) => setIng(i, 'amount', e.target.value)} aria-label="Amount" />
              <select className="input" value={ing.unit} onChange={(e) => setIng(i, 'unit', e.target.value)} aria-label="Unit">
                <option value="g">g</option><option value="ml">ml</option><option value="unit">pieces</option><option value="pack">packs</option>
              </select>
              <input className="input" inputMode="numeric" placeholder="¥ cost" value={ing.price} onChange={(e) => setIng(i, 'price', e.target.value)} aria-label="Cost in yen" />
            </div>
          </div>
        ))}
        <button type="button" className="btn sm ghost" onClick={() => setIngs((l) => [...l, emptyIng()])}><Plus size={14} /> Ingredient</button>

        <p className="eyebrow" style={{ marginBottom: 0 }}>Steps *</p>
        {steps.map((s, i) => (
          <div key={i} className="row">
            <span className="mono small faint" style={{ width: 18 }}>{i + 1}</span>
            <textarea className="input grow" style={{ minHeight: 56 }} value={s} onChange={(e) => setSteps((l) => l.map((x, j) => (j === i ? e.target.value : x)))} aria-label={`Step ${i + 1}`} />
          </div>
        ))}
        <button type="button" className="btn sm ghost" onClick={() => setSteps((l) => [...l, ''])}><Plus size={14} /> Step</button>

        <label className="field">Money-saving tip<textarea className="input" maxLength={300} value={f.tip} onChange={set('tip')} /></label>
        {error && <div className="notice"><AlertCircle size={16} /><span>{error}</span></div>}
        <button className="btn primary block" disabled={busy} type="submit">{busy ? 'Sharing…' : 'Share recipe'}</button>
      </form>
    </Sheet>
  );
}
