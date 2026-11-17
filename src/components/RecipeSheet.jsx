import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, Heart, Minus, Pause, Play, Plus, RotateCcw, ShoppingBasket, Timer, X } from 'lucide-react';
import Sheet from './Sheet.jsx';
import { applyPriceBook, costPerServing, formatAmount, priceBookEntry, recipeCost, scaleRecipe, yen } from '../lib/recipe.js';
import { CATEGORY_LABELS, conflicts, containsAllergens, dietBadges } from '../lib/diet.js';
import { itemKey } from '../lib/shopping.js';
import { DIET_PROFILES } from '../data/guide.js';

const DIET_LABEL = Object.fromEntries(DIET_PROFILES.map((d) => [d.id, `${d.emoji} ${d.label}`]));

function useCountdown() {
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      const s = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        setRunning(false);
        try { navigator.vibrate?.([300, 150, 300]); } catch { /* unsupported */ }
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);
  return {
    left,
    running,
    start(sec) { endRef.current = Date.now() + sec * 1000; setLeft(sec); setRunning(true); },
    toggle() {
      if (running) setRunning(false);
      else if (left > 0) { endRef.current = Date.now() + left * 1000; setRunning(true); }
    },
    reset() { setRunning(false); setLeft(0); },
  };
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function RecipeSheet({ recipe: base, settings, priceBook, onSetPrice, isFav, onToggleFav, onAddToList, onClose }) {
  const [servings, setServings] = useState(base.servings || 1);
  const [have, setHave] = useState({});
  const [editing, setEditing] = useState(null);
  const [added, setAdded] = useState(false);
  const timer = useCountdown();

  const recipe = useMemo(
    () => scaleRecipe(applyPriceBook(base, priceBook), servings),
    [base, priceBook, servings],
  );
  const total = recipeCost(recipe);
  const per = costPerServing(recipe);
  const mealBudget = settings.weeklyBudget / 21;
  const problems = conflicts(base, settings.diet, settings.allergies);
  const allergens = containsAllergens(base);
  const badges = dietBadges(base);
  const missing = recipe.ingredients.filter((_, i) => !have[i]);

  const addMissing = () => {
    onAddToList({ ...recipe, ingredients: missing });
    setAdded(true);
  };

  return (
    <Sheet onClose={onClose} labelledBy="recipe-title">
      <div className="hero">
        <div className="art" aria-hidden="true">{recipe.emoji || '🍽️'}</div>
        <div className="grow">
          <p className="eyebrow" style={{ marginBottom: 2 }}>{recipe.difficulty} · {recipe.mealType}{recipe.author ? ` · by ${recipe.author}` : ''}</p>
          <h2 id="recipe-title" style={{ fontSize: 22 }}>{recipe.title}</h2>
          {recipe.titleJa && <p className="ja faint">{recipe.titleJa}</p>}
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close" style={{ alignSelf: 'flex-start' }}><X size={18} /></button>
      </div>

      <div className="row mt">
        <button className={`btn sm ${isFav ? 'accent' : ''}`} onClick={() => onToggleFav(base)} aria-pressed={isFav}>
          <Heart size={15} fill={isFav ? 'currentColor' : 'none'} /> {isFav ? 'Saved' : 'Save'}
        </button>
        <div className="grow" />
        <span className="small faint">Servings</span>
        <div className="stepper">
          <button onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="Fewer servings"><Minus size={15} /></button>
          <span aria-live="polite">{servings}</span>
          <button onClick={() => setServings((s) => Math.min(12, s + 1))} aria-label="More servings"><Plus size={15} /></button>
        </div>
      </div>

      {problems.length > 0 && (
        <div className="notice mt" role="alert">
          <AlertTriangle size={16} />
          <span>Not suitable for your profile — contains <b>{problems.join(', ')}</b>.</span>
        </div>
      )}

      <div className="stats">
        <div className="stat"><b style={{ color: per > mealBudget ? 'var(--bad)' : 'var(--good)' }}>{yen(per)}</b><small>/serving</small></div>
        <div className="stat"><b>{yen(total)}</b><small>total</small></div>
        <div className="stat"><b>{(recipe.prepTime || 0) + (recipe.cookTime || 0)}′</b><small>minutes</small></div>
        <div className="stat"><b>{recipe.calories || '—'}</b><small>kcal</small></div>
      </div>

      {recipe.macros && (
        <p className="small muted mb">
          Per serving: <b>{recipe.macros.protein} g</b> protein · {recipe.macros.carbs} g carbs · {recipe.macros.fat} g fat
          {settings.calorieGoal ? <> · {Math.round(((recipe.calories || 0) / settings.calorieGoal) * 100)}% of your daily {settings.calorieGoal} kcal</> : null}
        </p>
      )}

      <div className="tags mb">
        {badges.map((b) => <span key={b} className="tag good">{DIET_LABEL[b]}</span>)}
        {allergens.map((a) => <span key={a} className="tag warn">Contains {CATEGORY_LABELS[a].toLowerCase()}</span>)}
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 4 }}>
          <p className="eyebrow grow" style={{ margin: 0 }}>Ingredients</p>
          <span className="small faint">Tick what you have</span>
        </div>
        {recipe.ingredients.map((ing, i) => (
          <div className="ing" key={i}>
            <button className={`check ${have[i] ? 'on' : ''}`} onClick={() => setHave((h) => ({ ...h, [i]: !h[i] }))} aria-pressed={!!have[i]} aria-label={`I have ${ing.en}`}>
              {have[i] && <Check size={14} />}
            </button>
            <div>
              <p className={`name ${have[i] ? 'done' : ''}`}>{ing.en}</p>
              <p className="sub"><span className="ja">{ing.ja}</span>{ing.ja ? ' · ' : ''}{formatAmount(ing.amount, ing.unit)}</p>
            </div>
            <button className="price" onClick={() => setEditing(i)} aria-label={`Edit price of ${ing.en}`} title="Tap to set what you pay">
              {yen(ing.price)}{ing.userPrice ? ' ✓' : ''}
            </button>
          </div>
        ))}
        <p className="small faint" style={{ marginTop: 8 }}>Prices are estimates for the amount used. Tap a price to enter what you pay — it updates every recipe.</p>
        <button className="btn primary block mt" onClick={addMissing} disabled={!missing.length}>
          {added ? <><Check size={16} /> Added to list</> : <><ShoppingBasket size={16} /> Add {missing.length} item{missing.length === 1 ? '' : 's'} to shopping list</>}
        </button>
      </div>

      {editing !== null && (
        <PriceEditor
          ing={recipe.ingredients[editing]}
          onCancel={() => setEditing(null)}
          onSave={(entry) => { onSetPrice(itemKey(recipe.ingredients[editing]), entry); setEditing(null); }}
          onClear={() => { onSetPrice(itemKey(recipe.ingredients[editing]), null); setEditing(null); }}
        />
      )}

      <div className="card mt">
        <p className="eyebrow">Steps</p>
        <ol className="steps">{recipe.steps.map((s, i) => <li key={i}><span>{s}</span></li>)}</ol>
        {recipe.equipment?.length > 0 && <p className="small faint" style={{ marginTop: 6 }}>You need: {recipe.equipment.join(', ')}</p>}
      </div>

      {recipe.tip && <div className="notice info mt"><span>💡</span><span>{recipe.tip}</span></div>}

      <div className="card mt">
        <p className="eyebrow">Kitchen timer</p>
        <div className="timer">
          <Timer size={20} />
          <span className="clock" aria-live="polite">{fmt(timer.left)}</span>
          {timer.left > 0 ? (
            <>
              <button className="icon-btn" onClick={timer.toggle} aria-label={timer.running ? 'Pause' : 'Resume'}>{timer.running ? <Pause size={16} /> : <Play size={16} />}</button>
              <button className="icon-btn" onClick={timer.reset} aria-label="Reset"><RotateCcw size={16} /></button>
            </>
          ) : (
            <div className="row wrap">
              {[1, 3, 5, 10, 15].map((m) => <button key={m} className="chip" onClick={() => timer.start(m * 60)}>{m}m</button>)}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}

function PriceEditor({ ing, onSave, onCancel, onClear }) {
  const countable = ing.unit === 'unit' || ing.unit === 'pack';
  const [paid, setPaid] = useState('');
  const [size, setSize] = useState(countable ? '1' : ing.unit === 'ml' ? '1000' : '300');
  const valid = Number(paid) > 0 && Number(size) > 0;
  const preview = valid ? (Number(paid) / Number(size)) * (Number(ing.amount) || 0) : null;

  return (
    <div className="card mt" style={{ borderColor: 'var(--ink)' }}>
      <p className="eyebrow">What do you pay for {ing.en}?</p>
      <div className="grid-2">
        <label className="field">Price paid (¥)
          <input className="input" inputMode="numeric" value={paid} onChange={(e) => setPaid(e.target.value.replace(/[^\d]/g, ''))} autoFocus />
        </label>
        <label className="field">For how many {countable ? (ing.unit === 'pack' ? 'packs' : 'pieces') : ing.unit}
          <input className="input" inputMode="decimal" value={size} onChange={(e) => setSize(e.target.value.replace(/[^\d.]/g, ''))} />
        </label>
      </div>
      {preview !== null && <p className="small mt">This recipe uses {formatAmount(ing.amount, ing.unit)} → <b>{yen(preview)}</b></p>}
      <div className="row mt">
        <button className="btn sm primary" disabled={!valid} onClick={() => onSave(priceBookEntry(ing, paid, size))}>Save price</button>
        <button className="btn sm ghost" onClick={onCancel}>Cancel</button>
        {ing.userPrice && <button className="btn sm ghost" onClick={onClear}>Use estimate</button>}
      </div>
    </div>
  );
}
