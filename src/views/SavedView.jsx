import RecipeCard from '../components/RecipeCard.jsx';
import { recipeKey } from '../lib/recipe.js';
import { useI18n } from '../i18n/index.jsx';

export default function SavedView({ favorites, recent, onOpen, settings }) {
  const { t } = useI18n();
  const mealBudget = settings.weeklyBudget / 21;
  const favKeys = new Set(favorites.map(recipeKey));
  const recentOnly = recent.filter((r) => !favKeys.has(recipeKey(r))).slice(0, 10);
  return (
    <>
      <div className="section-head">
        <h2>{t('tabSaved')}</h2>
        <p>{t('savedIntro')}</p>
      </div>
      {favorites.length === 0 ? (
        <div className="empty card"><div className="big">♡</div><h3>{t('noFavs')}</h3><p className="small">{t('noFavsBody')}</p></div>
      ) : (
        <div className="stack">
          {favorites.map((r) => <RecipeCard key={recipeKey(r)} recipe={r} onOpen={onOpen} isFav mealBudget={mealBudget} />)}
        </div>
      )}
      {recentOnly.length > 0 && (
        <>
          <p className="eyebrow mt">{t('recent')}</p>
          <div className="stack">
            {recentOnly.map((r) => <RecipeCard key={recipeKey(r)} recipe={r} onOpen={onOpen} mealBudget={mealBudget} />)}
          </div>
        </>
      )}
    </>
  );
}
