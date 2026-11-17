// Static reference data: meal types, diet profiles, allergens, shopping guide.

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Morning', ja: '朝食' },
  { id: 'lunch', label: 'Lunch', ja: '昼食' },
  { id: 'dinner', label: 'Dinner', ja: '夕食' },
  { id: 'snack', label: 'Snack', ja: '間食' },
];

export const DIFFICULTIES = ['Any', 'Easiest', 'Easy', 'Intermediate'];

export const BUDGET_STEPS = [3000, 5000, 7000, 8000, 10000, 12000, 15000, 20000, 30000];
export const CALORIE_STEPS = [1200, 1500, 1800, 2000, 2200, 2500, 3000];

export const DIET_PROFILES = [
  { id: 'none', label: 'No restrictions', emoji: '🍽️', desc: 'Show everything' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗', desc: 'No meat, fish or fish stock' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱', desc: 'No animal products at all' },
  { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟', desc: 'Fish ok, no meat' },
  { id: 'lactose', label: 'Dairy free', emoji: '🥛', desc: 'No milk, butter, cheese' },
  { id: 'gluten', label: 'Gluten free', emoji: '🌾', desc: 'No wheat — incl. soy sauce' },
  { id: 'halal', label: 'Halal', emoji: '☪️', desc: 'No pork or mirin/sake. Buy halal-certified meat.' },
  { id: 'nopork', label: 'No pork', emoji: '🐷', desc: 'No pork products' },
  { id: 'nobeef', label: 'No beef', emoji: '🐄', desc: 'No beef' },
  { id: 'highprotein', label: 'High protein', emoji: '💪', desc: '25 g+ protein per serving' },
];

// Allergen label → category used by src/lib/diet.js
export const ALLERGENS = [
  { label: 'Gluten / wheat', cat: 'gluten', ja: '小麦' },
  { label: 'Dairy', cat: 'dairy', ja: '乳' },
  { label: 'Eggs', cat: 'egg', ja: '卵' },
  { label: 'Fish', cat: 'fish', ja: '魚' },
  { label: 'Shellfish', cat: 'shellfish', ja: 'えび・かに' },
  { label: 'Soy', cat: 'soy', ja: '大豆' },
  { label: 'Sesame', cat: 'sesame', ja: 'ごま' },
  { label: 'Peanuts', cat: 'peanut', ja: '落花生' },
  { label: 'Tree nuts', cat: 'treenut', ja: 'ナッツ' },
  { label: 'Buckwheat', cat: 'buckwheat', ja: 'そば' },
];

export const COMMON_INGREDIENTS = [
  'Rice', 'Eggs', 'Tofu', 'Chicken', 'Pork', 'Beef', 'Salmon', 'Canned tuna',
  'Cabbage', 'Onion', 'Carrot', 'Potato', 'Daikon', 'Spinach', 'Bean sprouts', 'Mushrooms',
  'Miso', 'Soy sauce', 'Mirin', 'Sesame oil', 'Dashi', 'Curry roux', 'Ramen noodles',
  'Udon', 'Pasta', 'Bread', 'Milk', 'Cheese', 'Butter', 'Mayonnaise',
  'Natto', 'Kimchi', 'Frozen veggies', 'Canned tomatoes', 'Avocado',
];

export const PANTRY_STAPLES = [
  { en: 'Rice', ja: 'お米', tip: '5 kg bags at Gyomu Super or OK are the cheapest per kilo.' },
  { en: 'Soy sauce', ja: '醤油', tip: '1 L lasts months. Contains wheat — look for 小麦不使用 if gluten free.' },
  { en: 'Miso', ja: '味噌', tip: 'Keeps 3–6 months in the fridge.' },
  { en: 'Mirin', ja: 'みりん', tip: 'Sweet seasoning. 本みりん contains alcohol; みりん風調味料 has almost none.' },
  { en: 'Dashi granules', ja: 'だしの素', tip: 'Usually bonito (fish). Vegetarians: look for 昆布だし.' },
  { en: 'Eggs', ja: '卵', tip: 'Cheapest protein per gram in most stores.' },
  { en: 'Tofu', ja: '豆腐', tip: '木綿 = firm, 絹 = silken. Often under ¥100.' },
  { en: 'Frozen vegetables', ja: '冷凍野菜', tip: 'No waste, same nutrients, cheap in bulk.' },
  { en: 'Bean sprouts', ja: 'もやし', tip: 'Often ¥30–40 a bag. Use within 2 days.' },
  { en: 'Canned tuna', ja: 'ツナ缶', tip: 'Fast protein for rice, pasta and salads.' },
];

export const STORES = [
  { name: 'Gyomu Super', ja: '業務スーパー', tip: 'Bulk packs of rice, frozen veg, tofu, sauces. Usually the cheapest pantry basics.' },
  { name: 'OK Store', ja: 'オーケー', tip: 'Permanently low prices instead of sales. Strong on dry goods and condiments.' },
  { name: 'Life / local supermarkets', ja: 'ライフ', tip: 'Discount stickers (値引き / 半額) on meat, fish and bento in the evening.' },
  { name: 'Aeon', ja: 'イオン', tip: 'Topvalu house brand is a reliable cheap option. Check the app for member days.' },
  { name: 'Drugstores', ja: 'ドラッグストア', tip: 'Often cheaper than supermarkets for eggs, milk, rice, instant foods and drinks.' },
  { name: 'Don Quijote', ja: 'ドン・キホーテ', tip: 'House-brand snacks and frozen food. Open late.' },
];

export const SHELF_WORDS = [
  { ja: '半額', en: 'Half price' },
  { ja: '値引き', en: 'Discounted' },
  { ja: '◯円引き', en: '¥◯ off' },
  { ja: '国産', en: 'Domestic (Japan)' },
  { ja: '特売', en: 'Special sale' },
  { ja: '税込 / 税抜', en: 'Tax incl. / excl.' },
  { ja: '消費期限', en: 'Use by (safety)' },
  { ja: '賞味期限', en: 'Best before (quality)' },
  { ja: '鶏むね肉', en: 'Chicken breast (cheapest meat)' },
  { ja: '豚こま', en: 'Pork scraps (cheap, versatile)' },
];

export const SEASONAL = {
  spring: ['Cabbage キャベツ', 'Bamboo shoots 筍', 'New onions 新玉ねぎ', 'Strawberries 苺'],
  summer: ['Tomatoes トマト', 'Cucumber きゅうり', 'Eggplant なす', 'Bitter melon ゴーヤ'],
  autumn: ['Sweet potato さつまいも', 'Mushrooms きのこ', 'Kabocha かぼちゃ', 'Sanma さんま'],
  winter: ['Daikon 大根', 'Napa cabbage 白菜', 'Leeks ねぎ', 'Spinach ほうれん草'],
};

export function currentSeason(date = new Date()) {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}
