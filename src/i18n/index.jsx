import { createContext, useContext, useMemo } from 'react';
import { UI } from './ui.js';
import * as ES from './data.es.js';
import * as JA from './data.ja.js';

export const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'ja', label: '日本語' },
];

const DATA = { es: ES, ja: JA };

export function detectLanguage() {
  const nav = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
  for (const l of nav) {
    const code = String(l).slice(0, 2).toLowerCase();
    if (code === 'es' || code === 'ja' || code === 'en') return code;
  }
  return 'en';
}

/** t('key', { n: 3 }) → interpolated UI string, falling back to English. */
export function makeT(lang) {
  const dict = UI[lang] || UI.en;
  return (key, vars) => {
    let s = dict[key] ?? UI.en[key] ?? key;
    if (typeof s === 'function') s = s(vars || {});
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
    return s;
  };
}

/** Translate a static guide/data string (keyed by its English text). */
export function makeTg(lang) {
  const text = DATA[lang]?.TEXT || {};
  return (s) => text[s] ?? s;
}

/**
 * Display copy of a recipe in the chosen language. The original English and
 * Japanese fields stay untouched (diet/allergen checks run on them); the
 * localized strings go into `view`.
 */
export function localizeRecipe(recipe, lang) {
  if (lang === 'en') return recipe;
  const tr = recipe.i18n?.[lang] || (recipe.source === 'library' ? DATA[lang]?.RECIPES?.[recipe.id] : null);
  if (!tr) return recipe;
  return {
    ...recipe,
    title: tr.title || recipe.title,
    steps: tr.steps?.length === recipe.steps.length ? tr.steps : recipe.steps,
    equipment: tr.equipment?.length === (recipe.equipment || []).length ? tr.equipment : recipe.equipment,
    tip: tr.tip ?? recipe.tip,
    ingredients: recipe.ingredients.map((ing, i) => ({ ...ing, label: tr.ingredients?.[i] || ing.en })),
    titleEn: recipe.title,
  };
}

const Ctx = createContext({ lang: 'en', t: makeT('en'), tg: makeTg('en'), loc: (r) => r, setLang: () => {} });

export function I18nProvider({ lang, setLang, children }) {
  const value = useMemo(() => ({
    lang,
    setLang,
    t: makeT(lang),
    tg: makeTg(lang),
    loc: (r) => localizeRecipe(r, lang),
  }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
