import { useMemo, useState } from 'react';
import { AlertCircle, RefreshCw, Search, Sparkles } from 'lucide-react';
import RecipeCard from '../components/RecipeCard.jsx';
import { RECIPES } from '../data/recipes.js';
import { DIET_PROFILES, DIFFICULTIES, MEAL_TYPES } from '../data/guide.js';
import { isAllowed, pantryMatches } from '../lib/diet.js';
import { costPerServing, recipeKey, totalTime } from '../lib/recipe.js';

export default function DiscoverView({ settings, pantry, favKeys, onOpen, ai, onGenerate, usePantryFirst, setUsePantryFirst }) {
  const [meal, setMeal] = useState(defaultMeal());
  const [difficulty, setDifficulty] = useState('Any');
  const [cheapOnly, setCheapOnly] = useState(false);
  const [quick, setQuick] = useState(false);
  const [q, setQ] = useState('');

  const mealBudget = settings.weeklyBudget / 21;
  const diet = DIET_PROFILES.find((d) => d.id === settings.diet);
  const fresh = ai.byMeal[meal] || [];

  const { shown, hidden } = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let hiddenCount = 0;
    const pool = [...fresh, ...RECIPES.filter((r) => r.mealType === meal)].filter((r) => {
      if (!isAllowed(r, settings.diet, settings.allergies)) { hiddenCount += 1; return false; }
      if (difficulty !== 'Any' && r.difficulty !== difficulty) return false;
      if (cheapOnly && costPerServing(r) > mealBudget) return false;
      if (quick && totalTime(r) > 15) return false;
      if (needle) {
        const hay = `${r.title} ${r.titleJa} ${r.ingredients.map((i) => `${i.en} ${i.ja}`).join(' ')}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    if (usePantryFirst && pantry.length) {
      pool.sort((a, b) => pantryMatches(b, pantry) - pantryMatches(a, pantry));
    }
    return { shown: pool, hidden: hiddenCount };
  }, [fresh, meal, settings.diet, settings.allergies, difficulty, cheapOnly, quick, q, mealBudget, usePantryFirst, pantry]);

  const loading = ai.loading === meal;

  return (
    <>
      <div className="seg mb" role="group" aria-label="Meal">
        {MEAL_TYPES.map((m) => (
          <button key={m.id} className="chip" aria-pressed={meal === m.id} onClick={() => setMeal(m.id)}>
            {m.label} <small className="ja">{m.ja}</small>
          </button>
        ))}
      </div>

      <div className="card dark mb">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <Sparkles size={20} style={{ marginTop: 2, flexShrink: 0 }} />
          <div className="grow">
            <p style={{ fontWeight: 700 }}>Need new ideas?</p>
            <p className="small faint">
              Get {MEAL_TYPES.find((m) => m.id === meal).label.toLowerCase()} recipes made for your budget
              {diet && diet.id !== 'none' ? `, ${diet.label.toLowerCase()} diet` : ''}
              {settings.allergies.length ? ' and allergies' : ''}
              {pantry.length ? `, using your ${pantry.length} pantry items` : ''}.
            </p>
          </div>
        </div>
        <button className="btn accent block mt" disabled={loading} onClick={() => onGenerate({ meal, difficulty })}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Cooking up ideas…' : 'Generate 4 recipes'}
        </button>
      </div>

      {ai.error && ai.errorMeal === meal && (
        <div className="notice mb" role="status"><AlertCircle size={16} /><span>{ai.error} The recipe library below still works offline.</span></div>
      )}
      {ai.dropped > 0 && ai.droppedMeal === meal && (
        <div className="notice info mb"><AlertCircle size={16} /><span>{ai.dropped} generated recipe{ai.dropped === 1 ? '' : 's'} removed because {ai.dropped === 1 ? 'it' : 'they'} conflicted with your diet or allergies.</span></div>
      )}

      <div className="row mb">
        <div className="grow" style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--ink-3)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search dish or ingredient (EN / 日本語)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search recipes" />
        </div>
      </div>

      <div className="seg mb" role="group" aria-label="Filters">
        <button className="chip good" aria-pressed={cheapOnly} onClick={() => setCheapOnly((v) => !v)}>Within budget</button>
        <button className="chip" aria-pressed={quick} onClick={() => setQuick((v) => !v)}>≤ 15 min</button>
        {pantry.length > 0 && <button className="chip" aria-pressed={usePantryFirst} onClick={() => setUsePantryFirst((v) => !v)}>Pantry first</button>}
        {DIFFICULTIES.slice(1).map((d) => (
          <button key={d} className="chip" aria-pressed={difficulty === d} onClick={() => setDifficulty((cur) => (cur === d ? 'Any' : d))}>{d}</button>
        ))}
      </div>

      <p className="small faint mb">
        {shown.length} recipe{shown.length === 1 ? '' : 's'} · about ¥{Math.round(mealBudget)} per meal on your budget
        {hidden > 0 ? ` · ${hidden} hidden by your diet/allergies` : ''}
      </p>

      <div className="stack">
        {loading && [0, 1].map((i) => <div key={i} className="skeleton" />)}
        {shown.map((r) => (
          <RecipeCard key={recipeKey(r)} recipe={r} onOpen={onOpen} isFav={favKeys.has(recipeKey(r))} mealBudget={mealBudget} pantry={pantry} />
        ))}
        {!shown.length && !loading && (
          <div className="empty card">
            <div className="big">🍳</div>
            <h3>Nothing matches</h3>
            <p className="small">Loosen a filter, or generate recipes that fit your profile.</p>
          </div>
        )}
      </div>
    </>
  );
}

function defaultMeal() {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 15) return 'lunch';
  return 'dinner';
}
