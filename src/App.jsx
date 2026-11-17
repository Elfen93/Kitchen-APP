import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookHeart, CookingPot, Menu, Refrigerator, ShoppingBasket } from 'lucide-react';
import DiscoverView from './views/DiscoverView.jsx';
import PantryView from './views/PantryView.jsx';
import ListView from './views/ListView.jsx';
import SavedView from './views/SavedView.jsx';
import MoreView from './views/MoreView.jsx';
import RecipeSheet from './components/RecipeSheet.jsx';
import { usePersist } from './lib/persist.js';
import { generateRecipes } from './lib/api.js';
import { addRecipeToList } from './lib/shopping.js';
import { addSpend, spentThisWeek } from './lib/budget.js';
import { recipeKey, yen } from './lib/recipe.js';
import { I18nProvider, LANGUAGES, detectLanguage, makeT } from './i18n/index.jsx';

const DEFAULT_SETTINGS = { weeklyBudget: 8000, calorieGoal: 2000, diet: 'none', allergies: [] };

export default function App() {
  const [tab, setTab] = useState('cook');
  const [morePage, setMorePage] = useState(null);
  const [open, setOpen] = useState(null);

  const [lang, setLang] = usePersist('lang', detectLanguage());
  const t = makeT(lang);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const [settings, setSettings] = usePersist('settings', DEFAULT_SETTINGS);
  const [pantry, setPantry] = usePersist('pantry', []);
  const [list, setList] = usePersist('list', []);
  const [favorites, setFavorites] = usePersist('favorites', []);
  const [recent, setRecent] = usePersist('recent', []);
  const [priceBook, setPriceBook] = usePersist('prices', {});
  const [spendLog, setSpendLog] = usePersist('spend', []);
  const [liked, setLiked] = usePersist('liked', []);
  const [aiByMeal, setAiByMeal] = usePersist('ai', {});
  const [usePantryFirst, setUsePantryFirst] = useState(true);
  const [ai, setAi] = useState({ loading: null, error: null, errorMeal: null, dropped: 0, droppedMeal: null });

  const s = { ...DEFAULT_SETTINGS, ...settings };
  const favKeys = useMemo(() => new Set(favorites.map(recipeKey)), [favorites]);
  const spent = spentThisWeek(spendLog);

  const openRecipe = useCallback((r) => {
    setOpen(r);
    setRecent((l) => [r, ...l.filter((x) => recipeKey(x) !== recipeKey(r))].slice(0, 20));
  }, [setRecent]);

  const toggleFav = (r) => setFavorites((f) => (f.some((x) => recipeKey(x) === recipeKey(r)) ? f.filter((x) => recipeKey(x) !== recipeKey(r)) : [r, ...f]));
  const setPrice = (key, entry) => setPriceBook((b) => {
    const next = { ...b };
    if (entry) next[key] = entry; else delete next[key];
    return next;
  });

  const generate = async ({ meal, difficulty }) => {
    setAi((a) => ({ ...a, loading: meal, error: null }));
    try {
      const previous = (aiByMeal[meal] || []).map((r) => r.title);
      const { recipes, dropped } = await generateRecipes({
        mealType: meal,
        lang,
        difficulty,
        diet: s.diet,
        allergies: s.allergies,
        pantry,
        avoid: previous,
        count: 4,
        maxCostPerServing: Math.round(s.weeklyBudget / 21),
        calorieTarget: Math.round(s.calorieGoal / (meal === 'snack' ? 8 : 3)),
      });
      setAiByMeal((m) => ({ ...m, [meal]: [...recipes, ...(m[meal] || [])].slice(0, 12) }));
      setAi({ loading: null, error: null, errorMeal: null, dropped, droppedMeal: meal });
    } catch (e) {
      const msg = e.status === 429 ? 'errRate' : e.status === 503 ? 'errOff' : 'errGeneric';
      setAi({ loading: null, error: msg, errorMeal: meal, dropped: 0, droppedMeal: null });
    }
  };

  const go = (t) => { setTab(t); if (t !== 'more') setMorePage(null); window.scrollTo(0, 0); };

  const TABS = [
    { id: 'cook', label: t('tabCook'), icon: CookingPot },
    { id: 'pantry', label: t('tabPantry'), icon: Refrigerator, badge: pantry.length },
    { id: 'list', label: t('tabList'), icon: ShoppingBasket, badge: list.filter((i) => !i.checked).length },
    { id: 'saved', label: t('tabSaved'), icon: BookHeart },
    { id: 'more', label: t('tabMore'), icon: Menu },
  ];

  return (
    <I18nProvider lang={lang} setLang={setLang}>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <h1><span className="ja">買い物</span> Cook</h1>
            <p>{t('tagline')}</p>
            <div className="lang-switch" role="group" aria-label={t('language')} style={{ marginTop: 6 }}>
              {LANGUAGES.map((l) => (
                <button key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)} lang={l.id}>{l.id === 'ja' ? '日本' : l.id.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <button className="budget-pill" onClick={() => { setTab('more'); setMorePage('profile'); }} aria-label={t('thisWeekBudget')}>
            <small>{t('leftThisWeek')}</small>
            <b style={{ color: spent > s.weeklyBudget ? 'var(--bad)' : 'var(--ink)' }}>{yen(s.weeklyBudget - spent)}</b>
            <div className={`meter ${spent > s.weeklyBudget ? 'over' : ''}`}><i style={{ width: `${Math.min(100, (spent / s.weeklyBudget) * 100)}%` }} /></div>
          </button>
        </header>

        <main>
          {tab === 'cook' && (
            <DiscoverView settings={s} pantry={pantry} favKeys={favKeys} onOpen={openRecipe}
              ai={{ ...ai, byMeal: aiByMeal }} onGenerate={generate}
              usePantryFirst={usePantryFirst} setUsePantryFirst={setUsePantryFirst} />
          )}
          {tab === 'pantry' && <PantryView pantry={pantry} setPantry={setPantry} onCookWithPantry={() => { setUsePantryFirst(true); go('cook'); }} />}
          {tab === 'list' && <ListView list={list} setList={setList} onFinish={(paid) => setSpendLog((l) => addSpend(l, paid, 'Shopping list'))} />}
          {tab === 'saved' && <SavedView favorites={favorites} recent={recent} onOpen={openRecipe} settings={s} />}
          {tab === 'more' && (
            <MoreView page={morePage} setPage={setMorePage}
              settings={s} setSettings={setSettings} spendLog={spendLog} setSpendLog={setSpendLog}
              onOpen={openRecipe} liked={liked} setLiked={setLiked} />
          )}
        </main>
      </div>

      <nav className="tabbar" aria-label="買い物 Cook">
        <div className="tabbar-inner">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} className="tab" aria-current={tab === id ? 'page' : undefined} onClick={() => go(id)}>
              <Icon size={22} />
              {label}
              {badge > 0 && <span className="badge">{badge > 99 ? '99+' : badge}</span>}
            </button>
          ))}
        </div>
      </nav>

      {open && (
        <RecipeSheet
          key={recipeKey(open)}
          recipe={open}
          settings={s}
          priceBook={priceBook}
          onSetPrice={setPrice}
          isFav={favKeys.has(recipeKey(open))}
          onToggleFav={toggleFav}
          onAddToList={(r) => setList((l) => addRecipeToList(l, r))}
          onClose={() => setOpen(null)}
        />
      )}
    </I18nProvider>
  );
}
