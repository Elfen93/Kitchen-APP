import RecipeCard from '../components/RecipeCard.jsx';
import { recipeKey } from '../lib/recipe.js';

export default function SavedView({ favorites, recent, onOpen, settings }) {
  const mealBudget = settings.weeklyBudget / 21;
  const favKeys = new Set(favorites.map(recipeKey));
  const recentOnly = recent.filter((r) => !favKeys.has(recipeKey(r))).slice(0, 10);
  return (
    <>
      <div className="section-head">
        <h2>Saved</h2>
        <p>Your favourites stay on this device, including generated recipes.</p>
      </div>
      {favorites.length === 0 ? (
        <div className="empty card"><div className="big">♡</div><h3>No favourites yet</h3><p className="small">Tap “Save” on a recipe you liked.</p></div>
      ) : (
        <div className="stack">
          {favorites.map((r) => <RecipeCard key={recipeKey(r)} recipe={r} onOpen={onOpen} isFav mealBudget={mealBudget} />)}
        </div>
      )}
      {recentOnly.length > 0 && (
        <>
          <p className="eyebrow mt">Recently viewed</p>
          <div className="stack">
            {recentOnly.map((r) => <RecipeCard key={recipeKey(r)} recipe={r} onOpen={onOpen} mealBudget={mealBudget} />)}
          </div>
        </>
      )}
    </>
  );
}
