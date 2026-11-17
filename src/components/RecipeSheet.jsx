import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, Heart, Minus, Pause, Play, Plus, RotateCcw, ShoppingBasket, Timer, X } from 'lucide-react';
import Sheet from './Sheet.jsx';
import { applyPriceBook, costPerServing, formatAmount, priceBookEntry, recipeCost, scaleRecipe, yen } from '../lib/recipe.js';
import { CATEGORY_LABELS, conflicts, containsAllergens, dietBadges } from '../lib/diet.js';
import { itemKey } from '../lib/shopping.js';
import { ALLERGENS, DIET_PROFILES, MEAL_TYPES } from '../data/guide.js';
import DishPhoto from './DishPhoto.jsx';
import { useI18n } from '../i18n/index.jsx';

const DIET = Object.fromEntries(DIET_PROFILES.map((d) => [d.id, d]));
const ALLERGEN_LABEL = Object.fromEntries(ALLERGENS.map((a) => [a.cat, a.label]));
const CAT_BY_LABEL = Object.fromEntries(Object.entries(CATEGORY_LABELS).map(([k, v]) => [v, k]));
const MEAL = Object.fromEntries(MEAL_TYPES.map((m) => [m.id, m.label]));

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
  const { t, tg, loc, lang } = useI18n();
  const [servings, setServings] = useState(base.servings || 1);
  const [have, setHave] = useState({});
  const [editing, setEditing] = useState(null);
  const [added, setAdded] = useState(false);
  const timer = useCountdown();

  const recipe = useMemo(
    () => loc(scaleRecipe(applyPriceBook(base, priceBook), servings)),
    [base, priceBook, servings, loc],
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
      <DishPhoto recipe={recipe} className="photo-hero" withCredit creditLabel={t('photoCredit')} />
      <div className="hero">
        <div className="grow">
          <p className="eyebrow" style={{ marginBottom: 2 }}>{tg(recipe.difficulty)} · {tg(MEAL[recipe.mealType] || '')}{recipe.author ? ` · ${t('by')} ${recipe.author}` : ''}</p>
          <h2 id="recipe-title" style={{ fontSize: 22 }}>{recipe.title}</h2>
          {recipe.titleJa && recipe.titleJa !== recipe.title && <p className="ja faint">{recipe.titleJa}</p>}
          {lang !== 'en' && recipe.titleEn && <p className="faint small">{recipe.titleEn}</p>}
        </div>
        <button className="icon-btn" onClick={onClose} aria-label={t('close')} style={{ alignSelf: 'flex-start' }}><X size={18} /></button>
      </div>

      <div className="row mt">
        <button className={`btn sm ${isFav ? 'accent' : ''}`} onClick={() => onToggleFav(base)} aria-pressed={isFav}>
          <Heart size={15} fill={isFav ? 'currentColor' : 'none'} /> {isFav ? t('saved') : t('save')}
        </button>
        <div className="grow" />
        <span className="small faint">{t('servings')}</span>
        <div className="stepper">
          <button onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label={t('fewer')}><Minus size={15} /></button>
          <span aria-live="polite">{servings}</span>
          <button onClick={() => setServings((s) => Math.min(12, s + 1))} aria-label={t('more')}><Plus size={15} /></button>
        </div>
      </div>

      {problems.length > 0 && (
        <div className="notice mt" role="alert">
          <AlertTriangle size={16} />
          <span>{t('notSuitable')} <b>{problems.map((x) => t(`cat_${CAT_BY_LABEL[x]}`) === `cat_${CAT_BY_LABEL[x]}` ? x : t(`cat_${CAT_BY_LABEL[x]}`)).join(', ')}</b>.</span>
        </div>
      )}

      <div className="stats">
        <div className="stat"><b style={{ color: per > mealBudget ? 'var(--bad)' : 'var(--good)' }}>{yen(per)}</b><small>{t('perServing')}</small></div>
        <div className="stat"><b>{yen(total)}</b><small>{t('total')}</small></div>
        <div className="stat"><b>{(recipe.prepTime || 0) + (recipe.cookTime || 0)}′</b><small>{t('minutes')}</small></div>
        <div className="stat"><b>{recipe.calories || '—'}</b><small>kcal</small></div>
      </div>

      {recipe.macros && (
        <p className="small muted mb">
          {t('macros', { p: recipe.macros.protein, c: recipe.macros.carbs, f: recipe.macros.fat })}
          {settings.calorieGoal && recipe.calories ? t('ofDaily', { pct: Math.round((recipe.calories / settings.calorieGoal) * 100), goal: settings.calorieGoal }) : null}
        </p>
      )}

      <div className="tags mb">
        {badges.map((b) => <span key={b} className="tag good">{DIET[b].emoji} {tg(DIET[b].label)}</span>)}
        {allergens.map((a) => <span key={a} className="tag warn">{t('contains')} {tg(ALLERGEN_LABEL[a] || CATEGORY_LABELS[a])}</span>)}
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 4 }}>
          <p className="eyebrow grow" style={{ margin: 0 }}>{t('ingredients')}</p>
          <span className="small faint">{t('tickHave')}</span>
        </div>
        {recipe.ingredients.map((ing, i) => (
          <div className="ing" key={i}>
            <button className={`check ${have[i] ? 'on' : ''}`} onClick={() => setHave((h) => ({ ...h, [i]: !h[i] }))} aria-pressed={!!have[i]} aria-label={`${t('iHave')} ${ing.label || ing.en}`}>
              {have[i] && <Check size={14} />}
            </button>
            <div>
              <p className={`name ${have[i] ? 'done' : ''}`}>{ing.label || ing.en}</p>
              <p className="sub">{lang !== 'ja' && <><span className="ja">{ing.ja}</span>{ing.ja ? ' · ' : ''}</>}{formatAmount(ing.amount, ing.unit, lang)}</p>
            </div>
            <button className="price" onClick={() => setEditing(i)} aria-label={`${t('editPrice')} ${ing.label || ing.en}`}>
              {yen(ing.price)}{ing.userPrice ? ' ✓' : ''}
            </button>
          </div>
        ))}
        <p className="small faint" style={{ marginTop: 8 }}>{t('tapPrice')}</p>
        <button className="btn primary block mt" onClick={addMissing} disabled={!missing.length}>
          {added ? <><Check size={16} /> {t('addedToList')}</> : <><ShoppingBasket size={16} /> {t('addToList', { n: missing.length })}</>}
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
        <p className="eyebrow">{t('steps')}</p>
        <ol className="steps">{recipe.steps.map((s, i) => <li key={i}><span>{s}</span></li>)}</ol>
        {recipe.equipment?.length > 0 && <p className="small faint" style={{ marginTop: 6 }}>{t('youNeed')}: {recipe.equipment.join(', ')}</p>}
      </div>

      {recipe.tip && <div className="notice info mt"><span>💡</span><span>{recipe.tip}</span></div>}

      <div className="card mt">
        <p className="eyebrow">{t('timer')}</p>
        <div className="timer">
          <Timer size={20} />
          <span className="clock" aria-live="polite">{fmt(timer.left)}</span>
          {timer.left > 0 ? (
            <>
              <button className="icon-btn" onClick={timer.toggle} aria-label={timer.running ? t('pause') : t('resume')}>{timer.running ? <Pause size={16} /> : <Play size={16} />}</button>
              <button className="icon-btn" onClick={timer.reset} aria-label={t('reset')}><RotateCcw size={16} /></button>
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
  const { t, lang } = useI18n();
  const countable = ing.unit === 'unit' || ing.unit === 'pack';
  const [paid, setPaid] = useState('');
  const [size, setSize] = useState(countable ? '1' : ing.unit === 'ml' ? '1000' : '300');
  const valid = Number(paid) > 0 && Number(size) > 0;
  const preview = valid ? (Number(paid) / Number(size)) * (Number(ing.amount) || 0) : null;

  return (
    <div className="card mt" style={{ borderColor: 'var(--ink)' }}>
      <p className="eyebrow">{t('whatPay', { name: ing.label || ing.en })}</p>
      <div className="grid-2">
        <label className="field">{t('pricePaid')}
          <input className="input" inputMode="numeric" value={paid} onChange={(e) => setPaid(e.target.value.replace(/[^\d]/g, ''))} autoFocus />
        </label>
        <label className="field">{t('forHowMany', { unit: countable ? (ing.unit === 'pack' ? t('packs') : t('pieces')) : ing.unit })}
          <input className="input" inputMode="decimal" value={size} onChange={(e) => setSize(e.target.value.replace(/[^\d.]/g, ''))} />
        </label>
      </div>
      {preview !== null && <p className="small mt">{t('thisUses', { amount: formatAmount(ing.amount, ing.unit, lang), cost: yen(preview) })}</p>}
      <div className="row mt">
        <button className="btn sm primary" disabled={!valid} onClick={() => onSave(priceBookEntry(ing, paid, size))}>{t('savePrice')}</button>
        <button className="btn sm ghost" onClick={onCancel}>{t('cancel')}</button>
        {ing.userPrice && <button className="btn sm ghost" onClick={onClear}>{t('useEstimate')}</button>}
      </div>
    </div>
  );
}
