import { describe, expect, it } from 'vitest';
import { RECIPES } from '../src/data/recipes.js';
import { conflicts, containsAllergens, ingredientCategories, dietBadges, isAllowed, pantryMatches } from '../src/lib/diet.js';
import { addRecipeToList, listTotals } from '../src/lib/shopping.js';
import { addSpend, spentThisWeek, weekKey } from '../src/lib/budget.js';
import { applyPriceBook, priceBookEntry, recipeCost, scaleRecipe } from '../src/lib/recipe.js';
import { itemKey } from '../src/lib/shopping.js';

const byTitle = (t) => RECIPES.find((r) => r.title === t);

describe('diet & allergens', () => {
  it('treats bonito dashi as fish (miso soup is not vegan)', () => {
    const miso = byTitle('Miso Soup & Rice');
    expect(isAllowed(miso, 'vegan', [])).toBe(false);
    expect(isAllowed(miso, 'vegetarian', [])).toBe(false);
  });
  it('kombu nabe stays vegan', () => {
    expect(isAllowed(byTitle('Vegan Nabe'), 'vegan', [])).toBe(true);
  });
  it('soy sauce means gluten', () => {
    expect(isAllowed(byTitle('Chicken Teriyaki'), 'gluten', [])).toBe(false);
  });
  it('"Eggs" allergy catches "Egg (1)" and mayonnaise', () => {
    expect(conflicts(byTitle('Tamago Gohan'), 'none', ['egg'])).toContain('Egg');
    expect(isAllowed(byTitle('Onigiri — Tuna Mayo'), 'none', ['egg'])).toBe(false);
  });
  it('soy milk is not dairy', () => {
    expect(ingredientCategories({ en: 'Water or soy milk', ja: '水／豆乳' }).has('dairy')).toBe(false);
    expect(ingredientCategories({ en: 'Milk', ja: '牛乳' }).has('dairy')).toBe(true);
  });
  it('halal excludes mirin', () => {
    expect(isAllowed(byTitle('Gyudon Beef Bowl'), 'halal', [])).toBe(false);
  });
  it('custom allergy matches ingredient text', () => {
    expect(isAllowed(byTitle('Yogurt Granola Bowl'), 'none', ['granola'])).toBe(false);
  });
  it('vegan badge replaces vegetarian', () => {
    const b = dietBadges(byTitle('Edamame with Sea Salt'));
    expect(b).toContain('vegan');
    expect(b).not.toContain('vegetarian');
  });
  it('every library recipe has a meal type and ingredients', () => {
    for (const r of RECIPES) {
      expect(['breakfast', 'lunch', 'dinner', 'snack']).toContain(r.mealType);
      expect(r.ingredients.length).toBeGreaterThan(0);
    }
  });
  it('pantry matching tolerates plurals and prefixes', () => {
    expect(pantryMatches(byTitle('Tamago Gohan'), ['Eggs', 'Rice'])).toBe(2);
  });
});

describe('shopping list', () => {
  it('merges the same ingredient across recipes', () => {
    let list = addRecipeToList([], byTitle('Tamago Gohan'));
    list = addRecipeToList(list, byTitle('Natto Rice'));
    const rice = list.filter((i) => i.ja === 'ご飯');
    expect(rice).toHaveLength(1);
    expect(rice[0].amount).toBe(400);
    expect(rice[0].from).toEqual(['Tamago Gohan', 'Natto Rice']);
    expect(listTotals(list).total).toBe(recipeCost(byTitle('Tamago Gohan')) + recipeCost(byTitle('Natto Rice')));
  });
});

describe('recipes', () => {
  it('scales amounts and prices', () => {
    const r = scaleRecipe(byTitle('Curry Rice'), 8);
    expect(recipeCost(r)).toBeCloseTo(recipeCost(byTitle('Curry Rice')) * 2, -1);
  });
  it('applies user prices per unit', () => {
    const r = byTitle('Tamago Gohan');
    const egg = r.ingredients.find((i) => i.ja === '卵');
    const book = { [itemKey(egg)]: priceBookEntry(egg, 300, 10) };
    const priced = applyPriceBook(r, book);
    expect(priced.ingredients.find((i) => i.ja === '卵').price).toBe(30);
  });
});

describe('budget', () => {
  it('sums spending for the current week only', () => {
    const now = new Date('2026-11-18T12:00:00');
    let log = addSpend([], 1200, 'OK', now);
    log = addSpend(log, 800, 'Life', now);
    log = addSpend(log, 500, 'old', new Date('2026-11-01T12:00:00'));
    expect(spentThisWeek(log, now)).toBe(2000);
    expect(weekKey(now)).toBe('2026-11-16');
  });
});

describe('steps are scanned too', () => {
  it('soy sauce mentioned only in steps still counts as gluten', () => {
    expect(isAllowed(byTitle('Pork & Cabbage Stir-fry'), 'gluten', [])).toBe(false);
  });
});

describe('i18n', async () => {
  const { localizeRecipe, makeT } = await import('../src/i18n/index.jsx');
  const { UI } = await import('../src/i18n/ui.js');
  it('every UI key exists in es and ja', () => {
    for (const k of Object.keys(UI.en)) {
      expect(UI.es[k], `es:${k}`).toBeDefined();
      expect(UI.ja[k], `ja:${k}`).toBeDefined();
    }
  });
  it('localizes library recipes without touching the source fields', () => {
    const r = byTitle('Oyakodon');
    const es = localizeRecipe(r, 'es');
    expect(es.title).not.toBe(r.title);
    expect(es.ingredients[0].en).toBe(r.ingredients[0].en);
    expect(es.ingredients[0].label).toBeTruthy();
    expect(es.steps).toHaveLength(r.steps.length);
  });
  it('interpolates', () => {
    expect(makeT('es')('addToList', { n: 2 })).toBe('Añadir 2 productos a la lista');
  });
  it('pantry matches localized names', () => {
    const r = localizeRecipe(byTitle('Tamago Gohan'), 'es');
    expect(pantryMatches(r, ['huevo'])).toBe(1);
  });
});
