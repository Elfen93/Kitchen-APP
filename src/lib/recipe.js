import { itemKey } from './shopping.js';

// Pure helpers for cost, scaling and formatting.

export const yen = (n) => '¥' + Math.round(n || 0).toLocaleString('en-US');

export function recipeCost(recipe) {
  return (recipe.ingredients || []).reduce((s, i) => s + (Number(i.price) || 0), 0);
}

export function costPerServing(recipe) {
  return recipeCost(recipe) / Math.max(1, recipe.servings || 1);
}

export function totalTime(recipe) {
  return (recipe.prepTime || 0) + (recipe.cookTime || 0);
}

/** Scale a recipe's ingredient amounts and prices to a new number of servings. */
export function scaleRecipe(recipe, servings) {
  const base = Math.max(1, recipe.servings || 1);
  const f = servings / base;
  if (f === 1) return recipe;
  return {
    ...recipe,
    servings,
    ingredients: recipe.ingredients.map((i) => ({
      ...i,
      amount: roundAmount((Number(i.amount) || 0) * f, i.unit),
      price: Math.round((Number(i.price) || 0) * f),
    })),
  };
}

function roundAmount(x, unit) {
  if (unit === 'unit' || unit === 'pack') return Math.round(x * 2) / 2 || 0.5;
  if (x >= 100) return Math.round(x / 5) * 5;
  return Math.round(x * 10) / 10;
}

export function formatAmount(amount, unit) {
  const n = Number(amount) || 0;
  const pretty = Number.isInteger(n) ? n : n.toFixed(1).replace(/\.0$/, '');
  if (unit === 'unit') return `×${pretty}`;
  if (unit === 'pack') return `${pretty} pack${n === 1 ? '' : 's'}`;
  return `${pretty} ${unit || 'g'}`;
}

/** Stable id for any recipe (library ids are numbers, AI/community ids are strings). */
export function recipeKey(recipe) {
  return String(recipe.key || recipe.id);
}

/**
 * Price book: what the user actually pays, per base unit, keyed by ingredient.
 * Entry shape: { unit: 'g'|'ml'|'unit'|'pack', perUnit: yen, label }
 * Applied to every recipe that uses that ingredient in the same unit.
 */
export function applyPriceBook(recipe, book = {}) {
  let changed = false;
  const ingredients = (recipe.ingredients || []).map((i) => {
    const e = book[itemKey(i)];
    if (!e || e.unit !== i.unit) return i;
    changed = true;
    return { ...i, price: Math.round(e.perUnit * (Number(i.amount) || 0)), userPrice: true };
  });
  return changed ? { ...recipe, ingredients } : recipe;
}

export function priceBookEntry(ing, paid, packSize) {
  const size = Number(packSize) || 1;
  return { unit: ing.unit, perUnit: Number(paid) / size, label: ing.en };
}
