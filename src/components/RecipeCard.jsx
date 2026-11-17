import { Clock, Heart, Sparkles, Users } from 'lucide-react';
import { costPerServing, totalTime, yen } from '../lib/recipe.js';
import { dietBadges, pantryMatches } from '../lib/diet.js';
import { DIET_PROFILES } from '../data/guide.js';

const DIET_LABEL = Object.fromEntries(DIET_PROFILES.map((d) => [d.id, `${d.emoji} ${d.label}`]));

export default function RecipeCard({ recipe, onOpen, isFav, mealBudget, pantry = [] }) {
  const perServing = costPerServing(recipe);
  const over = mealBudget && perServing > mealBudget;
  const badges = dietBadges(recipe).slice(0, 3);
  const matches = pantryMatches(recipe, pantry);

  return (
    <button className="recipe-card" onClick={() => onOpen(recipe)}>
      <div className="art" aria-hidden="true">{recipe.emoji || '🍽️'}</div>
      <div className="grow">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <h3>{recipe.title}</h3>
            {recipe.titleJa && <p className="ja">{recipe.titleJa}</p>}
          </div>
          {isFav && <Heart size={16} fill="currentColor" style={{ color: 'var(--accent)', flexShrink: 0 }} aria-label="Saved" />}
        </div>
        <div className="meta">
          <span className={`mono ${over ? '' : ''}`} style={{ color: over ? 'var(--bad)' : 'var(--good)', fontWeight: 700 }}>
            {yen(perServing)}<span className="faint" style={{ fontWeight: 400 }}>/serving</span>
          </span>
          <span><Clock size={13} /> {totalTime(recipe)} min</span>
          <span><Users size={13} /> {recipe.servings}</span>
          {recipe.calories ? <span>{recipe.calories} kcal</span> : null}
        </div>
        <div className="tags">
          {recipe.source === 'ai' && <span className="tag accent"><Sparkles size={10} /> New idea</span>}
          {recipe.source === 'community' && <span className="tag accent">Community</span>}
          {matches > 0 && <span className="tag good">Uses {matches} from pantry</span>}
          {badges.map((b) => <span key={b} className="tag">{DIET_LABEL[b]}</span>)}
        </div>
      </div>
    </button>
  );
}
