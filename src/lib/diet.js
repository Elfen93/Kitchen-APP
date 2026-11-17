// Diet & allergen logic derived from ingredient names (EN + JA).
//
// The old app trusted hand-written tags, which were wrong in several places
// (miso soup tagged vegan despite bonito dashi, teriyaki tagged gluten-free
// despite soy sauce). Here every recipe — library, AI or community — is
// classified the same way from what it actually contains.

const CATEGORY_PATTERNS = {
  pork: [/pork|\bham\b|bacon|lard|spam|gyoza|豚|ハム|ベーコン|餃子/i],
  beef: [/beef|veal|牛(?!乳)/i],
  chicken: [/chicken|鶏|とり肉/i],
  fish: [/fish|tuna|salmon|mackerel|saba|mentaiko|bonito|katsuobushi|(?<!kombu )dashi(?! \(kombu)|mentsuyu|kimchi|魚|鮭|サバ|ツナ|明太|かつお|だし(?!.*昆布)|めんつゆ|キムチ/i],
  shellfish: [/shrimp|prawn|crab|oyster|clam|scallop|えび|海老|かに|蟹|オイスター|あさり|ホタテ/i],
  egg: [/\beggs?\b|mayo|卵|たまご|マヨ/i],
  dairy: [/(?<!soy )milk|butter|cheese|cream|yogurt|牛乳|バター|チーズ|クリーム|ヨーグルト/i],
  gluten: [/wheat|barley|麦味噌|soy sauce|oyster sauce|shoyu|mentsuyu|curry roux|udon|ramen|pasta|bread|cracker|flour|gyoza|granola|oat|soba|醤油|めんつゆ|カレールー|うどん|ラーメン|パスタ|パン|クラッカー|小麦|餃子|グラノーラ|オートミール|そば/i],
  buckwheat: [/soba|そば/i],
  soy: [/soy|tofu|natto|miso|edamame|kinako|doubanjiang|醤油|豆腐|納豆|味噌|枝豆|きな粉|豆板醤|豆乳/i],
  sesame: [/sesame|tahini|ごま|胡麻/i],
  peanut: [/peanut|ピーナッツ|落花生/i],
  treenut: [/almond|walnut|cashew|chestnut|アーモンド|くるみ|栗/i],
  alcohol: [/\bsake\b|mirin|wine|beer|酒|みりん|ワイン/i],
  honey: [/honey|はちみつ|蜂蜜/i],
};

export const CATEGORY_LABELS = {
  pork: 'Pork', beef: 'Beef', chicken: 'Chicken', fish: 'Fish', shellfish: 'Shellfish',
  egg: 'Egg', dairy: 'Dairy', gluten: 'Wheat/gluten', buckwheat: 'Buckwheat', soy: 'Soy',
  sesame: 'Sesame', peanut: 'Peanut', treenut: 'Tree nuts', alcohol: 'Alcohol', honey: 'Honey',
};

// Categories that matter as allergens (shown as "Contains" chips).
export const ALLERGEN_CATS = ['gluten', 'dairy', 'egg', 'fish', 'shellfish', 'soy', 'sesame', 'peanut', 'treenut', 'buckwheat'];

const DIET_FORBIDS = {
  vegetarian: ['pork', 'beef', 'chicken', 'fish', 'shellfish'],
  vegan: ['pork', 'beef', 'chicken', 'fish', 'shellfish', 'egg', 'dairy', 'honey'],
  pescatarian: ['pork', 'beef', 'chicken'],
  lactose: ['dairy'],
  gluten: ['gluten'],
  halal: ['pork', 'alcohol'],
  nopork: ['pork'],
  nobeef: ['beef'],
};

export function ingredientCategories(ing) {
  const text = `${ing.en || ''} ${ing.ja || ''}`;
  const cats = new Set();
  for (const [cat, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (patterns.some((p) => p.test(text))) cats.add(cat);
  }
  return cats;
}

const cache = new WeakMap();
export function recipeCategories(recipe) {
  if (cache.has(recipe)) return cache.get(recipe);
  const cats = new Set();
  for (const ing of recipe.ingredients || []) {
    for (const c of ingredientCategories(ing)) cats.add(c);
  }
  // Seasonings are sometimes only mentioned in the steps ("season with soy
  // sauce"). Scanning them too errs on the side of caution for allergies.
  for (const step of recipe.steps || []) {
    for (const c of ingredientCategories({ en: step })) cats.add(c);
  }
  cache.set(recipe, cats);
  return cats;
}

export function proteinPerServing(recipe) {
  return recipe.macros?.protein ?? 0;
}

/** Diet labels this recipe satisfies, e.g. ['vegetarian', 'gluten']. */
export function dietBadges(recipe) {
  const cats = recipeCategories(recipe);
  const out = [];
  for (const [diet, forbids] of Object.entries(DIET_FORBIDS)) {
    if (diet === 'nopork' || diet === 'nobeef' || diet === 'halal') continue;
    if (!forbids.some((c) => cats.has(c))) out.push(diet);
  }
  if (proteinPerServing(recipe) >= 25) out.push('highprotein');
  // "vegan" implies "vegetarian" — keep only the stronger one
  if (out.includes('vegan')) return out.filter((d) => d !== 'vegetarian');
  return out;
}

export function containsAllergens(recipe) {
  const cats = recipeCategories(recipe);
  return ALLERGEN_CATS.filter((c) => cats.has(c));
}

/**
 * Returns a list of reasons this recipe is NOT ok for the user (empty = ok).
 * allergies: array of strings — either category ids from ALLERGENS or free text.
 */
export function conflicts(recipe, dietProfile = 'none', allergies = []) {
  const cats = recipeCategories(recipe);
  const reasons = [];
  for (const c of DIET_FORBIDS[dietProfile] || []) {
    if (cats.has(c)) reasons.push(CATEGORY_LABELS[c]);
  }
  if (dietProfile === 'highprotein' && proteinPerServing(recipe) < 25) reasons.push('Under 25 g protein');
  for (const a of allergies) {
    if (CATEGORY_PATTERNS[a]) {
      if (cats.has(a)) reasons.push(CATEGORY_LABELS[a]);
    } else {
      const needle = a.trim().toLowerCase();
      if (!needle) continue;
      const hit = (recipe.ingredients || []).some((i) =>
        `${i.en || ''} ${i.ja || ''}`.toLowerCase().includes(needle),
      );
      if (hit) reasons.push(a);
    }
  }
  return [...new Set(reasons)];
}

export function isAllowed(recipe, dietProfile, allergies) {
  return conflicts(recipe, dietProfile, allergies).length === 0;
}

export function pantryMatches(recipe, pantry = []) {
  if (!pantry.length) return 0;
  const words = pantry.map((p) => p.toLowerCase().trim()).filter(Boolean);
  return (recipe.ingredients || []).filter((i) => {
    const en = (i.en || '').toLowerCase().replace(/\(.*?\)/g, '').trim();
    const ja = i.ja || '';
    const label = (i.label || '').toLowerCase().replace(/[(（].*?[)）]/g, '').trim(); // localized name, if any
    return words.some((w) => en.includes(w) || (en && w.includes(en)) || (ja && w.includes(ja)) || ja.includes(w)
      || (label && (label.includes(w) || w.includes(label))));
  }).length;
}
