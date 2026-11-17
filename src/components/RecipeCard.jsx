import { Clock, Heart, Sparkles, Users } from 'lucide-react';
import DishPhoto from './DishPhoto.jsx';
import { costPerServing, totalTime, yen } from '../lib/recipe.js';
import { dietBadges, pantryMatches } from '../lib/diet.js';
import { DIET_PROFILES } from '../data/guide.js';
import { useI18n } from '../i18n/index.jsx';

const DIET = Object.fromEntries(DIET_PROFILES.map((d) => [d.id, d]));

export default function RecipeCard({ recipe, onOpen, isFav, mealBudget, pantry = [] }) {
  const { t, tg, loc, lang } = useI18n();
  const view = loc(recipe);
  const perServing = costPerServing(recipe);
  const over = mealBudget && perServing > mealBudget;
  const badges = dietBadges(recipe).slice(0, 3);
  const matches = pantryMatches(view, pantry);
  const subtitle = lang === 'ja' ? (recipe.titleJa !== view.title ? recipe.titleJa : '') : recipe.titleJa;

  return (
    <button className="recipe-card" onClick={() => onOpen(recipe)}>
      <DishPhoto recipe={view} />
      <div className="grow">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <h3>{view.title}</h3>
            {subtitle && <p className="ja">{subtitle}</p>}
          </div>
          {isFav && <Heart size={16} fill="currentColor" style={{ color: 'var(--accent)', flexShrink: 0 }} aria-label={t('saved')} />}
        </div>
        <div className="meta">
          <span className="mono" style={{ color: over ? 'var(--bad)' : 'var(--good)', fontWeight: 700 }}>
            {yen(perServing)}<span className="faint" style={{ fontWeight: 400 }}>{t('perServing')}</span>
          </span>
          <span><Clock size={13} /> {totalTime(recipe)} min</span>
          <span><Users size={13} /> {recipe.servings}</span>
          {recipe.calories ? <span>{recipe.calories} kcal</span> : null}
        </div>
        <div className="tags">
          {recipe.source === 'ai' && <span className="tag accent"><Sparkles size={10} /> {t('newIdea')}</span>}
          {recipe.source === 'community' && <span className="tag accent">{t('community')}</span>}
          {matches > 0 && <span className="tag good">{t('usesPantry', { n: matches })}</span>}
          {badges.map((b) => <span key={b} className="tag">{DIET[b].emoji} {tg(DIET[b].label)}</span>)}
        </div>
      </div>
    </button>
  );
}
