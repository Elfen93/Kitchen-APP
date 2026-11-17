import { useMemo, useState } from 'react';
import { AlertCircle, RefreshCw, Search, Sparkles } from 'lucide-react';
import RecipeCard from '../components/RecipeCard.jsx';
import { RECIPES } from '../data/recipes.js';
import { DIET_PROFILES, DIFFICULTIES, MEAL_TYPES } from '../data/guide.js';
import { isAllowed, pantryMatches } from '../lib/diet.js';
import { costPerServing, recipeKey, totalTime } from '../lib/recipe.js';
import { useI18n } from '../i18n/index.jsx';

export default function DiscoverView({ settings, pantry, favKeys, onOpen, ai, onGenerate, usePantryFirst, setUsePantryFirst }) {
  const { t, tg, loc } = useI18n();
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
        const v = loc(r);
        const hay = `${r.title} ${v.title} ${r.titleJa} ${v.ingredients.map((i) => `${i.en} ${i.ja} ${i.label || ''}`).join(' ')}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    if (usePantryFirst && pantry.length) {
      pool.sort((a, b) => pantryMatches(b, pantry) - pantryMatches(a, pantry));
    }
    return { shown: pool, hidden: hiddenCount };
  }, [loc, fresh, meal, settings.diet, settings.allergies, difficulty, cheapOnly, quick, q, mealBudget, usePantryFirst, pantry]);

  const loading = ai.loading === meal;

  return (
    <>
      <div className="seg mb" role="group" aria-label={t('mealGroup')}>
        {MEAL_TYPES.map((m) => (
          <button key={m.id} className="chip" aria-pressed={meal === m.id} onClick={() => setMeal(m.id)}>
            {tg(m.label)}{tg(m.label) !== m.ja && <small className="ja">{m.ja}</small>}
          </button>
        ))}
      </div>

      <div className="card dark mb">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <Sparkles size={20} style={{ marginTop: 2, flexShrink: 0 }} />
          <div className="grow">
            <p style={{ fontWeight: 700 }}>{t('needIdeas')}</p>
            <p className="small faint">
              {t('ideasBody', {
                meal: t(`meal_${meal}`),
                diet: diet && diet.id !== 'none' ? tg(diet.label).toLowerCase() : '',
                allergies: settings.allergies.length > 0,
                pantry: pantry.length,
              })}
            </p>
          </div>
        </div>
        <button className="btn accent block mt" disabled={loading} onClick={() => onGenerate({ meal, difficulty })}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? t('generating') : t('generate')}
        </button>
      </div>

      {ai.error && ai.errorMeal === meal && (
        <div className="notice mb" role="status"><AlertCircle size={16} /><span>{t(ai.error)} {t('offlineStill')}</span></div>
      )}
      {ai.dropped > 0 && ai.droppedMeal === meal && (
        <div className="notice info mb"><AlertCircle size={16} /><span>{t('dropped', { n: ai.dropped })}</span></div>
      )}

      <div className="row mb">
        <div className="grow" style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--ink-3)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder={t('searchPh')} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t('searchPh')} />
        </div>
      </div>

      <div className="seg mb" role="group" aria-label={t('filters')}>
        <button className="chip good" aria-pressed={cheapOnly} onClick={() => setCheapOnly((v) => !v)}>{t('withinBudget')}</button>
        <button className="chip" aria-pressed={quick} onClick={() => setQuick((v) => !v)}>{t('quick')}</button>
        {pantry.length > 0 && <button className="chip" aria-pressed={usePantryFirst} onClick={() => setUsePantryFirst((v) => !v)}>{t('pantryFirst')}</button>}
        {DIFFICULTIES.slice(1).map((d) => (
          <button key={d} className="chip" aria-pressed={difficulty === d} onClick={() => setDifficulty((cur) => (cur === d ? 'Any' : d))}>{tg(d)}</button>
        ))}
      </div>

      <p className="small faint mb">
        {t('countLine', { n: shown.length, perMeal: Math.round(mealBudget), hidden })}
      </p>

      <div className="stack">
        {loading && [0, 1].map((i) => <div key={i} className="skeleton" />)}
        {shown.map((r) => (
          <RecipeCard key={recipeKey(r)} recipe={r} onOpen={onOpen} isFav={favKeys.has(recipeKey(r))} mealBudget={mealBudget} pantry={pantry} />
        ))}
        {!shown.length && !loading && (
          <div className="empty card">
            <div className="big">🍳</div>
            <h3>{t('nothingMatches')}</h3>
            <p className="small">{t('nothingMatchesBody')}</p>
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
