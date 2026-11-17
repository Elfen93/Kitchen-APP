// POST /api/generate — builds the recipe prompt on the server and asks Claude
// for structured JSON. The browser only sends preferences, never a raw prompt
// or model name, so the API key can't be used as a general-purpose proxy.
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { readBody, originAllowed, clientIp, rateLimited, str } from './_lib/http.js';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const LANGS = { en: 'English', es: 'Spanish', ja: 'Japanese' };

const MEALS = {
  breakfast: 'quick Japanese-style or simple breakfasts (rice, eggs, miso soup, toast sets, oatmeal, yogurt)',
  lunch: 'lunches: donburi, noodles (udon, soba, ramen), curry, fried rice, bento-style plates',
  dinner: 'dinners: stir-fries, nabe, grilled fish, simmered dishes, Japanese-style pasta',
  snack: 'cheap snacks and light bites: onigiri, edamame, frozen gyoza, mochi, fruit',
};

const DIETS = {
  vegetarian: 'Strictly vegetarian: no meat, no fish, no seafood, and no bonito dashi or mentsuyu (use kombu dashi).',
  vegan: 'Strictly vegan: no meat, fish, seafood, eggs, dairy, honey, mayonnaise, bonito dashi or mentsuyu.',
  pescatarian: 'Pescatarian: fish and seafood allowed, no pork, beef or chicken.',
  lactose: 'Dairy free: no milk, butter, cheese, cream or yogurt.',
  gluten: 'Gluten free: no wheat. Regular soy sauce, mentsuyu, udon, ramen, curry roux and most soba contain wheat — use tamari (たまり醤油) or salt instead.',
  halal: 'Halal: no pork and no alcohol, including mirin and sake.',
  nopork: 'No pork, ham, bacon or frozen gyoza.',
  nobeef: 'No beef.',
  highprotein: 'High protein: every recipe must have at least 25 g protein per serving.',
};

const Ingredient = z.object({
  en: z.string().describe('English name as a shopper would say it'),
  ja: z.string().describe('Japanese name as printed on supermarket labels'),
  amount: z.number(),
  unit: z.enum(['g', 'ml', 'unit', 'pack']),
  price: z.number().describe('Yen cost of the amount actually used, at typical 2025–26 Tokyo supermarket prices'),
});

const Recipe = z.object({
  title: z.string(),
  titleJa: z.string(),
  emoji: z.string().describe('One food emoji that represents the dish'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['Easiest', 'Easy', 'Intermediate']),
  prepTime: z.number(),
  cookTime: z.number(),
  servings: z.number(),
  calories: z.number().describe('kcal per serving'),
  macros: z.object({ protein: z.number(), carbs: z.number(), fat: z.number() }).describe('grams per serving'),
  equipment: z.array(z.string()),
  steps: z.array(z.string()),
  ingredients: z.array(Ingredient),
  tip: z.string().describe('One practical money-saving or shopping tip for this dish in Japan'),
  translation: z.object({
    title: z.string(),
    steps: z.array(z.string()),
    ingredients: z.array(z.string()).describe('Ingredient names in the same order as ingredients'),
    equipment: z.array(z.string()),
    tip: z.string(),
  }).describe('The same recipe in the requested display language; copy the English if the display language is English'),
});

const Output = z.object({ recipes: z.array(Recipe) });

function list(v, maxItems, maxLen) {
  return Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter(Boolean).slice(0, maxItems) : [];
}

function buildPrompt(p) {
  const lines = [
    `Create ${p.count} different ${p.mealType} recipes for someone living in Japan on a tight budget.`,
    `Focus: ${MEALS[p.mealType]}.`,
    'Use only ingredients sold at ordinary Japanese supermarkets (Gyomu Super, OK, Life, Aeon) and a small apartment kitchen: one or two burners, a rice cooker, a microwave, usually no oven.',
    'Prices are the yen cost of the amount used, not the full package. Keep them realistic; do not undercount.',
    'Steps should be short, concrete and in order, written for someone who does not read Japanese.',
    'Write title, steps, ingredient "en", equipment and tip in English, ingredient "ja" as printed on Japanese labels.',
    `Also fill "translation" with the same recipe in ${LANGS[p.lang]} (same order and number of steps, ingredients and equipment).`,
  ];
  if (p.difficulty !== 'Any') lines.push(`Difficulty: ${p.difficulty}.`);
  if (p.maxCostPerServing) lines.push(`Keep the cost per serving under about ¥${p.maxCostPerServing}.`);
  if (p.calorieTarget) lines.push(`Aim for roughly ${p.calorieTarget} kcal per serving.`);
  if (DIETS[p.diet]) lines.push(DIETS[p.diet]);
  if (p.allergies.length) {
    lines.push(`Allergies — must be completely absent, including hidden sources (sauces, stocks, roux): ${p.allergies.join(', ')}.`);
  }
  if (p.pantry.length) {
    lines.push(`The cook already has: ${p.pantry.join(', ')}. Build the recipes mainly around these and keep extra purchases few and cheap.`);
  }
  if (p.avoid.length) lines.push(`Do not repeat these dishes: ${p.avoid.join(', ')}.`);
  return lines.join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'Origin not allowed' });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'Recipe generation is not configured on this server.' });
  }
  if (rateLimited(`gen:${clientIp(req)}`, 12, 10 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many requests — try again in a few minutes.' });
  }

  const b = readBody(req);
  const p = {
    mealType: MEALS[b.mealType] ? b.mealType : 'dinner',
    difficulty: ['Easiest', 'Easy', 'Intermediate'].includes(b.difficulty) ? b.difficulty : 'Any',
    diet: DIETS[b.diet] ? b.diet : 'none',
    allergies: list(b.allergies, 15, 40),
    pantry: list(b.pantry, 30, 40),
    avoid: list(b.avoid, 20, 60),
    lang: LANGS[b.lang] ? b.lang : 'en',
    count: Math.min(6, Math.max(1, Number(b.count) || 4)),
    maxCostPerServing: Math.min(3000, Math.max(0, Math.round(Number(b.maxCostPerServing) || 0))),
    calorieTarget: Math.min(1500, Math.max(0, Math.round(Number(b.calorieTarget) || 0))),
  };

  const client = new Anthropic();
  try {
    const msg = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: 'low', format: zodOutputFormat(Output) },
      system: 'You are a practical home-cooking assistant for people on low incomes living in Japan, many of them recently arrived. You write honest, cheap, filling recipes.',
      messages: [{ role: 'user', content: buildPrompt(p) }],
    });

    if (msg.stop_reason === 'refusal') return res.status(422).json({ error: 'The request was declined. Try different settings.' });
    if (msg.stop_reason === 'max_tokens' || !msg.parsed_output) {
      return res.status(502).json({ error: 'The recipe response was incomplete. Please try again.' });
    }
    const recipes = msg.parsed_output.recipes.slice(0, p.count).map(({ translation, ...r }) => ({
      ...r,
      mealType: p.mealType,
      i18n: p.lang !== 'en' && translation ? { [p.lang]: translation } : {},
    }));
    return res.status(200).json({ recipes });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'The recipe service is busy — try again shortly.' });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error('Anthropic auth failed — check ANTHROPIC_API_KEY');
      return res.status(503).json({ error: 'Recipe generation is misconfigured on the server.' });
    }
    if (err instanceof Anthropic.APIError) {
      console.error('Anthropic API error', err.status, err.message);
      return res.status(502).json({ error: 'The recipe service failed. Please try again.' });
    }
    console.error('generate failed', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}
