// Shopping list: merges the same ingredient from several recipes into one line.

const norm = (s) => (s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();

export function itemKey(ing) {
  return ing.ja ? `ja:${ing.ja}` : `en:${norm(ing.en)}`;
}

/**
 * Adds a recipe's ingredients to the list.
 * Same item + same unit → amounts and prices are summed.
 */
export function addRecipeToList(list, recipe) {
  const next = list.map((i) => ({ ...i, from: [...(i.from || [])] }));
  for (const ing of recipe.ingredients || []) {
    const key = itemKey(ing);
    const existing = next.find((i) => i.key === key && i.unit === ing.unit);
    if (existing) {
      existing.amount = round(existing.amount + (Number(ing.amount) || 0));
      existing.price += Number(ing.price) || 0;
      if (!existing.from.includes(recipe.title)) existing.from.push(recipe.title);
      existing.checked = false;
    } else {
      next.push({
        key,
        en: ing.en.replace(/\s*\(.*?\)\s*/g, ' ').trim() || ing.en,
        ja: ing.ja || '',
        unit: ing.unit || 'g',
        amount: Number(ing.amount) || 0,
        price: Number(ing.price) || 0,
        from: [recipe.title],
        checked: false,
      });
    }
  }
  return next;
}

export function addManualItem(list, name) {
  const en = name.trim();
  if (!en) return list;
  return [...list, { key: `manual:${Date.now()}:${en}`, en, ja: '', unit: 'unit', amount: 1, price: 0, from: [], checked: false, manual: true }];
}

export function listTotals(list) {
  const total = list.reduce((s, i) => s + (i.price || 0), 0);
  const inBasket = list.filter((i) => i.checked).reduce((s, i) => s + (i.price || 0), 0);
  return { total, inBasket, remaining: total - inBasket };
}

const round = (x) => Math.round(x * 10) / 10;
