import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, ShoppingCart, Heart, Lightbulb, Target, X, Plus, Minus,
  ChevronRight, CheckCircle2, Edit3, Check, Coffee, Sun, Moon,
  Package, Flame, Zap, Timer, ChefHat, Trash2, RefreshCw,
  Star, ChevronDown, Wallet, SlidersHorizontal, Refrigerator,
  Users, Send, ThumbsUp, Globe, AlertCircle
} from 'lucide-react';

/* ─── DESIGN TOKENS ──────────────────────────────────────────── */
const T = {
  bg:'#F7F4EF', surface:'#FFFFFF', ink:'#1A1A18', ink2:'#6B6860',
  ink3:'#B8B5AE', border:'#E8E4DC', green:'#2D7A4F', greenBg:'#EAF4EE',
  red:'#C0392B', redBg:'#FDECEA', yellow:'#D97706', yellowBg:'#FEF3E2',
  blue:'#1D4ED8', blueBg:'#EFF3FF',
};
const FD = "'Georgia','Times New Roman',serif";
const FB = "-apple-system,'Helvetica Neue',sans-serif";
const FM = "'SF Mono','Courier New',monospace";

/* ─── RECIPE DATABASE ────────────────────────────────────────── */
/* 40 recipes across all meal types, difficulties, and diets */
const ALL_RECIPES = [
  // ── BREAKFAST ──────────────────────────────────────────────
  { id:1, mealType:'breakfast', title:'Tamago Gohan', titleJa:'卵かけご飯', difficulty:'Easiest',
    prepTime:2, cookTime:0, servings:1, budget:80, calories:320,
    macros:{protein:14,carbs:55,fat:7}, equipment:['Bowl'],
    tags:['vegetarian'], photo:'rice bowl egg',
    steps:['Cook 1 cup rice in rice cooker or pot.','Let it cool for 1 minute — too hot will cook the egg.','Crack 1 raw egg directly over warm rice.','Add soy sauce and mix vigorously until creamy.'],
    ingredients:[{en:'Cooked rice',ja:'ご飯',price:30,amount:200,unit:'g'},{en:'Egg (1)',ja:'卵',price:20,amount:1,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:5,amount:5,unit:'ml'}]},

  { id:2, mealType:'breakfast', title:'Miso Soup & Rice', titleJa:'味噌汁とご飯', difficulty:'Easiest',
    prepTime:5, cookTime:5, servings:2, budget:120, calories:280,
    macros:{protein:10,carbs:50,fat:4}, equipment:['Pot','Bowl'],
    tags:['vegetarian','vegan'],photo:'miso soup tofu',
    steps:['Boil 400ml water, add 1 tsp dashi powder.','Lower heat, dissolve 2 tbsp miso — never boil after.','Add silken tofu cubes and wakame seaweed.','Serve with steamed rice and pickles if available.'],
    ingredients:[{en:'Miso paste',ja:'味噌',price:30,amount:40,unit:'g'},{en:'Silken tofu',ja:'絹豆腐',price:50,amount:150,unit:'g'},{en:'Dashi powder',ja:'だしの素',price:15,amount:5,unit:'g'},{en:'Dried wakame',ja:'わかめ',price:20,amount:3,unit:'g'}]},

  { id:3, mealType:'breakfast', title:'Japanese Toast Set', titleJa:'トーストセット', difficulty:'Easiest',
    prepTime:3, cookTime:5, servings:1, budget:150, calories:380,
    macros:{protein:12,carbs:52,fat:14}, equipment:['Toaster'],
    tags:['vegetarian'],photo:'buttered toast egg',
    steps:['Toast bread slices until golden.','Spread butter while hot.','Fry egg sunny-side up in a dry pan.','Serve with milk or coffee.'],
    ingredients:[{en:'Bread (2 slices)',ja:'食パン',price:40,amount:2,unit:'unit'},{en:'Butter',ja:'バター',price:30,amount:10,unit:'g'},{en:'Egg (1)',ja:'卵',price:20,amount:1,unit:'unit'},{en:'Milk',ja:'牛乳',price:40,amount:200,unit:'ml'}]},

  { id:4, mealType:'breakfast', title:'Natto Rice', titleJa:'納豆ご飯', difficulty:'Easiest',
    prepTime:2, cookTime:0, servings:1, budget:90, calories:340,
    macros:{protein:18,carbs:54,fat:6}, equipment:['Bowl'],
    tags:['vegetarian','vegan','high-protein'],photo:'natto rice bowl',
    steps:['Open natto pack and add included sauce and mustard.','Stir vigorously 50 times until stringy.','Pour over warm rice.','Top with chopped green onion.'],
    ingredients:[{en:'Natto (1 pack)',ja:'納豆',price:50,amount:1,unit:'pack'},{en:'Cooked rice',ja:'ご飯',price:30,amount:200,unit:'g'},{en:'Green onion',ja:'ねぎ',price:10,amount:10,unit:'g'}]},

  { id:5, mealType:'breakfast', title:'Oat Porridge with Banana', titleJa:'オートミールバナナ', difficulty:'Easiest',
    prepTime:2, cookTime:5, servings:1, budget:130, calories:360,
    macros:{protein:9,carbs:65,fat:5}, equipment:['Pot or Microwave'],
    tags:['vegetarian','vegan','lactose-free'],photo:'oatmeal banana bowl',
    steps:['Combine oats and water (or milk) in a bowl.','Microwave 2 min, stir halfway.','Slice banana on top.','Drizzle a little honey or soy milk if available.'],
    ingredients:[{en:'Rolled oats',ja:'オートミール',price:60,amount:80,unit:'g'},{en:'Banana (1)',ja:'バナナ',price:30,amount:1,unit:'unit'},{en:'Water or soy milk',ja:'水／豆乳',price:20,amount:200,unit:'ml'}]},

  { id:6, mealType:'breakfast', title:'Yogurt Granola Bowl', titleJa:'ヨーグルトグラノーラ', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:180, calories:390,
    macros:{protein:12,carbs:58,fat:9}, equipment:['Bowl'],
    tags:['vegetarian','gluten-free'],photo:'yogurt granola berries bowl',
    steps:['Spoon yogurt into a bowl.','Top generously with granola.','Add seasonal fruit if available.','Drizzle honey to taste.'],
    ingredients:[{en:'Plain yogurt',ja:'ヨーグルト',price:80,amount:200,unit:'g'},{en:'Granola',ja:'グラノーラ',price:60,amount:50,unit:'g'},{en:'Honey',ja:'はちみつ',price:20,amount:10,unit:'g'}]},

  // ── SNACKS ──────────────────────────────────────────────────
  { id:7, mealType:'snack', title:'Onigiri — Tuna Mayo', titleJa:'ツナマヨおにぎり', difficulty:'Easy',
    prepTime:10, cookTime:0, servings:2, budget:180, calories:280,
    macros:{protein:10,carbs:48,fat:6}, equipment:['Bowl','Plastic wrap'],
    tags:['pescatarian'],photo:'tuna mayo onigiri japanese',
    steps:['Mix drained canned tuna with mayonnaise and a pinch of soy sauce.','Wet hands and coat with salt.','Place rice in palm, add filling, shape into triangle.','Wrap with nori strip or leave plain.'],
    ingredients:[{en:'Cooked rice',ja:'ご飯',price:60,amount:400,unit:'g'},{en:'Canned tuna',ja:'ツナ缶',price:80,amount:70,unit:'g'},{en:'Mayonnaise',ja:'マヨネーズ',price:20,amount:15,unit:'g'},{en:'Nori sheet',ja:'のり',price:20,amount:2,unit:'unit'}]},

  { id:8, mealType:'snack', title:'Edamame with Sea Salt', titleJa:'塩枝豆', difficulty:'Easiest',
    prepTime:2, cookTime:8, servings:2, budget:120, calories:160,
    macros:{protein:12,carbs:12,fat:5}, equipment:['Pot'],
    tags:['vegetarian','vegan','gluten-free','lactose-free','high-protein'],photo:'edamame salt bowl',
    steps:['Bring salted water to a boil.','Add frozen edamame straight from bag.','Cook 5–6 minutes until tender.','Drain, sprinkle extra salt, and eat immediately.'],
    ingredients:[{en:'Frozen edamame',ja:'冷凍枝豆',price:120,amount:300,unit:'g'}]},

  { id:9, mealType:'snack', title:'Cheese & Crackers', titleJa:'チーズクラッカー', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:150, calories:240,
    macros:{protein:8,carbs:22,fat:12}, equipment:['None'],
    tags:['vegetarian'],photo:'cheese crackers plate',
    steps:['Slice cheese into bite-size pieces.','Arrange on plate with crackers.','Optional: add a few grapes or cherry tomatoes.'],
    ingredients:[{en:'Sliced cheese',ja:'スライスチーズ',price:80,amount:3,unit:'unit'},{en:'Crackers',ja:'クラッカー',price:60,amount:10,unit:'unit'}]},

  { id:10, mealType:'snack', title:'Gyoza (Frozen Pan-fried)', titleJa:'冷凍餃子', difficulty:'Easiest',
    prepTime:2, cookTime:10, servings:2, budget:200, calories:300,
    macros:{protein:10,carbs:35,fat:10}, equipment:['Frying pan with lid'],
    tags:[],photo:'pan fried gyoza dumplings',
    steps:['Heat oiled pan on medium-high.','Place frozen gyoza flat-side down.','Add 100ml water, cover immediately.','Steam 6 min, remove lid, fry 2 more min until crispy.'],
    ingredients:[{en:'Frozen gyoza (pack)',ja:'冷凍餃子',price:200,amount:1,unit:'pack'}]},

  { id:11, mealType:'snack', title:'Apple & Peanut Butter', titleJa:'りんごピーナッツバター', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:120, calories:220,
    macros:{protein:5,carbs:30,fat:9}, equipment:['Knife'],
    tags:['vegetarian','vegan','gluten-free','lactose-free'],photo:'sliced apple peanut butter',
    steps:['Wash and slice apple into wedges.','Remove core.','Serve with peanut butter for dipping.'],
    ingredients:[{en:'Apple',ja:'りんご',price:80,amount:1,unit:'unit'},{en:'Peanut butter',ja:'ピーナッツバター',price:40,amount:30,unit:'g'}]},

  { id:12, mealType:'snack', title:'Mochi with Kinako', titleJa:'きなこ餅', difficulty:'Easiest',
    prepTime:2, cookTime:3, servings:2, budget:100, calories:280,
    macros:{protein:6,carbs:55,fat:3}, equipment:['Microwave'],
    tags:['vegetarian','vegan','gluten-free'],photo:'mochi kinako powder japanese',
    steps:['Microwave kirimochi on damp paper towel 1–2 min until puffy.','Mix kinako (roasted soy flour) with sugar and pinch of salt.','Roll hot mochi in kinako mix.','Eat immediately while soft.'],
    ingredients:[{en:'Kirimochi (2 pieces)',ja:'切り餅',price:60,amount:2,unit:'unit'},{en:'Kinako powder',ja:'きな粉',price:30,amount:20,unit:'g'},{en:'Sugar',ja:'砂糖',price:5,amount:5,unit:'g'}]},

  // ── LUNCH ───────────────────────────────────────────────────
  { id:13, mealType:'lunch', title:'Shoyu Ramen', titleJa:'醤油ラーメン', difficulty:'Easy',
    prepTime:5, cookTime:15, servings:2, budget:380, calories:520,
    macros:{protein:22,carbs:72,fat:12}, equipment:['Pot'],
    tags:[],photo:'shoyu ramen soup noodles',
    steps:['Boil 600ml water with dashi, soy sauce, mirin and sesame oil.','Cook ramen noodles separately per packet instructions.','Drain noodles, place in bowls, pour hot broth over.','Top with soft-boiled egg, nori, and green onion.'],
    ingredients:[{en:'Ramen noodles',ja:'ラーメン麺',price:80,amount:2,unit:'pack'},{en:'Soy sauce',ja:'醤油',price:15,amount:30,unit:'ml'},{en:'Dashi powder',ja:'だしの素',price:10,amount:5,unit:'g'},{en:'Egg (2)',ja:'卵',price:40,amount:2,unit:'unit'},{en:'Green onion',ja:'ねぎ',price:20,amount:30,unit:'g'}]},

  { id:14, mealType:'lunch', title:'Curry Rice', titleJa:'カレーライス', difficulty:'Easy',
    prepTime:10, cookTime:25, servings:4, budget:650, calories:580,
    macros:{protein:18,carbs:80,fat:14}, equipment:['Pot'],
    tags:[],photo:'japanese curry rice bowl',
    steps:['Sauté diced onion until golden, add carrot and potato chunks.','Add water, bring to boil, simmer 15 min until veg is soft.','Turn off heat, add curry roux blocks and stir until dissolved.','Simmer 5 more min, serve over rice.'],
    ingredients:[{en:'Curry roux (half pack)',ja:'カレールー',price:120,amount:100,unit:'g'},{en:'Chicken thigh',ja:'鶏もも肉',price:250,amount:300,unit:'g'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'},{en:'Carrot (1)',ja:'にんじん',price:30,amount:1,unit:'unit'},{en:'Potato (2)',ja:'じゃがいも',price:50,amount:2,unit:'unit'}]},

  { id:15, mealType:'lunch', title:'Vegetable Curry Rice', titleJa:'野菜カレー', difficulty:'Easy',
    prepTime:10, cookTime:25, servings:3, budget:420, calories:500,
    macros:{protein:10,carbs:82,fat:10}, equipment:['Pot'],
    tags:['vegetarian','vegan'],photo:'vegetable curry rice',
    steps:['Sauté onion until golden in oil.','Add chopped sweet potato, eggplant and bell pepper.','Add 500ml water and simmer 15 min.','Dissolve vegan curry roux (check label) and simmer 5 min more.'],
    ingredients:[{en:'Curry roux (check vegan)',ja:'カレールー',price:120,amount:80,unit:'g'},{en:'Sweet potato',ja:'さつまいも',price:80,amount:200,unit:'g'},{en:'Eggplant (1)',ja:'なす',price:60,amount:1,unit:'unit'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'}]},

  { id:16, mealType:'lunch', title:'Gyudon Beef Bowl', titleJa:'牛丼', difficulty:'Easy',
    prepTime:5, cookTime:15, servings:2, budget:580, calories:620,
    macros:{protein:28,carbs:68,fat:18}, equipment:['Frying pan'],
    tags:[],photo:'gyudon beef rice bowl',
    steps:['Simmer sliced onion in dashi, soy sauce, mirin and sugar 5 min.','Add thinly sliced beef (koma-gire), cook 3–4 min.','Taste and adjust seasoning.','Serve over rice with pickled ginger on the side.'],
    ingredients:[{en:'Beef slices (koma-gire)',ja:'牛こま切れ',price:320,amount:250,unit:'g'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:20,amount:40,unit:'ml'},{en:'Mirin',ja:'みりん',price:15,amount:30,unit:'ml'}]},

  { id:17, mealType:'lunch', title:'Cold Soba Noodles', titleJa:'ざるそば', difficulty:'Easy',
    prepTime:5, cookTime:8, servings:2, budget:280, calories:380,
    macros:{protein:14,carbs:68,fat:2}, equipment:['Pot','Bowl'],
    tags:['vegan'],photo:'cold soba noodles dipping sauce',
    steps:['Boil soba noodles per packet (usually 4–5 min).','Rinse immediately under cold water until completely cold.','Mix mentsuyu with cold water per packet ratio for dipping sauce.','Serve noodles on a plate with dipping sauce, wasabi and green onion.'],
    ingredients:[{en:'Soba noodles (2 bundles)',ja:'そば',price:100,amount:200,unit:'g'},{en:'Mentsuyu concentrate',ja:'めんつゆ',price:80,amount:60,unit:'ml'},{en:'Green onion',ja:'ねぎ',price:15,amount:20,unit:'g'}]},

  { id:18, mealType:'lunch', title:'Fried Rice', titleJa:'チャーハン', difficulty:'Easy',
    prepTime:5, cookTime:10, servings:2, budget:280, calories:480,
    macros:{protein:16,carbs:65,fat:12}, equipment:['Wok or large pan'],
    tags:[],photo:'chinese fried rice wok',
    steps:['Use day-old cold rice for best results.','Beat eggs, scramble in oiled pan, set aside.','High heat: stir-fry ham and green onion 1 min.','Add rice, break up clumps, add scrambled egg back. Season with soy sauce.'],
    ingredients:[{en:'Cooked rice (cold)',ja:'ご飯',price:60,amount:400,unit:'g'},{en:'Eggs (2)',ja:'卵',price:40,amount:2,unit:'unit'},{en:'Ham or spam',ja:'ハム',price:80,amount:60,unit:'g'},{en:'Green onion',ja:'ねぎ',price:20,amount:30,unit:'g'},{en:'Soy sauce',ja:'醤油',price:10,amount:15,unit:'ml'}]},

  { id:19, mealType:'lunch', title:'Udon with Soft Egg', titleJa:'たまごうどん', difficulty:'Easiest',
    prepTime:3, cookTime:10, servings:2, budget:220, calories:440,
    macros:{protein:16,carbs:72,fat:8}, equipment:['Pot'],
    tags:['vegetarian'],photo:'udon noodles egg broth',
    steps:['Boil udon noodles per packet.','In a separate small pot, heat mentsuyu broth.','Soft boil eggs 6.5 min, peel under cold water.','Assemble: udon in broth, halve soft egg on top, add green onion.'],
    ingredients:[{en:'Frozen udon (2 packs)',ja:'冷凍うどん',price:100,amount:2,unit:'pack'},{en:'Mentsuyu',ja:'めんつゆ',price:60,amount:80,unit:'ml'},{en:'Eggs (2)',ja:'卵',price:40,amount:2,unit:'unit'}]},

  { id:20, mealType:'lunch', title:'Tofu & Veg Stir-fry Bowl', titleJa:'豆腐炒め丼', difficulty:'Easy',
    prepTime:8, cookTime:12, servings:2, budget:320, calories:420,
    macros:{protein:18,carbs:55,fat:14}, equipment:['Frying pan'],
    tags:['vegetarian','vegan','lactose-free','gluten-free'],photo:'tofu vegetable stir fry bowl',
    steps:['Press firm tofu dry, cut into cubes, pan-fry until golden.','Add bean sprouts, cabbage and frozen veg, stir-fry 3 min.','Season with soy sauce (use tamari for GF), sesame oil and ginger.','Serve over rice with sesame seeds.'],
    ingredients:[{en:'Firm tofu',ja:'木綿豆腐',price:80,amount:300,unit:'g'},{en:'Bean sprouts',ja:'もやし',price:38,amount:200,unit:'g'},{en:'Cabbage',ja:'キャベツ',price:60,amount:150,unit:'g'},{en:'Sesame oil',ja:'ごま油',price:10,amount:10,unit:'ml'}]},

  { id:21, mealType:'lunch', title:'Salmon Flake Donburi', titleJa:'鮭フレーク丼', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:280, calories:520,
    macros:{protein:24,carbs:60,fat:14}, equipment:['Bowl'],
    tags:['pescatarian','gluten-free'],photo:'salmon rice bowl japanese',
    steps:['Warm rice in bowl.','Spoon generous amount of salmon flakes over rice.','Add a raw egg yolk in the center if desired.','Season with soy sauce and sesame seeds.'],
    ingredients:[{en:'Salmon flakes jar',ja:'鮭フレーク',price:180,amount:1,unit:'pack'},{en:'Cooked rice',ja:'ご飯',price:50,amount:250,unit:'g'},{en:'Soy sauce',ja:'醤油',price:5,amount:5,unit:'ml'}]},

  { id:22, mealType:'lunch', title:'Avocado Tuna Salad Bowl', titleJa:'アボカドツナサラダ', difficulty:'Easiest',
    prepTime:8, cookTime:0, servings:2, budget:350, calories:460,
    macros:{protein:18,carbs:42,fat:20}, equipment:['Bowl'],
    tags:['pescatarian','gluten-free','lactose-free'],photo:'avocado tuna salad bowl',
    steps:['Drain tuna, mix with mayo, soy sauce and lemon juice.','Slice avocado, fan over rice.','Top with tuna mix.','Add cucumber slices, sesame seeds and a drizzle of sesame oil.'],
    ingredients:[{en:'Canned tuna (2)',ja:'ツナ缶',price:160,amount:2,unit:'unit'},{en:'Avocado (1)',ja:'アボカド',price:120,amount:1,unit:'unit'},{en:'Mayonnaise',ja:'マヨネーズ',price:20,amount:20,unit:'g'},{en:'Cooked rice',ja:'ご飯',price:50,amount:250,unit:'g'}]},

  // ── DINNER ──────────────────────────────────────────────────
  { id:23, mealType:'dinner', title:'Chicken Teriyaki', titleJa:'鶏の照り焼き', difficulty:'Easy',
    prepTime:10, cookTime:15, servings:2, budget:480, calories:560,
    macros:{protein:36,carbs:45,fat:18}, equipment:['Frying pan'],
    tags:['gluten-free'],photo:'chicken teriyaki rice plate',
    steps:['Score chicken thighs with knife for even cooking.','Pan-fry skin-side down 7 min until golden, flip 3 min.','Mix soy sauce, mirin, sugar and sake, pour over chicken.','Simmer until sauce thickens and coats the chicken.'],
    ingredients:[{en:'Chicken thighs (2)',ja:'鶏もも肉',price:280,amount:300,unit:'g'},{en:'Soy sauce',ja:'醤油',price:20,amount:40,unit:'ml'},{en:'Mirin',ja:'みりん',price:15,amount:30,unit:'ml'},{en:'Sugar',ja:'砂糖',price:5,amount:10,unit:'g'}]},

  { id:24, mealType:'dinner', title:'Pork & Cabbage Stir-fry', titleJa:'豚キャベツ炒め', difficulty:'Easy',
    prepTime:8, cookTime:10, servings:2, budget:380, calories:480,
    macros:{protein:24,carbs:20,fat:22}, equipment:['Wok or large pan'],
    tags:[],photo:'pork cabbage stir fry japanese',
    steps:['Cut cabbage into large chunks, slice pork thin.','High heat, stir-fry pork with garlic until browned.','Add cabbage, cook 2–3 min until slightly wilted.','Season with oyster sauce, soy sauce and sesame oil.'],
    ingredients:[{en:'Pork slices (koma)',ja:'豚こま切れ',price:200,amount:200,unit:'g'},{en:'Cabbage (quarter)',ja:'キャベツ',price:60,amount:250,unit:'g'},{en:'Garlic',ja:'にんにく',price:10,amount:1,unit:'unit'},{en:'Oyster sauce',ja:'オイスターソース',price:15,amount:20,unit:'ml'}]},

  { id:25, mealType:'dinner', title:'Miso Salmon', titleJa:'鮭の味噌焼き', difficulty:'Easy',
    prepTime:5, cookTime:15, servings:2, budget:520, calories:480,
    macros:{protein:38,carbs:18,fat:20}, equipment:['Frying pan or oven'],
    tags:['pescatarian','gluten-free'],photo:'miso glazed salmon fillet',
    steps:['Mix miso, mirin, sake and sugar into a paste.','Coat salmon fillets generously.','Pan-fry on medium 4 min each side, or bake 200°C 12 min.','Serve with steamed rice and a side of pickled daikon.'],
    ingredients:[{en:'Salmon fillets (2)',ja:'鮭の切り身',price:360,amount:2,unit:'unit'},{en:'Miso paste',ja:'味噌',price:30,amount:40,unit:'g'},{en:'Mirin',ja:'みりん',price:10,amount:20,unit:'ml'},{en:'Sugar',ja:'砂糖',price:5,amount:5,unit:'g'}]},

  { id:26, mealType:'dinner', title:'Nikujaga Stew', titleJa:'肉じゃが', difficulty:'Intermediate',
    prepTime:15, cookTime:30, servings:4, budget:680, calories:520,
    macros:{protein:20,carbs:55,fat:16}, equipment:['Pot'],
    tags:[],photo:'nikujaga japanese meat potato stew',
    steps:['Sauté beef slices, add sliced onions until soft.','Add quartered potatoes and halved carrots.','Add dashi, soy sauce, mirin and sugar, bring to boil.','Simmer 20 min covered until potatoes are tender.'],
    ingredients:[{en:'Beef slices',ja:'牛こま切れ',price:280,amount:200,unit:'g'},{en:'Potato (3)',ja:'じゃがいも',price:80,amount:3,unit:'unit'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'},{en:'Carrot (1)',ja:'にんじん',price:30,amount:1,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:20,amount:40,unit:'ml'},{en:'Mirin',ja:'みりん',price:15,amount:30,unit:'ml'}]},

  { id:27, mealType:'dinner', title:'Nabe Hot Pot', titleJa:'鍋', difficulty:'Easy',
    prepTime:10, cookTime:20, servings:3, budget:720, calories:380,
    macros:{protein:28,carbs:30,fat:14}, equipment:['Large pot'],
    tags:[],photo:'japanese nabe hot pot',
    steps:['Prepare dashi broth with soy sauce and mirin in a large pot.','Add tofu, napa cabbage, mushrooms and green onion.','Add chicken or pork slices, simmer until cooked through.','Dip in ponzu sauce to eat; add udon noodles at the end.'],
    ingredients:[{en:'Napa cabbage',ja:'白菜',price:80,amount:300,unit:'g'},{en:'Firm tofu',ja:'豆腐',price:80,amount:300,unit:'g'},{en:'Enoki mushrooms',ja:'えのき',price:80,amount:1,unit:'pack'},{en:'Chicken thigh',ja:'鶏もも肉',price:250,amount:200,unit:'g'},{en:'Ponzu sauce',ja:'ポン酢',price:60,amount:1,unit:'pack'}]},

  { id:28, mealType:'dinner', title:'Vegan Nabe', titleJa:'野菜鍋', difficulty:'Easy',
    prepTime:10, cookTime:20, servings:3, budget:480, calories:290,
    macros:{protein:14,carbs:35,fat:8}, equipment:['Large pot'],
    tags:['vegetarian','vegan','gluten-free','lactose-free'],photo:'vegetable hot pot tofu',
    steps:['Make kombu dashi: soak kombu in cold water 30 min, then heat.','Add napa cabbage, tofu, mushrooms, and daikon.','Season with soy sauce (tamari for GF) and a little salt.','Simmer gently 15 min until vegetables are tender.'],
    ingredients:[{en:'Napa cabbage',ja:'白菜',price:80,amount:300,unit:'g'},{en:'Firm tofu',ja:'豆腐',price:80,amount:300,unit:'g'},{en:'Mixed mushrooms',ja:'きのこミックス',price:100,amount:200,unit:'g'},{en:'Daikon (chunk)',ja:'大根',price:60,amount:200,unit:'g'},{en:'Kombu',ja:'昆布',price:30,amount:1,unit:'pack'}]},

  { id:29, mealType:'dinner', title:'Egg & Tomato Stir-fry', titleJa:'トマト卵炒め', difficulty:'Easy',
    prepTime:5, cookTime:8, servings:2, budget:200, calories:320,
    macros:{protein:14,carbs:18,fat:16}, equipment:['Pan'],
    tags:['vegetarian','lactose-free'],photo:'tomato egg stir fry chinese',
    steps:['Beat 3 eggs with pinch of salt and sugar.','Scramble in oiled pan until just set, remove.','Fry wedged tomatoes 2 min with garlic.','Add eggs back, season with soy sauce and sesame oil.'],
    ingredients:[{en:'Eggs (3)',ja:'卵',price:60,amount:3,unit:'unit'},{en:'Tomatoes (2)',ja:'トマト',price:80,amount:2,unit:'unit'},{en:'Sesame oil',ja:'ごま油',price:8,amount:8,unit:'ml'}]},

  { id:30, mealType:'dinner', title:'Pasta Mentaiko', titleJa:'明太子パスタ', difficulty:'Easy',
    prepTime:5, cookTime:12, servings:2, budget:420, calories:560,
    macros:{protein:22,carbs:78,fat:14}, equipment:['Pot','Bowl'],
    tags:[],photo:'mentaiko pasta japanese cream sauce',
    steps:['Boil pasta al dente, reserve 2 tbsp pasta water.','Mix mentaiko (cod roe) with butter, cream and soy sauce in a bowl.','Drain hot pasta and immediately toss in the raw sauce.','Add pasta water as needed, garnish with nori strips.'],
    ingredients:[{en:'Pasta (200g)',ja:'パスタ',price:80,amount:200,unit:'g'},{en:'Mentaiko (1 pack)',ja:'明太子',price:180,amount:1,unit:'pack'},{en:'Butter',ja:'バター',price:30,amount:20,unit:'g'},{en:'Soy sauce',ja:'醤油',price:5,amount:5,unit:'ml'}]},

  { id:31, mealType:'dinner', title:'Mapo Tofu', titleJa:'麻婆豆腐', difficulty:'Intermediate',
    prepTime:8, cookTime:15, servings:2, budget:380, calories:440,
    macros:{protein:22,carbs:28,fat:20}, equipment:['Wok or pan'],
    tags:[],photo:'mapo tofu spicy sichuan',
    steps:['Fry ground pork with doubanjiang paste until fragrant.','Add chicken stock and bring to boil.','Slide in silken tofu cubes, simmer 5 min without stirring.','Thicken with cornstarch slurry, finish with sesame oil and Sichuan pepper.'],
    ingredients:[{en:'Silken tofu (1 block)',ja:'絹豆腐',price:80,amount:300,unit:'g'},{en:'Ground pork',ja:'豚ひき肉',price:180,amount:150,unit:'g'},{en:'Doubanjiang sauce',ja:'豆板醤',price:30,amount:20,unit:'g'},{en:'Green onion',ja:'ねぎ',price:15,amount:20,unit:'g'}]},

  { id:32, mealType:'dinner', title:'Vegan Mapo Tofu', titleJa:'ヴィーガン麻婆豆腐', difficulty:'Intermediate',
    prepTime:8, cookTime:15, servings:2, budget:300, calories:340,
    macros:{protein:16,carbs:28,fat:14}, equipment:['Pan'],
    tags:['vegetarian','vegan'],photo:'mapo tofu mushroom vegetarian',
    steps:['Finely chop shiitake mushrooms as meat substitute.','Fry with doubanjiang and garlic until fragrant.','Add vegetable stock, bring to boil.','Add silken tofu, simmer 5 min, thicken with cornstarch.'],
    ingredients:[{en:'Silken tofu (1 block)',ja:'絹豆腐',price:80,amount:300,unit:'g'},{en:'Shiitake mushrooms',ja:'しいたけ',price:100,amount:100,unit:'g'},{en:'Doubanjiang',ja:'豆板醤',price:30,amount:20,unit:'g'}]},

  { id:33, mealType:'dinner', title:'Karaage Chicken', titleJa:'唐揚げ', difficulty:'Intermediate',
    prepTime:15, cookTime:15, servings:2, budget:480, calories:640,
    macros:{protein:34,carbs:30,fat:28}, equipment:['Deep pot or deep pan'],
    tags:[],photo:'japanese karaage fried chicken',
    steps:['Marinate bite-size chicken in soy sauce, sake, ginger and garlic 15 min.','Coat lightly in potato starch (katakuriko).','Deep fry at 170°C for 4 min, rest 2 min, fry again at 190°C for 1 min.','Serve with lemon wedge and kewpie mayo.'],
    ingredients:[{en:'Chicken thigh (large)',ja:'鶏もも肉',price:320,amount:350,unit:'g'},{en:'Potato starch',ja:'片栗粉',price:30,amount:40,unit:'g'},{en:'Soy sauce',ja:'醤油',price:15,amount:30,unit:'ml'},{en:'Ginger',ja:'生姜',price:20,amount:10,unit:'g'}]},

  { id:34, mealType:'dinner', title:'Saba Shioyaki (Grilled Mackerel)', titleJa:'サバの塩焼き', difficulty:'Easy',
    prepTime:5, cookTime:12, servings:2, budget:320, calories:440,
    macros:{protein:36,carbs:2,fat:24}, equipment:['Grill or frying pan'],
    tags:['pescatarian','gluten-free','lactose-free'],photo:'grilled mackerel fish japanese',
    steps:['Score mackerel fillet skin with 2–3 diagonal cuts.','Salt generously, rest 10 min, pat dry.','Grill or pan-fry skin-side down 6 min, flip 4 min.','Serve with grated daikon, soy sauce and lemon.'],
    ingredients:[{en:'Mackerel fillet (2)',ja:'サバの切り身',price:240,amount:2,unit:'unit'},{en:'Salt',ja:'塩',price:5,amount:5,unit:'g'},{en:'Daikon for grating',ja:'大根',price:40,amount:100,unit:'g'}]},

  { id:35, mealType:'dinner', title:'Oyakodon', titleJa:'親子丼', difficulty:'Easy',
    prepTime:8, cookTime:12, servings:2, budget:380, calories:580,
    macros:{protein:32,carbs:62,fat:16}, equipment:['Small pan'],
    tags:[],photo:'oyakodon chicken egg rice bowl',
    steps:['Simmer sliced chicken in dashi, soy sauce and mirin 5 min.','Beat eggs, pour over chicken in circular motion.','Cover and cook 1 min — eggs should be just set and creamy.','Slide over rice, garnish with mitsuba or green onion.'],
    ingredients:[{en:'Chicken thigh',ja:'鶏もも肉',price:200,amount:200,unit:'g'},{en:'Eggs (3)',ja:'卵',price:60,amount:3,unit:'unit'},{en:'Onion (half)',ja:'玉ねぎ',price:20,amount:0.5,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:15,amount:30,unit:'ml'},{en:'Mirin',ja:'みりん',price:10,amount:20,unit:'ml'}]},

  { id:36, mealType:'dinner', title:'Kimchi Fried Rice', titleJa:'キムチチャーハン', difficulty:'Easy',
    prepTime:5, cookTime:10, servings:2, budget:280, calories:490,
    macros:{protein:14,carbs:66,fat:12}, equipment:['Wok or pan'],
    tags:['gluten-free','lactose-free'],photo:'kimchi fried rice egg korean',
    steps:['Fry chopped kimchi in sesame oil until fragrant.','Add cold cooked rice, break up and stir-fry on high heat.','Season with soy sauce and gochujang if available.','Top with fried egg and sesame seeds.'],
    ingredients:[{en:'Kimchi',ja:'キムチ',price:80,amount:100,unit:'g'},{en:'Cooked rice',ja:'ご飯',price:60,amount:400,unit:'g'},{en:'Egg (2)',ja:'卵',price:40,amount:2,unit:'unit'},{en:'Sesame oil',ja:'ごま油',price:8,amount:8,unit:'ml'}]},

  { id:37, mealType:'dinner', title:'Yaki Udon', titleJa:'焼きうどん', difficulty:'Easy',
    prepTime:5, cookTime:10, servings:2, budget:340, calories:510,
    macros:{protein:18,carbs:72,fat:10}, equipment:['Large pan'],
    tags:[],photo:'yaki udon stir fried noodles',
    steps:['Pan-fry pork slices until cooked.','Add cabbage and bean sprouts, stir-fry 2 min.','Add thawed udon noodles, break apart.','Season with soy sauce, oyster sauce and sesame oil.'],
    ingredients:[{en:'Frozen udon (2 packs)',ja:'冷凍うどん',price:100,amount:2,unit:'pack'},{en:'Pork slices',ja:'豚こま切れ',price:150,amount:150,unit:'g'},{en:'Cabbage',ja:'キャベツ',price:50,amount:150,unit:'g'},{en:'Bean sprouts',ja:'もやし',price:38,amount:150,unit:'g'}]},

  { id:38, mealType:'dinner', title:'Spinach Gomaae', titleJa:'ほうれん草の胡麻和え', difficulty:'Easy',
    prepTime:5, cookTime:5, servings:2, budget:180, calories:160,
    macros:{protein:8,carbs:14,fat:8}, equipment:['Pot','Bowl'],
    tags:['vegetarian','vegan','gluten-free','lactose-free'],photo:'spinach sesame salad japanese',
    steps:['Blanch spinach 1 minute, drain and squeeze out ALL water.','Cut into 5cm pieces.','Mix toasted sesame paste, soy sauce, sugar and mirin for dressing.','Toss spinach in dressing, serve chilled.'],
    ingredients:[{en:'Spinach (1 bag)',ja:'ほうれん草',price:100,amount:200,unit:'g'},{en:'Sesame paste/tahini',ja:'ねりごま',price:30,amount:20,unit:'g'},{en:'Soy sauce',ja:'醤油',price:10,amount:15,unit:'ml'},{en:'Sugar',ja:'砂糖',price:5,amount:5,unit:'g'}]},

  { id:39, mealType:'dinner', title:'Tofu Steak', titleJa:'豆腐ステーキ', difficulty:'Easy',
    prepTime:5, cookTime:12, servings:2, budget:220, calories:280,
    macros:{protein:16,carbs:12,fat:14}, equipment:['Frying pan'],
    tags:['vegetarian','vegan','gluten-free','lactose-free'],photo:'tofu steak sesame sauce pan',
    steps:['Press firm tofu dry with paper towels, slice into thick slabs.','Pan-fry in sesame oil until both sides are golden and crispy.','Mix soy sauce, mirin, and grated ginger for sauce.','Pour sauce over hot tofu, garnish with green onion and sesame.'],
    ingredients:[{en:'Firm tofu (1 block)',ja:'木綿豆腐',price:80,amount:300,unit:'g'},{en:'Sesame oil',ja:'ごま油',price:10,amount:10,unit:'ml'},{en:'Soy sauce',ja:'醤油',price:15,amount:25,unit:'ml'},{en:'Ginger',ja:'生姜',price:15,amount:8,unit:'g'}]},

  { id:40, mealType:'dinner', title:'High-Protein Egg Fried Tofu', titleJa:'卵豆腐炒め', difficulty:'Easy',
    prepTime:8, cookTime:12, servings:2, budget:260, calories:380,
    macros:{protein:28,carbs:14,fat:20}, equipment:['Pan'],
    tags:['vegetarian','gluten-free','lactose-free','high-protein'],photo:'tofu egg stir fry protein',
    steps:['Crumble firm tofu into rough chunks.','Beat 3 eggs with soy sauce.','Pan-fry tofu until slightly crispy.','Pour eggs over, fold together, season and serve over rice.'],
    ingredients:[{en:'Firm tofu (1 block)',ja:'木綿豆腐',price:80,amount:300,unit:'g'},{en:'Eggs (3)',ja:'卵',price:60,amount:3,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:10,amount:15,unit:'ml'},{en:'Sesame oil',ja:'ごま油',price:8,amount:8,unit:'ml'}]},
];

/* ─── DIETARY FILTER LOGIC ───────────────────────────────────── */
const DIET_EXCLUDE = {
  vegetarian: ['pork','beef','chicken','fish','tuna','salmon','mackerel','saba','shrimp','mentaiko','seafood'],
  vegan:      ['pork','beef','chicken','fish','tuna','salmon','mackerel','saba','shrimp','mentaiko','egg','eggs','milk','butter','cheese','dairy','yogurt','honey','cream'],
  pescatarian:['pork','beef','chicken'],
  lactose:    ['milk','butter','cheese','cream','dairy','yogurt'],
  gluten:     ['wheat','soy sauce','udon','ramen','pasta','bread','cracker','flour','barley'],
  halal:      ['pork','ham','bacon','alcohol','sake','mirin','wine','beer'],
  nopork:     ['pork','ham','bacon','lard'],
  nobeef:     ['beef','veal'],
};

function recipeMatchesDiet(recipe, dietaryProfile, allergies=[]) {
  if(dietaryProfile && dietaryProfile!=='none') {
    const profileTags = {
      vegetarian:'vegetarian', vegan:'vegan', pescatarian:'pescatarian',
      lactose:'lactose-free', gluten:'gluten-free', halal:'halal',
      nopork:'', nobeef:'', highprotein:'high-protein', none:'',
    };
    const requiredTag = profileTags[dietaryProfile];
    if(requiredTag && !recipe.tags.includes(requiredTag) && !recipe.tags.includes(dietaryProfile)) {
      // Fallback: check ingredient names
      const blocked = DIET_EXCLUDE[dietaryProfile] || [];
      const hasBlockedIng = recipe.ingredients.some(ing =>
        blocked.some(b => ing.en.toLowerCase().includes(b))
      );
      if(hasBlockedIng) return false;
    }
  }
  if(allergies.length > 0) {
    const allergyLower = allergies.map(a=>a.toLowerCase());
    return !recipe.ingredients.some(ing =>
      allergyLower.some(a => ing.en.toLowerCase().includes(a))
    );
  }
  return true;
}

/* ─── STATIC DATA ────────────────────────────────────────────── */
const MEAL_TYPES = [
  {id:'breakfast',label:'Morning', ja:'朝食',icon:Coffee, dot:'#F59E0B'},
  {id:'snack',    label:'Snack',   ja:'間食',icon:Package,dot:'#8B5CF6'},
  {id:'lunch',    label:'Lunch',   ja:'昼食',icon:Sun,    dot:T.green},
  {id:'dinner',   label:'Dinner',  ja:'夕食',icon:Moon,   dot:'#1D4ED8'},
];
const BUDGET_STEPS  = [3000,5000,7000,8000,10000,12000,15000,20000,30000];
const CALORIE_STEPS = [1200,1500,1800,2000,2200,2500,3000];
const DIFFICULTY_OPTS = ['Any','Easiest','Easy','Intermediate'];
const UNITS = [
  {id:'g',label:'g'},{id:'kg',label:'kg'},{id:'ml',label:'mL'},
  {id:'l',label:'L'},{id:'unit',label:'unit'},{id:'pack',label:'pack'},
];
const DIETARY_PROFILES = [
  {id:'none',       label:'No restrictions', emoji:'🍽️', desc:'Show everything'},
  {id:'vegetarian', label:'Vegetarian',       emoji:'🥗', desc:'No meat or fish'},
  {id:'vegan',      label:'Vegan',            emoji:'🌱', desc:'No animal products'},
  {id:'pescatarian',label:'Pescatarian',      emoji:'🐟', desc:'Fish ok, no meat'},
  {id:'lactose',    label:'Lactose free',     emoji:'🥛', desc:'No dairy'},
  {id:'gluten',     label:'Gluten free',      emoji:'🌾', desc:'No wheat/gluten'},
  {id:'halal',      label:'Halal',            emoji:'☪️', desc:'No pork or alcohol'},
  {id:'nopork',     label:'No pork',          emoji:'🐷', desc:'No pork products'},
  {id:'nobeef',     label:'No beef',          emoji:'🐄', desc:'No beef or veal'},
  {id:'highprotein',label:'High protein',     emoji:'💪', desc:'25g+ protein/serving'},
];
const COMMON_ALLERGENS = [
  'Gluten','Dairy','Eggs','Shellfish','Fish','Peanuts',
  'Tree nuts','Soy','Sesame','Wheat','Buckwheat (soba)','Shrimp',
];
const PANTRY_STAPLES = [
  {en:'Soy Sauce',ja:'醤油',icon:'🧂',tip:'1L lasts months. Core of Japanese cooking.'},
  {en:'Rice',ja:'お米',icon:'🌾',tip:'5kg from Gyomu Super. Always have it.'},
  {en:'Miso Paste',ja:'味噌',icon:'🫙',tip:'Keeps 3–6 months refrigerated.'},
  {en:'Mirin',ja:'みりん',icon:'🍶',tip:'Sweet cooking sake. Transforms any sauce.'},
  {en:'Sesame Oil',ja:'ごま油',icon:'🫒',tip:'A few drops finish any stir-fry.'},
  {en:'Dashi (instant)',ja:'だし',icon:'🍵',tip:'Instant granules. Miso soup in 3 min.'},
  {en:'Eggs',ja:'卵',icon:'🥚',tip:'Cheapest protein in Japan. Always have 10.'},
  {en:'Tofu',ja:'豆腐',icon:'⬜',tip:'Under ¥100 for 3-pack. Very versatile.'},
  {en:'Frozen Veggies',ja:'冷凍野菜',icon:'🥦',tip:'Same nutrients as fresh, 60% cheaper.'},
  {en:'Canned tuna',ja:'ツナ缶',icon:'🥫',tip:'Fast protein for rice, sandwiches, salads.'},
];
const SUPERMARKET_TIPS = [
  {store:'Life (ライフ)',color:'#C0392B',tip:'Yellow stickers appear after 19:00 on meat, fish and bento — up to 50% off. Best on weekday evenings.'},
  {store:'Gyomu Super (業務スーパー)',color:'#1D4ED8',tip:'Bulk packs for rice, frozen veg and sauces. Cheapest pantry staples in Japan.'},
  {store:'Aeon (イオン)',color:T.green,tip:'Wednesday is "Happy Day" — 5% off everything. Stack with the Aeon app coupons.'},
  {store:'OK Store (オーケー)',color:'#374151',tip:'No sales, just permanently low prices. Best for dry goods and condiments.'},
  {store:'Donki (ドン・キホーテ)',color:'#D97706',tip:'House-brand snacks and frozen meals often cheaper than supermarkets. Open 24h.'},
  {store:'Convenience stores',color:'#6B7280',tip:'Onigiri and sandwiches discounted after 21:00. Great cheap calorie option.'},
];
const SEASONAL = {
  spring:['Bamboo shoots 筍','Cabbage キャベツ','Strawberries 苺','Asparagus アスパラ'],
  summer:['Tomatoes トマト','Cucumber きゅうり','Eggplant 茄子','Bitter melon ゴーヤ'],
  autumn:['Sweet potato さつまいも','Mushrooms きのこ','Kabocha かぼちゃ','Chestnuts 栗'],
  winter:['Daikon 大根','Napa cabbage 白菜','Leeks ねぎ','Spinach ほうれん草'],
};
const COMMON_INGREDIENTS = [
  'Rice','Eggs','Tofu','Chicken','Pork','Beef','Salmon','Tuna (canned)',
  'Cabbage','Onion','Carrot','Potato','Daikon','Spinach','Bean sprouts','Mushrooms',
  'Miso','Soy Sauce','Mirin','Sesame oil','Dashi','Curry roux','Ramen noodles',
  'Udon noodles','Pasta','Bread','Milk','Cheese','Butter','Mayonnaise',
  'Natto','Kimchi','Frozen veggies','Canned tomatoes','Avocado',
];

/* ─── HELPERS ────────────────────────────────────────────────── */
const yen    = n => '¥' + Math.round(n||0).toLocaleString();
// Photo helper — uses specific Unsplash photo IDs by food keyword
// Each ID is a real photo of that specific dish. No API key needed.
const PHOTO_MAP = {
  // breakfast
  'rice bowl egg':              'photo-1569718212165-3a8278d5f624',
  'miso soup tofu':             'photo-1547592180-85f173990554',
  'buttered toast egg':         'photo-1525351484163-7529414344d8',
  'natto rice bowl':            'photo-1569718212165-3a8278d5f624',
  'oatmeal banana bowl':        'photo-1517093157656-b9eccef91cb1',
  'yogurt granola berries bowl':'photo-1488477181946-6428a0291777',
  // snacks
  'tuna mayo onigiri japanese': 'photo-1611143669185-af224c5e3252',
  'edamame salt bowl':          'photo-1515543904379-3d757afe72e4',
  'pan fried gyoza dumplings':  'photo-1563245372-f21724e3856d',
  'cheese crackers plate':      'photo-1578985545062-69928b1d9587',
  'sliced apple peanut butter': 'photo-1568702846914-96b305d2aaeb',
  'mochi kinako powder japanese':'photo-1547592180-85f173990554',
  // lunch
  'shoyu ramen soup noodles':   'photo-1569050467447-ce54b3bbc37d',
  'japanese curry rice bowl':   'photo-1604329760661-e71dc83f8f26',
  'vegetable curry rice':       'photo-1604329760661-e71dc83f8f26',
  'gyudon beef rice bowl':      'photo-1569718212165-3a8278d5f624',
  'cold soba noodles dipping sauce':'photo-1569050467447-ce54b3bbc37d',
  'chinese fried rice wok':     'photo-1603133872878-684f208fb84b',
  'udon noodles egg broth':     'photo-1569050467447-ce54b3bbc37d',
  'tofu vegetable stir fry bowl':'photo-1512621776951-a57141f2eefd',
  'salmon rice bowl japanese':  'photo-1467003909585-2f8a72700288',
  'avocado tuna salad bowl':    'photo-1512621776951-a57141f2eefd',
  // dinner
  'chicken teriyaki rice plate':'photo-1569718212165-3a8278d5f624',
  'pork cabbage stir fry japanese':'photo-1512621776951-a57141f2eefd',
  'miso glazed salmon fillet':  'photo-1467003909585-2f8a72700288',
  'nikujaga japanese meat potato stew':'photo-1547592180-85f173990554',
  'japanese nabe hot pot':      'photo-1547592180-85f173990554',
  'vegetable hot pot tofu':     'photo-1512621776951-a57141f2eefd',
  'tomato egg stir fry chinese':'photo-1567620905732-2d1ec7ab7445',
  'mentaiko pasta japanese cream sauce':'photo-1551183053-bf91a1d81141',
  'mapo tofu spicy sichuan':    'photo-1547592180-85f173990554',
  'mapo tofu mushroom vegetarian':'photo-1547592180-85f173990554',
  'japanese karaage fried chicken':'photo-1562802378-063ec186a863',
  'grilled mackerel fish japanese':'photo-1467003909585-2f8a72700288',
  'oyakodon chicken egg rice bowl':'photo-1569718212165-3a8278d5f624',
  'kimchi fried rice egg korean':'photo-1603133872878-684f208fb84b',
  'yaki udon stir fried noodles':'photo-1569050467447-ce54b3bbc37d',
  'spinach sesame salad japanese':'photo-1512621776951-a57141f2eefd',
  'tofu steak sesame sauce pan': 'photo-1512621776951-a57141f2eefd',
  'tofu egg stir fry protein':   'photo-1512621776951-a57141f2eefd',
};

// Fallback pool — good generic Japanese food photos
const FALLBACK_PHOTOS = [
  'photo-1567620905732-2d1ec7ab7445', // food bowl
  'photo-1512621776951-a57141f2eefd', // healthy food
  'photo-1547592180-85f173990554',    // japanese soup
  'photo-1569718212165-3a8278d5f624', // rice dish
  'photo-1603133872878-684f208fb84b', // fried rice
  'photo-1467003909585-2f8a72700288', // fish dish
  'photo-1569050467447-ce54b3bbc37d', // noodles
  'photo-1551183053-bf91a1d81141',    // pasta
  'photo-1604329760661-e71dc83f8f26', // curry
  'photo-1562802378-063ec186a863',    // chicken
];

const photo = q => {
  const key  = (q || '').toLowerCase().trim();
  const id   = PHOTO_MAP[key] || FALLBACK_PHOTOS[
    key.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % FALLBACK_PHOTOS.length
  ];
  return 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=800&q=80';
};
const season = () => { const m=new Date().getMonth(); return m>=2&&m<=4?'spring':m>=5&&m<=7?'summer':m>=8&&m<=10?'autumn':'winter'; };

/* ─── HOOKS ──────────────────────────────────────────────────── */
function useTimer(){
  const [s,setS]=useState(0);const [r,setR]=useState(false);const [tot,setTot]=useState(0);
  useEffect(()=>{
    if(!r||s<=0){if(s<=0)setR(false);return;}
    const id=setInterval(()=>setS(x=>x-1),1000);return()=>clearInterval(id);
  },[r,s]);
  const start =useCallback(m=>{const x=m*60;setTot(x);setS(x);setR(true);},[]);
  const toggle=useCallback(()=>setR(v=>!v),[]);
  const reset =useCallback(()=>{setS(0);setR(false);setTot(0);},[]);
  const fmt   =x=>Math.floor(x/60)+':'+String(x%60).padStart(2,'0');
  return{seconds:s,running:r,start,toggle,reset,fmt,progress:tot>0?((tot-s)/tot)*100:0};
}
function usePersist(key,init){
  const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}});
  const set=useCallback(x=>{setV(x);try{localStorage.setItem(key,JSON.stringify(x));}catch{}},[key]);
  return[v,set];
}

/* ─── SMALL UI ───────────────────────────────────────────────── */
function Stepper({value,options,onChange,format}){
  const idx=options.indexOf(value);
  const prev=()=>idx>0&&onChange(options[idx-1]);
  const next=()=>idx<options.length-1&&onChange(options[idx+1]);
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
        <button onClick={prev} disabled={idx===0}
          style={{width:38,height:38,borderRadius:'50%',border:`1.5px solid ${idx===0?T.border:T.ink}`,background:'transparent',cursor:idx===0?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',opacity:idx===0?0.3:1,flexShrink:0}}>
          <Minus size={14} color={T.ink}/>
        </button>
        <div style={{flex:1,textAlign:'center',fontSize:26,fontFamily:FD,fontWeight:700,color:T.ink}}>{format(value)}</div>
        <button onClick={next} disabled={idx===options.length-1}
          style={{width:38,height:38,borderRadius:'50%',border:`1.5px solid ${idx===options.length-1?T.border:T.ink}`,background:idx===options.length-1?'transparent':T.ink,cursor:idx===options.length-1?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',opacity:idx===options.length-1?0.3:1,flexShrink:0}}>
          <Plus size={14} color={idx===options.length-1?T.ink:'#fff'}/>
        </button>
      </div>
      <div style={{display:'flex',gap:4,justifyContent:'center'}}>
        {options.map((_,i)=>(
          <button key={i} onClick={()=>onChange(options[i])}
            style={{width:i===idx?20:6,height:6,borderRadius:3,background:i===idx?T.ink:i<idx?T.ink2:T.border,border:'none',cursor:'pointer',padding:0,transition:'all 0.2s'}}/>
        ))}
      </div>
    </div>
  );
}

function Tag({label,active,onClick}){
  return(
    <button onClick={onClick}
      style={{padding:'6px 13px',borderRadius:4,border:`1.5px solid ${active?T.ink:T.border}`,background:active?T.ink:'transparent',color:active?'#fff':T.ink2,fontSize:11,fontWeight:700,cursor:'pointer',transition:'all 0.13s',fontFamily:FB}}>
      {label}
    </button>
  );
}

function SectionTitle({children}){
  return <p style={{margin:'0 0 12px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>{children}</p>;
}

/* ─── PRICE EDITOR ───────────────────────────────────────────── */
function PriceEditor({item,onSave,onClose}){
  const [unit,setUnit]=useState(item.purchaseUnit||'g');
  const [qty, setQty ]=useState(item.purchaseQty||300);
  const [pr,  setPr  ]=useState(item.purchasePrice||item.price);
  const isCnt=unit==='unit'||unit==='pack';
  const cost=isCnt?pr:(pr/((unit==='kg'||unit==='l')?qty*1000:qty))*(item.amount||100);
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:'fixed',inset:0,background:'rgba(26,26,24,0.7)',backdropFilter:'blur(8px)',zIndex:80,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div style={{background:T.surface,width:'100%',maxWidth:600,borderRadius:'18px 18px 0 0',padding:'26px 22px 48px',animation:'slideUp 0.25s ease'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
          <div>
            <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Edit price</p>
            <h3 style={{margin:0,fontSize:19,fontFamily:FD,fontWeight:700,color:T.ink}}>{item.en}</h3>
          </div>
          <button onClick={onClose} style={{background:T.bg,border:'none',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={14} color={T.ink2}/></button>
        </div>
        <SectionTitle>Sold by</SectionTitle>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:20}}>
          {UNITS.map(u=><Tag key={u.id} label={u.id.toUpperCase()} active={unit===u.id} onClick={()=>setUnit(u.id)}/>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:isCnt?'1fr':'1fr 1fr',gap:10,marginBottom:18}}>
          {!isCnt&&(
            <div>
              <p style={{margin:'0 0 6px',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>Quantity</p>
              <input type="number" value={qty} onChange={e=>setQty(Number(e.target.value))} min={1}
                style={{width:'100%',padding:'11px 13px',border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:16,fontFamily:FB,color:T.ink,background:T.surface,outline:'none',boxSizing:'border-box'}}/>
            </div>
          )}
          <div>
            <p style={{margin:'0 0 6px',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>Price (¥)</p>
            <input type="number" value={pr} onChange={e=>setPr(Number(e.target.value))} min={1}
              style={{width:'100%',padding:'11px 13px',border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:16,fontFamily:FB,color:T.ink,background:T.surface,outline:'none',boxSizing:'border-box'}}/>
          </div>
        </div>
        <div style={{background:T.greenBg,border:`1px solid ${T.green}33`,borderRadius:8,padding:'12px 16px',marginBottom:18}}>
          <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.green,fontFamily:FB}}>Cost for this recipe</p>
          <p style={{margin:0,fontSize:22,fontFamily:FD,fontWeight:700,color:T.green}}>{yen(cost)}</p>
        </div>
        <button onClick={()=>onSave({purchaseUnit:unit,purchaseQty:qty,purchasePrice:pr,price:Math.round(cost)})}
          style={{width:'100%',background:T.ink,color:'#fff',border:'none',padding:14,borderRadius:10,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:FB,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          <Check size={15}/> Save
        </button>
      </div>
    </div>
  );
}

/* ─── RECIPE MODAL ───────────────────────────────────────────── */
function RecipeModal({recipe:init,calorieGoal,favorites,onToggleFav,onClose,onAddToCart}){
  const timer=useTimer();
  const [checked,setChecked]=useState({});
  const [recipe,setRecipe]=useState(init);
  const [editing,setEditing]=useState(null);
  const [showOriginal,setShowOriginal]=useState(false);
  const isFav=favorites.includes(init.id);
  const total=recipe.ingredients.reduce((s,i)=>s+(i.price||0),0);
  const circ=2*Math.PI*38; const dash=circ-(timer.progress/100)*circ;
  const diffC=recipe.difficulty==='Easiest'?T.blue:recipe.difficulty==='Easy'?T.green:T.yellow;
  useEffect(()=>{document.body.style.overflow='hidden';return()=>{document.body.style.overflow='';timer.reset();};},[]);
  const saveP=(idx,u)=>{setRecipe(r=>{const ing=[...r.ingredients];ing[idx]={...ing[idx],...u};return{...r,ingredients:ing,budget:ing.reduce((s,i)=>s+(i.price||0),0)};});setEditing(null);};
  const checkedN=Object.values(checked).filter(Boolean).length;
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:'fixed',inset:0,background:'rgba(26,26,24,0.82)',backdropFilter:'blur(12px)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.2s ease'}}>
      <div className="noscroll" style={{background:T.bg,width:'100%',maxWidth:560,height:'100%',maxHeight:'min(96vh,920px)',borderRadius:16,overflowY:'auto',animation:'slideUp 0.28s ease',boxShadow:'0 40px 80px rgba(0,0,0,0.5)'}}>
        <div style={{position:'relative',height:230,flexShrink:0}}>
          <img src={photo(recipe.photo)} alt={recipe.title} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'16px 16px 0 0'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(26,26,24,0.8),transparent 55%)',borderRadius:'16px 16px 0 0'}}/>
          <div style={{position:'absolute',top:14,right:14,display:'flex',gap:8}}>
            <button onClick={()=>onToggleFav(init.id)} style={{background:isFav?T.red:'rgba(26,26,24,0.4)',backdropFilter:'blur(8px)',border:'none',color:'#fff',width:38,height:38,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Heart size={16} fill={isFav?'#fff':'none'}/>
            </button>
            <button onClick={onClose} style={{background:'rgba(26,26,24,0.4)',backdropFilter:'blur(8px)',border:'none',color:'#fff',width:38,height:38,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={16}/></button>
          </div>
          <div style={{position:'absolute',bottom:16,left:18}}>
            <span style={{display:'inline-block',background:diffC,color:'#fff',fontSize:9,fontWeight:700,letterSpacing:'0.14em',padding:'3px 10px',borderRadius:3,textTransform:'uppercase',fontFamily:FB,marginBottom:6}}>{recipe.difficulty}</span>
            <h2 style={{color:'#fff',fontSize:21,fontFamily:FD,fontWeight:700,margin:0,lineHeight:1.2}}>{recipe.title}</h2>
            <p style={{color:'rgba(255,255,255,0.55)',fontSize:11,margin:'3px 0 0',fontFamily:FM}}>{recipe.titleJa}</p>
          </div>
        </div>
        <div style={{padding:'20px 20px 44px'}}>
          {calorieGoal&&recipe.calories&&(
            <div style={{marginBottom:18,paddingBottom:18,borderBottom:`1px solid ${T.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Calories / serving</span>
                <span style={{fontSize:10,fontWeight:700,fontFamily:FM,color:recipe.calories/calorieGoal>0.9?T.red:T.green}}>{recipe.calories} / {calorieGoal} kcal</span>
              </div>
              <div style={{height:4,background:T.border,borderRadius:2,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${Math.min((recipe.calories/calorieGoal)*100,100)}%`,background:recipe.calories/calorieGoal>0.9?T.red:T.green,borderRadius:2}}/>
              </div>
            </div>
          )}
          {/* Diet tags */}
          {recipe.tags&&recipe.tags.length>0&&(
            <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:16}}>
              {recipe.tags.map(tag=>(
                <span key={tag} style={{background:T.greenBg,border:`1px solid ${T.green}33`,borderRadius:3,padding:'2px 8px',fontSize:10,fontWeight:700,color:T.green,fontFamily:FB}}>
                  {{vegetarian:'🥗',vegan:'🌱',pescatarian:'🐟','lactose-free':'🥛','gluten-free':'🌾','high-protein':'💪'}[tag]||'✓'} {tag}
                </span>
              ))}
            </div>
          )}
          <div style={{display:'flex',gap:10,marginBottom:18}}>
            <div style={{flex:1,background:T.surface,borderRadius:10,padding:'14px',border:`1px solid ${T.border}`}}>
              <p style={{margin:'0 0 3px',fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Total cost</p>
              <p style={{margin:0,fontSize:22,fontFamily:FD,fontWeight:700,color:T.green}}>{yen(total)}</p>
              <p style={{margin:'2px 0 0',fontSize:11,color:T.ink3,fontFamily:FB}}>{yen(total/recipe.servings)} per meal</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {[{l:'Time',v:(recipe.prepTime+recipe.cookTime)+'m'},{l:'Protein',v:(recipe.macros?.protein||0)+'g'},{l:'Meals',v:recipe.servings}].map(s=>(
                <div key={s.l} style={{background:T.surface,borderRadius:8,padding:'7px 12px',border:`1px solid ${T.border}`,textAlign:'right',minWidth:70}}>
                  <p style={{margin:0,fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>{s.l}</p>
                  <p style={{margin:0,fontSize:13,fontFamily:FD,fontWeight:700,color:T.ink}}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          {recipe.equipment?.length>0&&(
            <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:18}}>
              {recipe.equipment.map(e=><span key={e} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:4,padding:'3px 10px',fontSize:11,color:T.ink2,fontFamily:FB}}>🍳 {e}</span>)}
            </div>
          )}
          {/* Ingredients */}
          <div style={{marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <SectionTitle>Ingredients</SectionTitle>
              <button onClick={()=>onAddToCart(recipe.ingredients)} style={{display:'flex',alignItems:'center',gap:5,background:T.ink,color:'#fff',border:'none',padding:'5px 12px',borderRadius:4,fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:FB}}>
                <ShoppingCart size={10}/> Add all
              </button>
            </div>
            {checkedN>0&&<div style={{height:3,background:T.border,borderRadius:2,marginBottom:10,overflow:'hidden'}}><div style={{height:'100%',width:`${(checkedN/recipe.ingredients.length)*100}%`,background:T.green,borderRadius:2,transition:'width 0.3s'}}/></div>}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {recipe.ingredients.map((item,i)=>(
                <div key={i} style={{display:'flex',gap:6}}>
                  <button onClick={()=>setChecked(c=>({...c,[i]:!c[i]}))}
                    style={{display:'flex',alignItems:'center',gap:10,flex:1,padding:'10px 13px',borderRadius:8,border:`1px solid ${checked[i]?T.green:T.border}`,background:checked[i]?T.greenBg:T.surface,cursor:'pointer',textAlign:'left',transition:'all 0.13s'}}>
                    <div style={{width:20,height:20,borderRadius:'50%',flexShrink:0,background:checked[i]?T.green:T.border,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.13s'}}>
                      {checked[i]&&<Check size={11} color="#fff"/>}
                    </div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,fontWeight:600,color:checked[i]?T.green:T.ink,margin:0,textDecoration:checked[i]?'line-through':'none',fontFamily:FB}}>{item.en}</p>
                      <p style={{fontSize:10,color:T.ink3,fontFamily:FM,margin:0}}>{item.ja} · {item.amount}{item.unit||'g'}</p>
                    </div>
                    <span style={{fontSize:13,fontWeight:700,color:checked[i]?T.green:T.ink2,fontFamily:FM,flexShrink:0}}>{yen(item.price)}</span>
                  </button>
                  <button onClick={()=>setEditing(i)} style={{width:34,height:'auto',borderRadius:8,background:T.surface,border:`1px solid ${T.border}`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,padding:'0 8px'}}>
                    <Edit3 size={12} color={T.ink3}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Steps */}
          <div style={{marginBottom:22}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <SectionTitle>Instructions</SectionTitle>
              {recipe.stepsOriginal&&recipe.detectedLang&&(
                <button onClick={()=>setShowOriginal(v=>!v)}
                  style={{fontSize:10,fontWeight:700,color:T.ink3,background:'transparent',border:`1px solid ${T.border}`,borderRadius:20,padding:'3px 10px',cursor:'pointer',fontFamily:FB}}>
                  {showOriginal?'Show English':'See original ('+recipe.detectedLang+')'}
                </button>
              )}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              {(showOriginal&&recipe.stepsOriginal?recipe.stepsOriginal:recipe.steps).map((step,i)=>(
                <div key={i} style={{display:'flex',gap:13,alignItems:'flex-start'}}>
                  <span style={{background:T.ink,color:'#fff',width:24,height:24,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,fontFamily:FB}}>{i+1}</span>
                  <p style={{margin:0,fontSize:13,color:T.ink2,lineHeight:1.7,fontFamily:FB}}>{step}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Timer */}
          <div style={{background:T.ink,borderRadius:12,padding:'20px',color:'#fff'}}>
            <p style={{margin:'0 0 14px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',fontFamily:FB}}>Cooking timer</p>
            <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:14}}>
              <div style={{position:'relative',flexShrink:0}}>
                <svg width="86" height="86" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="43" cy="43" r="38" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5"/>
                  <circle cx="43" cy="43" r="38" fill="none" stroke={timer.running?'#4ade80':timer.seconds>0?'#fbbf24':'rgba(255,255,255,0.2)'} strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash} style={{transition:'stroke-dashoffset 1s linear,stroke 0.3s'}}/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,fontFamily:FM,color:timer.seconds===0?'rgba(255,255,255,0.3)':'#fff'}}>
                  {timer.seconds>0?timer.fmt(timer.seconds):'—'}
                </div>
              </div>
              <p style={{margin:0,fontSize:12,color:'rgba(255,255,255,0.4)',fontFamily:FB}}>
                {timer.running?'Running…':timer.seconds>0?'Paused':'Ready when you are'}
              </p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <button onClick={()=>timer.start(recipe.cookTime)} style={{background:'#4ade80',color:T.ink,border:'none',padding:12,borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:FB}}>Start {recipe.cookTime}m</button>
              <button onClick={timer.seconds>0?timer.toggle:undefined} disabled={!timer.seconds} style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.7)',border:'1px solid rgba(255,255,255,0.1)',padding:12,borderRadius:8,fontWeight:700,fontSize:13,cursor:timer.seconds?'pointer':'not-allowed',opacity:timer.seconds?1:0.35,fontFamily:FB}}>
                {timer.running?'Pause':'Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {editing!==null&&<PriceEditor item={recipe.ingredients[editing]} onSave={u=>saveP(editing,u)} onClose={()=>setEditing(null)}/>}
    </div>
  );
}

/* ─── RECIPE CARD ────────────────────────────────────────────── */
function RecipeCard({recipe,onClick,calorieGoal,isFav}){
  const [hov,setHov]=useState(false);
  const calPct=calorieGoal&&recipe.calories?Math.min((recipe.calories/calorieGoal)*100,100):0;
  return(
    <article onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:T.surface,borderRadius:12,overflow:'hidden',border:`1px solid ${T.border}`,cursor:'pointer',boxShadow:hov?'0 10px 36px rgba(26,26,24,0.11)':'0 1px 4px rgba(26,26,24,0.06)',transform:hov?'translateY(-2px)':'none',transition:'all 0.22s ease'}}>
      <div style={{position:'relative',height:185,overflow:'hidden',background:T.border}}>
        <img src={photo(recipe.photo)} alt={recipe.title} style={{width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.04)':'scale(1)',transition:'transform 0.5s ease'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(26,26,24,0.5),transparent 55%)'}}/>
        <div style={{position:'absolute',top:12,left:12,background:'rgba(247,244,239,0.95)',backdropFilter:'blur(6px)',borderRadius:4,padding:'4px 10px',fontFamily:FM,fontSize:11,fontWeight:700,color:T.ink}}>
          {yen(Math.round((recipe.budget||0)/recipe.servings))} / meal
        </div>
        <div style={{position:'absolute',top:12,right:12,display:'flex',gap:5}}>
          {isFav&&<div style={{background:T.red,borderRadius:3,padding:'3px 7px'}}><Heart size={9} color="#fff" fill="#fff"/></div>}
          <div style={{background:'rgba(26,26,24,0.55)',backdropFilter:'blur(5px)',borderRadius:3,padding:'3px 8px',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#fff',fontFamily:FB}}>
            {recipe.difficulty==='Easiest'?'Easy':recipe.difficulty}
          </div>
        </div>
        {recipe.calories&&<div style={{position:'absolute',bottom:10,right:12,fontFamily:FM,fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.75)'}}>🔥 {recipe.calories} kcal</div>}
        {calPct>0&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:'rgba(255,255,255,0.15)'}}><div style={{height:'100%',width:`${calPct}%`,background:calPct>90?T.red:T.green}}/></div>}
      </div>
      <div style={{padding:'13px 15px'}}>
        <h3 style={{margin:'0 0 2px',fontSize:16,fontFamily:FD,fontWeight:700,color:T.ink,lineHeight:1.2}}>{recipe.title}</h3>
        <p style={{margin:'0 0 8px',fontSize:10,color:T.ink3,fontFamily:FM}}>{recipe.titleJa}</p>
        {recipe.tags&&recipe.tags.length>0&&(
          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
            {recipe.tags.slice(0,3).map(tag=>(
              <span key={tag} style={{background:T.greenBg,borderRadius:3,padding:'1px 7px',fontSize:9,fontWeight:700,color:T.green,fontFamily:FB}}>
                {{vegetarian:'🥗',vegan:'🌱',pescatarian:'🐟','gluten-free':'🌾','high-protein':'💪','lactose-free':'🥛'}[tag]||'✓'} {tag}
              </span>
            ))}
          </div>
        )}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:12}}>
            <span style={{fontSize:10,fontWeight:700,color:T.ink3,fontFamily:FB,display:'flex',alignItems:'center',gap:3}}><Timer size={10}/> {recipe.prepTime+recipe.cookTime}m</span>
            <span style={{fontSize:10,fontWeight:700,color:T.ink3,fontFamily:FB,display:'flex',alignItems:'center',gap:3}}><Zap size={10}/> {recipe.macros?.protein||0}g prot</span>
          </div>
          <div style={{width:28,height:28,borderRadius:'50%',background:hov?T.ink:T.bg,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>
            <ChevronRight size={13} color={hov?'#fff':T.ink3}/>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── AI RECIPE FETCHER ─────────────────────────────────────────
   Calls Anthropic API via the artifact proxy.
   Falls back to local database on any error.
──────────────────────────────────────────────────────────────── */
async function generateRecipes({mealType, difficulty, dietaryProfile, allergies=[], calorieGoal, pantryItems=[], count=6}){
  const mealCtx = {
    breakfast: 'Japanese breakfast foods: tamagoyaki, tamago gohan, miso soup rice, oatmeal bowls, toast variations, yogurt, onigiri',
    snack:     'Japanese snacks and light bites: onigiri, edamame, gyoza, rice crackers, mochi, fruit, small sandwiches',
    lunch:     'Japanese lunch dishes: ramen, udon, donburi rice bowls, curry, soba, fried rice, bento-style plates',
    dinner:    'Japanese dinner: stir-fry, hot pot nabe, grilled fish, gyudon, yakitori, pasta Japanese-style, karaage',
  }[mealType] || 'varied Japanese meals';

  const dietMap = {
    vegetarian:  'STRICTLY vegetarian — no meat, no fish. Eggs and dairy OK.',
    vegan:       'STRICTLY vegan — no meat, fish, eggs, dairy, honey, or any animal products.',
    pescatarian: 'Pescatarian — fish and seafood OK, but no chicken, pork, or beef.',
    lactose:     'Lactose-free — no dairy at all: no milk, cheese, butter, cream, yogurt.',
    gluten:      'Gluten-free — no wheat, barley, rye. Use tamari instead of soy sauce.',
    halal:       'Halal — no pork, no alcohol in cooking.',
    nopork:      'No pork — no pork, ham, bacon, lard.',
    nobeef:      'No beef — no beef or veal.',
    highprotein: 'High protein — each serving must have at least 25g protein.',
  };
  const dietNote     = dietaryProfile && dietaryProfile !== 'none' ? (dietMap[dietaryProfile]||'') : '';
  const allergyNote  = allergies.length > 0
    ? 'CRITICAL — completely exclude these allergens and anything derived from them: ' + allergies.join(', ') + '.'
    : '';
  const pantryNote   = pantryItems.length > 0
    ? 'The user already has these at home — prioritize recipes that use them: ' + pantryItems.join(', ') + '.'
    : '';
  const calNote      = calorieGoal
    ? 'Target roughly ' + Math.round(calorieGoal / (mealType==='snack'?4:3)) + ' kcal per serving.'
    : '';

  const prompt = `You are a budget cooking assistant for foreigners living in Japan.
Generate exactly ${count} unique, varied ${mealType} recipes using ingredients available at Life, Gyomu Super, or Aeon supermarkets.
Focus on: ${mealCtx}.
${difficulty !== 'Any' ? 'Difficulty: ' + difficulty + '.' : ''}
${dietNote}
${allergyNote}
${pantryNote}
${calNote}

IMPORTANT: Return ONLY a raw JSON array. No markdown fences, no explanation, no text before or after. Start with [ and end with ].

Schema:
[{
  "id": 1,
  "title": "English recipe name",
  "titleJa": "日本語名",
  "mealType": "${mealType}",
  "difficulty": "Easiest|Easy|Intermediate",
  "prepTime": 5,
  "cookTime": 15,
  "servings": 2,
  "budget": 400,
  "calories": 420,
  "macros": {"protein": 20, "carbs": 45, "fat": 10},
  "equipment": ["Pan"],
  "tags": ["vegan"],
  "photo": "4-6 word visual description of finished dish for image search e.g. japanese curry rice bowl",
  "steps": ["Step 1 detail.", "Step 2 detail.", "Step 3 detail.", "Step 4 detail."],
  "ingredients": [
    {"en": "Ingredient name", "ja": "日本語", "price": 200, "amount": 150, "unit": "g"}
  ]
}]`;

  // Call our serverless proxy — API key stays on the server
  const API_URL = import.meta.env.VITE_API_URL || '/api/generate';
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error('API ' + res.status);
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);

  const raw = d.content.map(b => b.text || '').join('').trim();
  // Strip any accidental markdown fences
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  const arrStart = clean.indexOf('[');
  const arrEnd   = clean.lastIndexOf(']');
  if (arrStart === -1 || arrEnd === -1) throw new Error('No JSON array in response');
  return JSON.parse(clean.slice(arrStart, arrEnd + 1));
}

/* ─── LOCAL FALLBACK FILTER ─────────────────────────────────────
   Used while AI is loading, or if the API fails.
──────────────────────────────────────────────────────────────── */
function getLocalRecipes(mealType, difficulty, dietaryProfile, allergies, pantryItems, seed) {
  let pool = ALL_RECIPES.filter(r => {
    if (r.mealType !== mealType) return false;
    if (difficulty !== 'Any' && r.difficulty !== difficulty) return false;
    if (!recipeMatchesDiet(r, dietaryProfile, allergies || [])) return false;
    return true;
  });
  if (pantryItems.length > 0) {
    pool.sort((a, b) => {
      const aM = a.ingredients.filter(i => pantryItems.some(p => i.en.toLowerCase().includes(p.toLowerCase()))).length;
      const bM = b.ingredients.filter(i => pantryItems.some(p => i.en.toLowerCase().includes(p.toLowerCase()))).length;
      return bM - aM;
    });
  } else {
    pool = [...pool].sort(() => Math.sin(seed * 9301 + 49297) - 0.5);
  }
  return pool;
}

/* ─── DISCOVER VIEW ──────────────────────────────────────────── */
function DiscoverView({settings, favorites, onSelectRecipe, pantryItems, initialMealType, onMealTypeUsed}){
  const [mealType,   setMealType  ] = useState(initialMealType||'lunch');
  const [showFilter, setShowFilter] = useState(false);
  const [filters,    setFilters   ] = useState({difficulty:'Any'});
  const [aiRecipes,  setAiRecipes ] = useState(null);   // null = not yet loaded
  const [loading,    setLoading   ] = useState(false);
  const [error,      setError     ] = useState(null);
  const [seed,       setSeed      ] = useState(0);

  // When coming from Pantry with a chosen meal type, trigger generation immediately
  useEffect(()=>{
    if(initialMealType && initialMealType!==mealType){
      setMealType(initialMealType);
      loadAI(initialMealType, filters, pantryItems);
    } else if(initialMealType){
      loadAI(initialMealType, filters, pantryItems);
    }
    if(onMealTypeUsed) onMealTypeUsed();
  // eslint-disable-next-line
  },[initialMealType]);

  const activeMT = MEAL_TYPES.find(m => m.id === mealType);
  const dp = settings.dietaryProfile && settings.dietaryProfile !== 'none'
    ? DIETARY_PROFILES.find(p => p.id === settings.dietaryProfile) : null;

  // Local fallback — always available instantly
  const localRecipes = useMemo(() =>
    getLocalRecipes(mealType, filters.difficulty, settings.dietaryProfile, settings.allergies, pantryItems, seed),
    [mealType, filters.difficulty, settings.dietaryProfile, settings.allergies, pantryItems, seed]
  );

  // Displayed recipes: AI results if available, otherwise local
  const recipes = aiRecipes !== null ? aiRecipes : localRecipes;

  const loadAI = useCallback(async (mt, f, pi) => {
    setLoading(true); setError(null); setAiRecipes(null);
    try {
      const data = await generateRecipes({
        mealType:       mt,
        difficulty:     f.difficulty,
        dietaryProfile: settings.dietaryProfile,
        allergies:      settings.allergies || [],
        calorieGoal:    settings.calorieGoal,
        pantryItems:    pi || [],
        count:          6,
      });
      setAiRecipes(data);
    } catch(e) {
      setError(e.message || 'Could not generate recipes');
      setAiRecipes(null); // fall back to local
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Load AI recipes on mount and when meal type changes
  useEffect(() => {
    loadAI(mealType, filters, pantryItems);
  }, [mealType]);

  const handleRefresh = () => {
    setAiRecipes(null);
    setSeed(s => s + 1);
    loadAI(mealType, filters, pantryItems);
  };

  return(
    <div>
      {/* Meal type strip */}
      <div style={{display:'flex',gap:6,marginBottom:18,overflowX:'auto',paddingBottom:2}}>
        {MEAL_TYPES.map(mt=>{
          const I=mt.icon; const act=mt.id===mealType;
          return(
            <button key={mt.id} onClick={()=>{ setMealType(mt.id); setAiRecipes(null); loadAI(mt.id, filters, pantryItems); }}
              style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:6,border:`1.5px solid ${act?mt.dot:T.border}`,background:act?T.ink:'transparent',cursor:'pointer',transition:'all 0.16s',flexShrink:0}}>
              <I size={13} color={act?'#fff':T.ink3}/>
              <span style={{fontSize:11,fontWeight:700,color:act?'#fff':T.ink2,fontFamily:FB}}>{mt.label}</span>
              <span style={{fontSize:10,fontFamily:FM,color:act?'rgba(255,255,255,0.45)':T.ink3}}>{mt.ja}</span>
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginBottom:18}}>
        {pantryItems.length>0&&<p style={{margin:'0 0 3px',fontSize:10,fontWeight:700,letterSpacing:'0.13em',textTransform:'uppercase',color:T.green,fontFamily:FB}}>Using your {pantryItems.length} pantry ingredients</p>}
        {dp&&<p style={{margin:'0 0 3px',fontSize:10,fontWeight:700,letterSpacing:'0.13em',textTransform:'uppercase',color:T.yellow,fontFamily:FB}}>{dp.emoji} {dp.label} diet active</p>}
        <h2 style={{margin:'0 0 3px',fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>{activeMT.label} recipes</h2>
        <p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>
          {loading
            ? 'Generating fresh recipes…'
            : aiRecipes
            ? aiRecipes.length + ' fresh recipes · ' + yen(settings.weeklyBudget/7) + '/day budget'
            : localRecipes.length + ' recipes · tap Refresh for new ideas'
          }
        </p>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:8,marginBottom:18,alignItems:'center'}}>
        <button onClick={handleRefresh} disabled={loading}
          style={{display:'flex',alignItems:'center',gap:6,background:loading?T.border:'transparent',border:`1.5px solid ${loading?T.border:T.border}`,borderRadius:6,padding:'8px 14px',fontSize:11,fontWeight:700,cursor:loading?'default':'pointer',color:T.ink2,fontFamily:FB,opacity:loading?0.6:1}}>
          <RefreshCw size={12} style={{animation:loading?'spin 1s linear infinite':'none'}}/>
          {loading?'Generating…':'New recipes'}
        </button>
        <button onClick={()=>setShowFilter(true)}
          style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:`1.5px solid ${T.border}`,borderRadius:6,padding:'8px 14px',fontSize:11,fontWeight:700,cursor:'pointer',color:T.ink2,fontFamily:FB}}>
          <SlidersHorizontal size={12}/> Filters
        </button>
        {aiRecipes&&(
          <span style={{fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:T.green,fontFamily:FB,marginLeft:'auto'}}>
            ✦ Generated
          </span>
        )}
        {!aiRecipes&&!loading&&(
          <span style={{fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:T.ink3,fontFamily:FB,marginLeft:'auto'}}>
            From library
          </span>
        )}
      </div>

      {/* Error banner — non-blocking, local recipes still show */}
      {error&&!loading&&(
        <div style={{background:T.yellowBg,border:`1px solid ${T.yellow}44`,borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:11,color:T.yellow,fontFamily:FB,display:'flex',gap:8,alignItems:'center'}}>
          <AlertCircle size={13}/>
          <span>Couldn't generate — showing library recipes. <button onClick={handleRefresh} style={{background:'none',border:'none',cursor:'pointer',color:T.yellow,fontWeight:700,fontSize:11,fontFamily:FB,padding:0,textDecoration:'underline'}}>Try again</button></span>
        </div>
      )}

      {/* Skeletons while loading */}
      {loading&&(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {[1,2,3,4].map(i=>(
            <div key={i} style={{background:T.surface,borderRadius:12,overflow:'hidden',border:`1px solid ${T.border}`}}>
              <div style={{height:185,background:`linear-gradient(90deg,${T.border} 25%,${T.bg} 50%,${T.border} 75%)`,backgroundSize:'400% 100%',animation:'shimmer 1.4s infinite'}}/>
              <div style={{padding:'13px 15px'}}>
                <div style={{height:15,width:'55%',borderRadius:4,background:T.border,marginBottom:8,animation:'shimmer 1.4s infinite'}}/>
                <div style={{height:10,width:'33%',borderRadius:4,background:T.border,animation:'shimmer 1.4s infinite'}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe cards */}
      {!loading&&(
        <>
          {recipes.length===0?(
            <div style={{background:T.surface,borderRadius:10,padding:'40px 20px',textAlign:'center',border:`1px solid ${T.border}`}}>
              <p style={{margin:'0 0 6px',fontSize:15,fontFamily:FD,fontWeight:700,color:T.ink2}}>No recipes match your filters</p>
              <p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>Try changing your dietary profile or filters</p>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {recipes.map((r,i)=>(
                <RecipeCard key={r.id||i} recipe={r} calorieGoal={settings.calorieGoal}
                  isFav={favorites.includes(r.id)} onClick={()=>onSelectRecipe(r)}/>
              ))}
            </div>
          )}
        </>
      )}

      {/* Filter sheet */}
      {showFilter&&(
        <div onClick={e=>e.target===e.currentTarget&&setShowFilter(false)}
          style={{position:'fixed',inset:0,background:'rgba(26,26,24,0.6)',backdropFilter:'blur(8px)',zIndex:60,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
          <div style={{background:T.surface,width:'100%',maxWidth:600,borderRadius:'16px 16px 0 0',padding:'24px 20px 42px',animation:'slideUp 0.22s ease'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{margin:0,fontSize:18,fontFamily:FD,fontWeight:700,color:T.ink}}>Filter</h3>
              <button onClick={()=>setShowFilter(false)} style={{background:T.bg,border:'none',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={14} color={T.ink2}/></button>
            </div>
            <SectionTitle>Difficulty</SectionTitle>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:20}}>
              {DIFFICULTY_OPTS.map(o=><Tag key={o} label={o} active={filters.difficulty===o} onClick={()=>setFilters(f=>({...f,difficulty:o}))}/>)}
            </div>
            <button onClick={()=>{ loadAI(mealType, filters, pantryItems); setShowFilter(false); }}
              style={{width:'100%',background:T.ink,color:'#fff',border:'none',padding:13,borderRadius:8,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:FB}}>
              Apply & Generate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PANTRY VIEW ────────────────────────────────────────────── */
function PantryView({pantryItems,onChange,onGenerateWithPantry}){
  const [q,setQ]=useState('');
  const [custom,setCust]=useState('');
  const [showMealPicker,setShowMealPicker]=useState(false);
  const filtered=COMMON_INGREDIENTS.filter(i=>i.toLowerCase().includes(q.toLowerCase())&&!pantryItems.includes(i));
  const toggle=item=>onChange(pantryItems.includes(item)?pantryItems.filter(x=>x!==item):[...pantryItems,item]);
  const addC=()=>{const t=custom.trim();if(t&&!pantryItems.includes(t)){onChange([...pantryItems,t]);setCust('');}};

  return(
    <div>
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginBottom:18}}>
        <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Your kitchen</p>
        <h2 style={{margin:'0 0 3px',fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>My Pantry</h2>
        <p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>Add what you have, then generate recipes using those ingredients.</p>
      </div>

      {pantryItems.length>0&&(
        <div style={{background:T.surface,borderRadius:10,padding:'14px 16px',marginBottom:14,border:`1px solid ${T.border}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <SectionTitle>{pantryItems.length} on hand</SectionTitle>
            <button onClick={()=>onChange([])} style={{fontSize:10,color:T.red,background:'none',border:'none',cursor:'pointer',fontWeight:700,fontFamily:FB}}>Clear all</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:14}}>
            {pantryItems.map(item=>(
              <button key={item} onClick={()=>toggle(item)}
                style={{display:'flex',alignItems:'center',gap:5,background:T.greenBg,border:`1px solid ${T.green}33`,borderRadius:4,padding:'5px 11px',fontSize:12,fontWeight:600,color:T.green,cursor:'pointer',fontFamily:FB}}>
                {item} <X size={10} color={T.green}/>
              </button>
            ))}
          </div>

          {/* Generate button */}
          {!showMealPicker?(
            <button onClick={()=>setShowMealPicker(true)}
              style={{width:'100%',background:T.ink,color:'#fff',border:'none',borderRadius:8,padding:'13px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:FB,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              <ChefHat size={16}/> Generate recipes with these {pantryItems.length} ingredients
            </button>
          ):(
            <div style={{animation:'slideUp 0.2s ease'}}>
              <p style={{margin:'0 0 10px',fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>What meal?</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                {MEAL_TYPES.map(mt=>{
                  const Icon=mt.icon;
                  return(
                    <button key={mt.id} onClick={()=>{setShowMealPicker(false);onGenerateWithPantry(mt.id);}}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderRadius:8,border:`1.5px solid ${mt.dot}`,background:T.surface,cursor:'pointer',transition:'all 0.15s'}}>
                      <Icon size={18} color={mt.dot}/>
                      <div style={{textAlign:'left'}}>
                        <p style={{margin:0,fontSize:13,fontWeight:700,color:T.ink,fontFamily:FB}}>{mt.label}</p>
                        <p style={{margin:0,fontSize:10,color:T.ink3,fontFamily:FM}}>{mt.ja}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>setShowMealPicker(false)}
                style={{width:'100%',background:'transparent',border:`1px solid ${T.border}`,borderRadius:8,padding:'9px',fontSize:12,color:T.ink3,cursor:'pointer',fontFamily:FB}}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      <div style={{display:'flex',gap:7,marginBottom:14}}>
        <input value={custom} onChange={e=>setCust(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addC()} placeholder="Add custom ingredient…"
          style={{flex:1,padding:'10px 13px',border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FB,color:T.ink,background:T.surface,outline:'none'}}/>
        <button onClick={addC} style={{background:T.ink,color:'#fff',border:'none',width:40,borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Plus size={15}/></button>
      </div>
      <div style={{position:'relative',marginBottom:13}}>
        <Search size={13} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:T.ink3,pointerEvents:'none'}}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"
          style={{width:'100%',padding:'10px 14px 10px 33px',border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FB,color:T.ink,background:T.surface,outline:'none',boxSizing:'border-box'}}/>
      </div>
      <div style={{background:T.surface,borderRadius:10,padding:'14px 15px',border:`1px solid ${T.border}`,marginBottom:14}}>
        <SectionTitle>Common ingredients</SectionTitle>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {filtered.slice(0,36).map(item=>(
            <button key={item} onClick={()=>toggle(item)}
              style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:4,padding:'5px 11px',fontSize:12,fontWeight:600,color:T.ink2,cursor:'pointer',fontFamily:FB}}>+ {item}</button>
          ))}
        </div>
      </div>
      <SectionTitle>Recommended staples</SectionTitle>
      <div style={{display:'flex',flexDirection:'column',gap:7,marginTop:4}}>
        {PANTRY_STAPLES.map((item,i)=>{
          const has=pantryItems.includes(item.en);
          return(
            <div key={i} onClick={()=>toggle(item.en)}
              style={{background:has?T.greenBg:T.surface,borderRadius:10,padding:'11px 14px',border:`1px solid ${has?T.green+'44':T.border}`,cursor:'pointer',display:'flex',gap:11,alignItems:'center',transition:'all 0.14s'}}>
              <div style={{width:36,height:36,borderRadius:8,background:has?`${T.green}20`:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{item.icon}</div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontSize:13,fontWeight:700,color:T.ink,fontFamily:FB}}>{item.en} <span style={{fontFamily:FM,fontWeight:400,color:T.ink3,fontSize:10}}>{item.ja}</span></p>
                <p style={{margin:'1px 0 0',fontSize:11,color:T.ink3,fontFamily:FB,fontStyle:'italic'}}>{item.tip}</p>
              </div>
              <div style={{width:22,height:22,borderRadius:'50%',background:has?T.green:T.border,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.14s'}}>
                {has?<Check size={12} color="#fff"/>:<Plus size={12} color={T.ink3}/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SHOPPING LIST ──────────────────────────────────────────── */
function ShoppingView({cart,onUpdateCart}){
  const [checked,setChecked]=useState({});
  const total=cart.reduce((s,i)=>s+(i.price||0),0);
  const doneTotal=cart.filter((_,i)=>checked[i]).reduce((s,i)=>s+(i.price||0),0);
  return(
    <div>
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginBottom:18}}>
        <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Shopping</p>
        <h2 style={{margin:'0 0 3px',fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>My List</h2>
        {cart.length>0&&<p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>{cart.length} items · {yen(total)}</p>}
      </div>
      {cart.length>0&&(
        <>
          <div style={{background:T.surface,borderRadius:10,padding:'14px 18px',marginBottom:12,border:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between'}}>
            <div><p style={{margin:'0 0 2px',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>In basket</p><p style={{margin:0,fontSize:22,fontFamily:FD,fontWeight:700,color:T.green}}>{yen(doneTotal)}</p></div>
            <div style={{textAlign:'right'}}><p style={{margin:'0 0 2px',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>Left</p><p style={{margin:0,fontSize:22,fontFamily:FD,fontWeight:700,color:T.ink}}>{yen(total-doneTotal)}</p></div>
          </div>
          <div style={{height:3,background:T.border,borderRadius:2,marginBottom:16,overflow:'hidden'}}><div style={{height:'100%',width:`${(doneTotal/total)*100}%`,background:T.green,borderRadius:2,transition:'width 0.3s'}}/></div>
        </>
      )}
      {cart.length===0?(
        <div style={{background:T.surface,borderRadius:10,padding:'46px 20px',textAlign:'center',border:`1px solid ${T.border}`}}>
          <ShoppingCart size={34} color={T.border} style={{margin:'0 auto 12px'}}/>
          <p style={{margin:'0 0 5px',fontSize:14,fontFamily:FD,fontWeight:700,color:T.ink2}}>Empty list</p>
          <p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>Open a recipe and tap "Add all"</p>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {cart.map((item,i)=>(
            <div key={i} style={{display:'flex',gap:9,alignItems:'center',background:T.surface,borderRadius:8,padding:'10px 13px',border:`1px solid ${checked[i]?T.green+'33':T.border}`,opacity:checked[i]?0.55:1,transition:'all 0.14s'}}>
              <button onClick={()=>setChecked(c=>({...c,[i]:!c[i]}))} style={{width:22,height:22,borderRadius:'50%',flexShrink:0,background:checked[i]?T.green:T.border,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.14s'}}>
                {checked[i]&&<Check size={12} color="#fff"/>}
              </button>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:600,color:T.ink,margin:0,textDecoration:checked[i]?'line-through':'none',fontFamily:FB}}>{item.en}</p>
                <p style={{fontSize:10,color:T.ink3,fontFamily:FM,margin:0}}>{item.ja} · {item.amount}{item.unit||'g'}</p>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:T.ink2,fontFamily:FM}}>{yen(item.price)}</span>
              <button onClick={()=>onUpdateCart(cart.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',padding:3,flexShrink:0}}><Trash2 size={13} color={T.ink3}/></button>
            </div>
          ))}
          {Object.values(checked).some(Boolean)&&(
            <button onClick={()=>{onUpdateCart(cart.filter((_,i)=>!checked[i]));setChecked({});}} style={{background:'transparent',border:`1.5px solid ${T.border}`,borderRadius:8,padding:11,fontWeight:700,fontSize:13,cursor:'pointer',color:T.red,fontFamily:FB,marginTop:4}}>Remove checked items</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── SAVED VIEW ─────────────────────────────────────────────── */
function SavedView({savedRecipes,favorites,onSelectRecipe,onToggleFav}){
  const favs=savedRecipes.filter(r=>favorites.includes(r.id));
  return(
    <div>
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginBottom:18}}>
        <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Saved</p>
        <h2 style={{margin:'0 0 3px',fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>My Recipes</h2>
        <p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>{favs.length} recipe{favs.length!==1?'s':''} saved</p>
      </div>
      {favs.length===0?(
        <div style={{background:T.surface,borderRadius:10,padding:'46px 20px',textAlign:'center',border:`1px solid ${T.border}`}}>
          <Heart size={34} color={T.border} style={{margin:'0 auto 12px'}}/>
          <p style={{margin:'0 0 5px',fontSize:14,fontFamily:FD,fontWeight:700,color:T.ink2}}>Nothing saved yet</p>
          <p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>Tap ♥ on any recipe to save it here</p>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {favs.map(r=><RecipeCard key={r.id} recipe={r} isFav onClick={()=>onSelectRecipe(r)}/>)}
        </div>
      )}
    </div>
  );
}

/* ─── TIPS VIEW ──────────────────────────────────────────────── */
function TipsView(){
  const s=season();const [open,setOpen]=useState(null);
  return(
    <div>
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginBottom:18}}>
        <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Japan living</p>
        <h2 style={{margin:0,fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>Supermarket Guide</h2>
      </div>
      <div style={{background:T.ink,borderRadius:10,padding:'18px',marginBottom:18,color:'#fff'}}>
        <p style={{margin:'0 0 3px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',fontFamily:FB}}>In season now · {s}</p>
        <p style={{margin:'0 0 12px',fontSize:15,fontFamily:FD,fontWeight:700}}>Best value produce this {s}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {SEASONAL[s].map(p=><span key={p} style={{background:'rgba(255,255,255,0.1)',borderRadius:4,padding:'3px 10px',fontSize:11,fontFamily:FB,color:'rgba(255,255,255,0.8)'}}>{p}</span>)}
        </div>
      </div>
      <SectionTitle>Where to shop</SectionTitle>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:22,marginTop:4}}>
        {SUPERMARKET_TIPS.map((t,i)=>(
          <div key={i} onClick={()=>setOpen(open===i?null:i)} style={{background:T.surface,borderRadius:10,padding:'13px 15px',border:`1px solid ${T.border}`,cursor:'pointer'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:8,height:8,borderRadius:'50%',background:t.color,flexShrink:0}}/><span style={{fontSize:14,fontWeight:700,color:T.ink,fontFamily:FB}}>{t.store}</span></div>
              <ChevronDown size={13} color={T.ink3} style={{transform:open===i?'rotate(180deg)':'none',transition:'transform 0.2s'}}/>
            </div>
            {open===i&&<p style={{margin:'10px 0 0 17px',fontSize:13,color:T.ink2,lineHeight:1.65,fontFamily:FB}}>{t.tip}</p>}
          </div>
        ))}
      </div>
      <SectionTitle>6 rules to spend less</SectionTitle>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:4}}>
        {[
          {n:'01',r:'Cook double',d:'Every recipe makes tomorrow\'s lunch at near-zero extra cost.'},
          {n:'02',r:'Shop after 19:00',d:'Yellow discount stickers on meat, fish and bento. Up to 50% off.'},
          {n:'03',r:'Buy whole, not cut',d:'A whole cabbage costs less per gram than a half.'},
          {n:'04',r:'Frozen over fresh (off-season)',d:'Identical nutrients, 40–60% cheaper. Gyomu Super bulk bags.'},
          {n:'05',r:'Pork is cheapest meat',d:'Pork koma-gire (こま切れ) — most protein per yen.'},
          {n:'06',r:'Always have eggs',d:'10 eggs for ¥200. Cheapest complete protein available.'},
        ].map(r=>(
          <div key={r.n} style={{background:T.surface,borderRadius:10,padding:'13px 15px',border:`1px solid ${T.border}`,display:'flex',gap:13,alignItems:'flex-start'}}>
            <span style={{fontSize:10,fontWeight:700,fontFamily:FM,color:T.ink3,flexShrink:0,paddingTop:2}}>{r.n}</span>
            <div><p style={{margin:'0 0 2px',fontSize:14,fontWeight:700,color:T.ink,fontFamily:FB}}>{r.r}</p><p style={{margin:0,fontSize:12,color:T.ink3,lineHeight:1.6,fontFamily:FB}}>{r.d}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── GOALS VIEW ─────────────────────────────────────────────── */
function GoalsView({settings,onChange}){
  const [allergyInput,setAI]=useState('');
  const toggleAllergy=a=>{const cur=settings.allergies||[];onChange({...settings,allergies:cur.includes(a)?cur.filter(x=>x!==a):[...cur,a]});};
  const addCustomAllergy=()=>{const t=allergyInput.trim();if(!t)return;const cur=settings.allergies||[];if(!cur.includes(t))onChange({...settings,allergies:[...cur,t]});setAI('');};
  return(
    <div>
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginBottom:22}}>
        <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Preferences</p>
        <h2 style={{margin:0,fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>My Goals</h2>
      </div>

      {/* Dietary profile */}
      <div style={{background:T.surface,borderRadius:10,padding:'18px',border:`1px solid ${T.border}`,marginBottom:12}}>
        <p style={{margin:'0 0 3px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Dietary profile</p>
        <p style={{margin:'0 0 14px',fontSize:12,color:T.ink3,fontFamily:FB}}>Filters all recipes automatically</p>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {DIETARY_PROFILES.map(p=>{
            const active=(settings.dietaryProfile||'none')===p.id;
            return(
              <button key={p.id} onClick={()=>onChange({...settings,dietaryProfile:p.id})}
                style={{display:'flex',alignItems:'center',gap:11,padding:'11px 13px',borderRadius:8,border:`1.5px solid ${active?T.ink:T.border}`,background:active?T.ink:'transparent',cursor:'pointer',textAlign:'left',transition:'all 0.14s'}}>
                <span style={{fontSize:18,flexShrink:0}}>{p.emoji}</span>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:13,fontWeight:700,color:active?'#fff':T.ink,fontFamily:FB}}>{p.label}</p>
                  <p style={{margin:0,fontSize:11,color:active?'rgba(255,255,255,0.5)':T.ink3,fontFamily:FB}}>{p.desc}</p>
                </div>
                {active&&<Check size={15} color="#fff"/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergies */}
      <div style={{background:T.surface,borderRadius:10,padding:'18px',border:`1px solid ${T.border}`,marginBottom:12}}>
        <p style={{margin:'0 0 3px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Allergies & intolerances</p>
        <p style={{margin:'0 0 14px',fontSize:12,color:T.ink3,fontFamily:FB}}>These are excluded from all recipes</p>
        {(settings.allergies||[]).length>0&&(
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12}}>
            {(settings.allergies||[]).map(a=>(
              <button key={a} onClick={()=>toggleAllergy(a)} style={{display:'flex',alignItems:'center',gap:4,background:T.redBg,border:`1px solid ${T.red}44`,borderRadius:4,padding:'4px 10px',fontSize:12,fontWeight:700,color:T.red,cursor:'pointer',fontFamily:FB}}>
                {a} <X size={10} color={T.red}/>
              </button>
            ))}
          </div>
        )}
        <SectionTitle>Common allergens</SectionTitle>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:13}}>
          {COMMON_ALLERGENS.map(a=>{
            const active=(settings.allergies||[]).includes(a);
            return<button key={a} onClick={()=>toggleAllergy(a)} style={{padding:'5px 11px',borderRadius:4,border:`1.5px solid ${active?T.red:T.border}`,background:active?T.redBg:'transparent',color:active?T.red:T.ink2,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:FB,transition:'all 0.12s'}}>{active?'✕ ':''}{a}</button>;
          })}
        </div>
        <SectionTitle>Add custom</SectionTitle>
        <div style={{display:'flex',gap:7}}>
          <input value={allergyInput} onChange={e=>setAI(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustomAllergy()} placeholder="e.g. Matsutake mushrooms…"
            style={{flex:1,padding:'10px 13px',border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FB,color:T.ink,background:T.surface,outline:'none'}}/>
          <button onClick={addCustomAllergy} style={{background:T.ink,color:'#fff',border:'none',width:40,borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Plus size={14}/></button>
        </div>
      </div>

      {/* Budget & calories */}
      <div style={{background:T.surface,borderRadius:10,padding:'20px 18px',border:`1px solid ${T.border}`,marginBottom:12}}>
        <p style={{margin:'0 0 3px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Weekly grocery budget</p>
        <p style={{margin:'0 0 16px',fontSize:12,color:T.ink3,fontFamily:FB}}>Shown in recipe cost comparisons</p>
        <Stepper value={settings.weeklyBudget} options={BUDGET_STEPS} onChange={v=>onChange({...settings,weeklyBudget:v})} format={v=>yen(v)}/>
        <p style={{margin:'12px 0 0',textAlign:'center',fontSize:12,color:T.ink3,fontFamily:FB}}>
          {settings.weeklyBudget<5000?'Very tight — rice, eggs, miso.':settings.weeklyBudget<8000?'Budget — meat most days, fresh veg.':settings.weeklyBudget<15000?'Comfortable — full variety.':'Relaxed — quality over savings.'}
        </p>
      </div>
      <div style={{background:T.surface,borderRadius:10,padding:'20px 18px',border:`1px solid ${T.border}`,marginBottom:12}}>
        <p style={{margin:'0 0 3px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Daily calorie goal</p>
        <p style={{margin:'0 0 16px',fontSize:12,color:T.ink3,fontFamily:FB}}>Shows calorie progress bars on recipes</p>
        <Stepper value={settings.calorieGoal} options={CALORIE_STEPS} onChange={v=>onChange({...settings,calorieGoal:v})} format={v=>v+' kcal'}/>
      </div>
      <div style={{background:T.ink,borderRadius:10,padding:'18px',color:'#fff',marginBottom:16}}>
        <p style={{margin:'0 0 12px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',fontFamily:FB}}>Breakdown</p>
        {[{l:'Daily budget',v:yen(settings.weeklyBudget/7)},{l:'Per meal (3/day)',v:yen(settings.weeklyBudget/7/3)},{l:'Calories / meal',v:'~'+Math.round(settings.calorieGoal/3)+' kcal'},{l:'Monthly estimate',v:yen(settings.weeklyBudget*4.3)}].map(r=>(
          <div key={r.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.45)',fontFamily:FB}}>{r.l}</span>
            <span style={{fontSize:14,fontWeight:700,fontFamily:FD,color:'#fff'}}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── DONATE VIEW ────────────────────────────────────────────── */
function DonateView(){
  const [copied,setCopied]=useState(false);
  const copy=()=>{navigator.clipboard.writeText('https://kaimonocook.app').then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2200);}).catch(()=>{});};
  return(
    <div>
      <div style={{background:T.ink,borderRadius:12,padding:'28px 22px',marginBottom:16,color:'#fff',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-16,right:-16,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.03)'}}/>
        <p style={{margin:'0 0 6px',fontSize:10,fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',fontFamily:FB}}>A note from the maker</p>
        <h2 style={{margin:'0 0 14px',fontSize:22,fontFamily:FD,fontWeight:700,lineHeight:1.2}}>This app is completely free.</h2>
        <p style={{margin:0,fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.75,fontFamily:FB}}>
          I built 買い物 Cook because moving to Japan is hard enough without also figuring out how to eat well on a budget in a language you don't read yet. No ads, no subscription, no data collection.
        </p>
      </div>
      <div style={{background:T.surface,borderRadius:10,padding:'18px',border:`1px solid ${T.border}`,marginBottom:12}}>
        <p style={{margin:'0 0 14px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>What went into this</p>
        {[
          {i:'🛒',t:'Weeks in Life, Gyomu Super, and Aeon — checking prices, learning what foreigners actually struggle to find.'},
          {i:'🍜',t:'Testing every recipe in a real Japanese apartment kitchen with one small counter and limited equipment.'},
          {i:'📊',t:'Building the price calculator so estimates actually match what you pay at the register.'},
          {i:'🌐',t:'Translating ingredient names so you can find things on the shelf without speaking Japanese.'},
          {i:'☕',t:'A lot of convenience store coffee at 2AM.'},
        ].map((item,idx)=>(
          <div key={idx} style={{display:'flex',gap:11,alignItems:'flex-start',marginBottom:idx===4?0:12}}>
            <span style={{fontSize:17,flexShrink:0,marginTop:1}}>{item.i}</span>
            <p style={{margin:0,fontSize:13,color:T.ink2,lineHeight:1.65,fontFamily:FB}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{background:'#FFFBF0',borderRadius:10,padding:'18px 18px',border:`1px solid ${T.yellow}33`,marginBottom:12}}>
        <p style={{margin:'0 0 4px',fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.yellow,fontFamily:FB}}>Keep it running</p>
        <h3 style={{margin:'0 0 10px',fontSize:17,fontFamily:FD,fontWeight:700,color:T.ink}}>Support the project</h3>
        <p style={{margin:'0 0 18px',fontSize:13,color:T.ink2,lineHeight:1.7,fontFamily:FB}}>
          If this saves you money or stress, a small contribution helps cover costs and keeps me motivated to add features — more recipes, store price updates, and eventually a proper mobile app. Even the price of one onigiri (¥120) helps.
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,background:'#FF5E5B',color:'#fff',borderRadius:8,padding:13,fontWeight:700,fontSize:14,textDecoration:'none',fontFamily:FB}}>
            ☕ Buy me a coffee on Ko-fi
          </a>
          <a href="https://paypal.me" target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,background:T.surface,color:T.ink,border:`1.5px solid ${T.border}`,borderRadius:8,padding:13,fontWeight:700,fontSize:14,textDecoration:'none',fontFamily:FB}}>
            PayPal donation
          </a>
        </div>
      </div>
      <div style={{background:T.surface,borderRadius:10,padding:'18px',border:`1px solid ${T.border}`,marginBottom:14}}>
        <h3 style={{margin:'0 0 8px',fontSize:15,fontFamily:FD,fontWeight:700,color:T.ink}}>Can't donate? Share it instead.</h3>
        <p style={{margin:'0 0 14px',fontSize:13,color:T.ink2,lineHeight:1.65,fontFamily:FB}}>Tell a friend who just moved to Japan, or share in your expat group chat. Word of mouth is how this grows.</p>
        <button onClick={copy} style={{width:'100%',background:copied?T.greenBg:T.bg,border:`1.5px solid ${copied?T.green:T.border}`,borderRadius:8,padding:12,fontWeight:700,fontSize:13,cursor:'pointer',color:copied?T.green:T.ink2,fontFamily:FB,transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          {copied?<><Check size={13}/> Copied!</>:<>📋 Copy link to share</>}
        </button>
      </div>
      <p style={{fontSize:11,color:T.ink3,textAlign:'center',lineHeight:1.6,fontFamily:FB,padding:'0 8px 16px'}}>
        Prices are based on typical Tokyo supermarket prices early 2025. Edit any ingredient price to match what you actually pay.
      </p>
    </div>
  );
}


/* ─── COMMUNITY VIEW ─────────────────────────────────────────── */
const MEAL_TYPE_LABELS = {breakfast:'Morning',snack:'Snack',lunch:'Lunch',dinner:'Dinner'};
const DIET_TAG_ICONS = {vegetarian:'🥗',vegan:'🌱',pescatarian:'🐟','gluten-free':'🌾','high-protein':'💪','lactose-free':'🥛'};

function CommunityView({onSelectRecipe,calorieGoal,favorites}){
  const [recipes,   setRecipes  ]=useState([]);
  const [loading,   setLoading  ]=useState(true);
  const [showForm,  setShowForm ]=useState(false);
  const [likedIds,  setLikedIds ]=useState(()=>{try{return JSON.parse(localStorage.getItem('kc_liked')||'[]');}catch{return [];}});
  const [sortBy,    setSortBy   ]=useState('hot'); // hot | new

  const saveliked = ids => { setLikedIds(ids); try{localStorage.setItem('kc_liked',JSON.stringify(ids));}catch{} };

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const result = await window.storage.list('community:recipe:');
      if(!result||!result.keys||result.keys.length===0){ setRecipes([]); setLoading(false); return; }
      const items = await Promise.all(
        result.keys.map(async k => {
          try { const r=await window.storage.get(k,true); return r?JSON.parse(r.value):null; } catch{ return null; }
        })
      );
      const valid = items.filter(Boolean);
      if(sortBy==='hot') valid.sort((a,b)=>(b.likes||0)-(a.likes||0));
      else valid.sort((a,b)=>b.createdAt-a.createdAt);
      setRecipes(valid);
    } catch(e){ setRecipes([]); }
    setLoading(false);
  };

  useEffect(()=>{ loadRecipes(); },[sortBy]);

  const handleLike = async (recipe) => {
    if(likedIds.includes(recipe.storageKey)) return;
    const newLikes = (recipe.likes||0)+1;
    const updated = {...recipe, likes:newLikes};
    try {
      await window.storage.set(recipe.storageKey, JSON.stringify(updated), true);
      saveliked([...likedIds, recipe.storageKey]);
      setRecipes(rs=>rs.map(r=>r.storageKey===recipe.storageKey?updated:r));
    } catch(e){}
  };

  const totalRecipes = recipes.length;

  return(
    <div>
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginBottom:18}}>
        <p style={{margin:'0 0 2px',fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>From the community</p>
        <h2 style={{margin:'0 0 3px',fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>Community Recipes</h2>
        <p style={{margin:0,fontSize:12,color:T.ink3,fontFamily:FB}}>{totalRecipes} recipe{totalRecipes!==1?'s':''} shared by the community</p>
      </div>

      {/* Info banner */}
      <div style={{background:T.ink,borderRadius:10,padding:'16px 18px',marginBottom:16,color:'#fff',display:'flex',gap:12,alignItems:'flex-start'}}>
        <Globe size={18} color="rgba(255,255,255,0.5)" style={{flexShrink:0,marginTop:2}}/>
        <div>
          <p style={{margin:'0 0 3px',fontSize:13,fontWeight:700,fontFamily:FB}}>Recipes are shared with everyone</p>
          <p style={{margin:0,fontSize:11,color:'rgba(255,255,255,0.55)',fontFamily:FB,lineHeight:1.5}}>Anyone using this app can see and like your recipes. Keep it kind and useful.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:8,marginBottom:16,alignItems:'center'}}>
        <button onClick={()=>setShowForm(true)}
          style={{display:'flex',alignItems:'center',gap:6,background:T.ink,color:'#fff',border:'none',borderRadius:6,padding:'9px 16px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:FB,flexShrink:0}}>
          <Plus size={13}/> Share a recipe
        </button>
        <div style={{display:'flex',gap:0,background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,overflow:'hidden'}}>
          {[{id:'hot',label:'🔥 Top'},{id:'new',label:'✨ New'}].map(s=>(
            <button key={s.id} onClick={()=>setSortBy(s.id)}
              style={{padding:'8px 14px',border:'none',background:sortBy===s.id?T.ink:'transparent',color:sortBy===s.id?'#fff':T.ink2,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:FB,transition:'all 0.14s'}}>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={loadRecipes} style={{display:'flex',alignItems:'center',gap:5,background:'transparent',border:`1px solid ${T.border}`,borderRadius:6,padding:'8px 12px',fontSize:11,fontWeight:700,cursor:'pointer',color:T.ink2,fontFamily:FB,marginLeft:'auto'}}>
          <RefreshCw size={12} style={{animation:loading?'spin 1s linear infinite':'none'}}/>
        </button>
      </div>

      {/* Loading */}
      {loading&&(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{background:T.surface,borderRadius:12,overflow:'hidden',border:`1px solid ${T.border}`}}>
              <div style={{height:180,background:`linear-gradient(90deg,${T.border} 25%,${T.bg} 50%,${T.border} 75%)`,backgroundSize:'400% 100%',animation:'shimmer 1.4s infinite'}}/>
              <div style={{padding:'13px 15px'}}>
                <div style={{height:15,width:'55%',borderRadius:4,background:T.border,marginBottom:8,animation:'shimmer 1.4s infinite'}}/>
                <div style={{height:10,width:'35%',borderRadius:4,background:T.border,animation:'shimmer 1.4s infinite'}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading&&recipes.length===0&&(
        <div style={{background:T.surface,borderRadius:10,padding:'46px 20px',textAlign:'center',border:`1px solid ${T.border}`}}>
          <Users size={34} color={T.border} style={{margin:'0 auto 12px'}}/>
          <p style={{margin:'0 0 5px',fontSize:14,fontFamily:FD,fontWeight:700,color:T.ink2}}>No community recipes yet</p>
          <p style={{margin:'0 0 16px',fontSize:12,color:T.ink3,fontFamily:FB}}>Be the first to share a recipe with the community!</p>
          <button onClick={()=>setShowForm(true)} style={{background:T.ink,color:'#fff',border:'none',padding:'10px 20px',borderRadius:6,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:FB}}>
            Share the first recipe
          </button>
        </div>
      )}

      {/* Recipe cards */}
      {!loading&&(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {recipes.map(r=>(
            <CommunityCard key={r.storageKey} recipe={r} onOpen={()=>onSelectRecipe(r)}
              liked={likedIds.includes(r.storageKey)} onLike={()=>handleLike(r)}
              calorieGoal={calorieGoal} isFav={favorites.includes(r.id)}/>
          ))}
        </div>
      )}

      {showForm&&<SubmitRecipeForm onClose={()=>setShowForm(false)} onSubmitted={()=>{setShowForm(false);loadRecipes();}}/>}
    </div>
  );
}

function CommunityCard({recipe,onOpen,liked,onLike,calorieGoal,isFav}){
  const [hov,setHov]=useState(false);
  const calPct=calorieGoal&&recipe.calories?Math.min((recipe.calories/calorieGoal)*100,100):0;
  const mealLabel=MEAL_TYPE_LABELS[recipe.mealType]||recipe.mealType||'';
  const date=recipe.createdAt?new Date(recipe.createdAt).toLocaleDateString('en-JP',{month:'short',day:'numeric'}):'';
  return(
    <article style={{background:T.surface,borderRadius:12,overflow:'hidden',border:`1px solid ${T.border}`,boxShadow:hov?'0 10px 36px rgba(26,26,24,0.1)':'0 1px 4px rgba(26,26,24,0.05)',transform:hov?'translateY(-2px)':'none',transition:'all 0.22s ease'}}>
      <div onClick={onOpen} style={{cursor:'pointer'}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <div style={{position:'relative',height:180,overflow:'hidden',background:T.border}}>
          <img src={photo(recipe.photo||recipe.title)} alt={recipe.title} style={{width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.04)':'scale(1)',transition:'transform 0.5s ease'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(26,26,24,0.55),transparent 55%)'}}/>
          <div style={{position:'absolute',top:11,left:11,display:'flex',gap:5}}>
            {mealLabel&&<span style={{background:'rgba(247,244,239,0.92)',backdropFilter:'blur(5px)',borderRadius:3,padding:'3px 9px',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:T.ink,fontFamily:FB}}>{mealLabel}</span>}
          </div>
          <div style={{position:'absolute',top:11,right:11,display:'flex',gap:5}}>
            {isFav&&<div style={{background:T.red,borderRadius:3,padding:'3px 7px'}}><Heart size={9} color="#fff" fill="#fff"/></div>}
          </div>
          {recipe.calories&&<div style={{position:'absolute',bottom:10,right:11,fontFamily:FM,fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.75)'}}>🔥 {recipe.calories} kcal</div>}
          {calPct>0&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:'rgba(255,255,255,0.15)'}}><div style={{height:'100%',width:`${calPct}%`,background:calPct>90?T.red:T.green}}/></div>}
        </div>
        <div style={{padding:'13px 15px 10px'}}>
          <h3 style={{margin:'0 0 2px',fontSize:16,fontFamily:FD,fontWeight:700,color:T.ink,lineHeight:1.2}}>{recipe.title}</h3>
          {recipe.titleJa&&<p style={{margin:'0 0 6px',fontSize:10,color:T.ink3,fontFamily:FM}}>{recipe.titleJa}</p>}
          {recipe.tags&&recipe.tags.length>0&&(
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
              {recipe.tags.slice(0,3).map(tag=>(
                <span key={tag} style={{background:T.greenBg,borderRadius:3,padding:'1px 7px',fontSize:9,fontWeight:700,color:T.green,fontFamily:FB}}>{DIET_TAG_ICONS[tag]||'✓'} {tag}</span>
              ))}
            </div>
          )}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:12}}>
              <span style={{fontSize:10,fontWeight:700,color:T.ink3,fontFamily:FB,display:'flex',alignItems:'center',gap:3}}><Timer size={10}/> {(recipe.prepTime||0)+(recipe.cookTime||0)}m</span>
              <span style={{fontSize:10,fontWeight:700,color:T.ink3,fontFamily:FB,display:'flex',alignItems:'center',gap:3}}><Zap size={10}/> {recipe.macros?.protein||0}g prot</span>
              {recipe.budget&&<span style={{fontSize:10,fontWeight:700,color:T.green,fontFamily:FM}}>{yen(Math.round(recipe.budget/(recipe.servings||1)))}/meal</span>}
            </div>
          </div>
        </div>
      </div>
      {/* Footer: author + likes */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 15px 13px',borderTop:`1px solid ${T.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:22,height:22,borderRadius:'50%',background:T.border,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>
            {(recipe.author||'?').charAt(0).toUpperCase()}
          </div>
          <span style={{fontSize:11,color:T.ink3,fontFamily:FB}}>{recipe.author||'Anonymous'}{date&&<span style={{color:T.ink3}}> · {date}</span>}</span>
        </div>
        <button onClick={onLike} disabled={liked}
          style={{display:'flex',alignItems:'center',gap:5,background:liked?T.redBg:'transparent',border:`1px solid ${liked?T.red+'44':T.border}`,borderRadius:20,padding:'5px 12px',cursor:liked?'default':'pointer',transition:'all 0.15s'}}>
          <ThumbsUp size={12} color={liked?T.red:T.ink3} fill={liked?T.red:'none'}/>
          <span style={{fontSize:11,fontWeight:700,color:liked?T.red:T.ink2,fontFamily:FB}}>{recipe.likes||0}</span>
        </button>
      </div>
    </article>
  );
}

/* ─── SUBMIT RECIPE FORM ─────────────────────────────────────── */

// ── Nutrition estimator (no user input needed) ──────────────────
// Very rough heuristic based on ingredient weights and common macros
const NUTRIENT_DB = {
  // [kcal/100g, protein/100g, carbs/100g, fat/100g]
  default:   [130, 8,  20, 4],
  rice:      [168, 3,  37, 0.3],
  egg:       [155, 13, 1,  11],
  chicken:   [165, 31, 0,  4],
  pork:      [242, 27, 0,  14],
  beef:      [250, 26, 0,  17],
  salmon:    [208, 20, 0,  13],
  tuna:      [130, 28, 0,  1],
  tofu:      [76,  8,  2,  4],
  noodle:    [138, 5,  28, 1],
  pasta:     [158, 6,  31, 1],
  bread:     [265, 9,  49, 3],
  vegetable: [35,  2,  7,  0.3],
  milk:      [61,  3,  5,  3],
  cheese:    [402, 25, 1,  33],
  butter:    [717, 1,  0,  81],
  oil:       [884, 0,  0,  100],
  sauce:     [80,  2,  15, 1],
  mushroom:  [22,  3,  3,  0.3],
  potato:    [77,  2,  17, 0.1],
};

function getNutrientKey(name) {
  const n = (name||'').toLowerCase();
  if(/rice|gohan|okome/.test(n)) return 'rice';
  if(/egg|tamago/.test(n)) return 'egg';
  if(/chicken|tori/.test(n)) return 'chicken';
  if(/pork|buta/.test(n)) return 'pork';
  if(/beef|gyu/.test(n)) return 'beef';
  if(/salmon|saba|fish|mackerel|tuna|maguro/.test(n)) return 'salmon';
  if(/tuna/.test(n)) return 'tuna';
  if(/tofu/.test(n)) return 'tofu';
  if(/noodle|ramen|udon|soba|somen/.test(n)) return 'noodle';
  if(/pasta|spaghetti/.test(n)) return 'pasta';
  if(/bread|toast/.test(n)) return 'bread';
  if(/milk|牛乳/.test(n)) return 'milk';
  if(/cheese/.test(n)) return 'cheese';
  if(/butter/.test(n)) return 'butter';
  if(/oil|abura/.test(n)) return 'oil';
  if(/sauce|tare|shoy|miso|ketchup/.test(n)) return 'sauce';
  if(/mushroom|kinoko/.test(n)) return 'mushroom';
  if(/potato|jagaimo|carrot|ninjin|cabbage|spinach|veggie|yasai|tomato|onion|daikon|bean/.test(n)) return 'vegetable';
  return 'default';
}

function estimateNutrition(ingredients) {
  let totalKcal=0, totalProt=0, totalCarb=0, totalFat=0, totalWeightG=0;
  for(const ing of ingredients) {
    if(!ing.en || !ing.amount) continue;
    let grams = ing.amount;
    if(ing.unit==='kg') grams *= 1000;
    else if(ing.unit==='unit' || ing.unit==='pack') grams = ing.amount * 80; // rough avg
    else if(ing.unit==='ml' || ing.unit==='l') grams = ing.unit==='l' ? ing.amount*1000 : ing.amount;
    // condiments: cap at 20g
    const key = getNutrientKey(ing.en);
    if(key==='sauce' || key==='oil') grams = Math.min(grams, 20);
    const [k,p,c,f] = NUTRIENT_DB[key]||NUTRIENT_DB.default;
    totalKcal += (k/100)*grams;
    totalProt += (p/100)*grams;
    totalCarb += (c/100)*grams;
    totalFat  += (f/100)*grams;
    totalWeightG += grams;
  }
  // estimate servings: ~350–500g per person, round nicely
  const rawServings = Math.max(1, totalWeightG / 420);
  const servings = Math.round(rawServings * 2) / 2; // round to 0.5
  const s = Math.max(1, Math.round(servings));
  return {
    servings: s,
    calories: Math.round(totalKcal / s),
    macros: {
      protein: Math.round(totalProt / s),
      carbs:   Math.round(totalCarb / s),
      fat:     Math.round(totalFat  / s),
    },
  };
}

// ── Translation helper ──────────────────────────────────────────
async function translateRecipeIfNeeded(form) {
  // Detect if title or steps are non-English
  const textToCheck = form.title + ' ' + form.steps.join(' ');
  // Simple heuristic: if >30% chars are non-ASCII, probably not English
  const nonAscii = (textToCheck.match(/[^ -]/g)||[]).length;
  const ratio = nonAscii / textToCheck.length;
  if(ratio < 0.1) return null; // already english-ish, no translation needed

  const prompt = `You are a helpful recipe translator. Translate this recipe into English.
Keep ingredient names practical — use the English name people would search for at a Japanese supermarket.
Return ONLY a JSON object (no markdown) with these exact fields:
{
  "titleEn": "English recipe title",
  "titleOriginal": "${form.title}",
  "stepsEn": ["Step 1 in English", "Step 2 in English"],
  "ingredientsEn": ["ingredient 1 english name", "ingredient 2 english name"],
  "detectedLang": "Spanish|French|Japanese|etc"
}

Recipe to translate:
Title: ${form.title}
Steps: ${form.steps.join(' | ')}
Ingredients: ${form.ingredients.map(i=>i.en).join(', ')}`;

  const API_URL = import.meta.env.VITE_API_URL || '/api/generate';
  const res = await fetch(API_URL, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:1000,messages:[{role:'user',content:prompt}]}),
  });
  if(!res.ok) return null;
  const d = await res.json();
  const raw = d.content?.map(b=>b.text||'').join('').trim();
  const start = raw.indexOf('{'); const end = raw.lastIndexOf('}');
  if(start===-1||end===-1) return null;
  return JSON.parse(raw.slice(start,end+1));
}

function SubmitRecipeForm({onClose,onSubmitted}){
  const [step,      setStep    ]=useState(1);
  const [saving,    setSaving  ]=useState(false);
  const [translating,setTransl ]=useState(false);
  const [error,     setError   ]=useState('');
  const [translation,setTranslation]=useState(null); // {titleEn, stepsEn, ingredientsEn, detectedLang}
  const [form,      setForm    ]=useState({
    title:'', titleJa:'', mealType:'lunch', difficulty:'Easy',
    prepTime:10, cookTime:15, author:'', photo:'', tags:[], steps:['','',''],
    ingredients:[{en:'',ja:'',price:0,amount:100,unit:'g'}],
  });

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const addIngredient=()=>setForm(f=>({...f,ingredients:[...f.ingredients,{en:'',ja:'',price:0,amount:100,unit:'g'}]}));
  const removeIngredient=i=>setForm(f=>({...f,ingredients:f.ingredients.filter((_,idx)=>idx!==i)}));
  const setIngredient=(i,k,v)=>setForm(f=>{const ing=[...f.ingredients];ing[i]={...ing[i],[k]:v};return{...f,ingredients:ing};});
  const addStep=()=>setForm(f=>({...f,steps:[...f.steps,'']}));
  const setStep2=(i,v)=>setForm(f=>{const s=[...f.steps];s[i]=v;return{...f,steps:s};});
  const removeStep=i=>setForm(f=>({...f,steps:f.steps.filter((_,idx)=>idx!==i)}));
  const toggleTag=t=>setForm(f=>({...f,tags:f.tags.includes(t)?f.tags.filter(x=>x!==t):[...f.tags,t]}));

  // Live nutrition estimate based on current ingredients
  const nutrition = useMemo(()=>estimateNutrition(form.ingredients),[form.ingredients]);

  const validate=()=>{
    if(!form.title.trim()) return 'Please add a recipe title';
    if(form.ingredients.filter(i=>i.en.trim()).length===0) return 'Add at least one ingredient';
    if(form.steps.filter(s=>s.trim()).length===0) return 'Add at least one step';
    return '';
  };

  const submit=async()=>{
    const err=validate(); if(err){setError(err);return;}
    setSaving(true); setError('');
    try{
      // Try translation
      setTransl(true);
      let xlat = null;
      try{ xlat = await translateRecipeIfNeeded(form); }catch(_){}
      setTransl(false);

      const nut = estimateNutrition(form.ingredients);
      const id  = Date.now();
      const key = 'community:recipe:'+id;

      const recipe = {
        ...form,
        id, storageKey:key, createdAt:id, likes:0,
        steps:       form.steps.filter(s=>s.trim()),
        photo:       form.photo.trim()||form.title,
        servings:    nut.servings,
        calories:    nut.calories,
        macros:      nut.macros,
        budget:      form.ingredients.reduce((s,i)=>s+(i.price||0),0),
        // Translation fields
        titleOriginal: xlat ? form.title : null,
        stepsOriginal: xlat ? form.steps.filter(s=>s.trim()) : null,
        detectedLang:  xlat?.detectedLang || null,
        // Apply translation if available
        title:       xlat?.titleEn || form.title,
        steps:       xlat?.stepsEn || form.steps.filter(s=>s.trim()),
        ingredients: form.ingredients.map((ing,i)=>({
          ...ing,
          en: (xlat?.ingredientsEn?.[i]) || ing.en,
          enOriginal: xlat ? ing.en : null,
        })),
      };
      await window.storage.set(key, JSON.stringify(recipe), true);
      onSubmitted();
    }catch(e){ setError('Could not save. Please try again.'); setSaving(false); setTransl(false); }
  };

  const inputStyle={width:'100%',padding:'10px 13px',border:'1.5px solid #E8E4DC',borderRadius:8,fontSize:13,fontFamily:FB,color:T.ink,background:T.surface,outline:'none',boxSizing:'border-box'};
  const labelStyle={display:'block',margin:'0 0 5px',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB};

  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:'fixed',inset:0,background:'rgba(26,26,24,0.75)',backdropFilter:'blur(10px)',zIndex:60,display:'flex',alignItems:'flex-end',justifyContent:'center',animation:'fadeIn 0.2s ease'}}>
      <div className="noscroll" style={{background:T.bg,width:'100%',maxWidth:600,height:'92vh',borderRadius:'18px 18px 0 0',overflowY:'auto',animation:'slideUp 0.28s ease'}}>

        {/* Header */}
        <div style={{position:'sticky',top:0,background:T.bg,borderBottom:`1px solid ${T.border}`,padding:'16px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:5}}>
          <div>
            <p style={{margin:0,fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Step {step} of 3</p>
            <h3 style={{margin:0,fontSize:17,fontFamily:FD,fontWeight:700,color:T.ink}}>
              {step===1?'Basic info':step===2?'Ingredients':'Instructions'}
            </h3>
          </div>
          <button onClick={onClose} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={14} color={T.ink2}/></button>
        </div>

        {/* Progress */}
        <div style={{display:'flex',gap:4,padding:'12px 18px 0'}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?T.ink:T.border,transition:'background 0.2s'}}/>
          ))}
        </div>

        <div style={{padding:'18px 18px 100px'}}>

          {/* ── STEP 1: BASICS ── */}
          {step===1&&(
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={labelStyle}>Recipe title *</label>
                <input value={form.title} onChange={e=>set('title',e.target.value)}
                  placeholder="e.g. Miso Glazed Salmon / Salmón con miso / 味噌サーモン"
                  style={inputStyle}/>
                <p style={{margin:'4px 0 0',fontSize:10,color:T.ink3,fontFamily:FB}}>
                  Any language — we'll translate it automatically
                </p>
              </div>
              <div>
                <label style={labelStyle}>Japanese name (optional)</label>
                <input value={form.titleJa} onChange={e=>set('titleJa',e.target.value)}
                  placeholder="e.g. 鮭の味噌焼き" style={{...inputStyle,fontFamily:FM}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div>
                  <label style={labelStyle}>Meal type</label>
                  <select value={form.mealType} onChange={e=>set('mealType',e.target.value)} style={{...inputStyle,cursor:'pointer'}}>
                    {MEAL_TYPES.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select value={form.difficulty} onChange={e=>set('difficulty',e.target.value)} style={{...inputStyle,cursor:'pointer'}}>
                    {['Easiest','Easy','Intermediate'].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div>
                  <label style={labelStyle}>Prep time (min)</label>
                  <input type="number" value={form.prepTime} onChange={e=>set('prepTime',+e.target.value)} min={0} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Cook time (min)</label>
                  <input type="number" value={form.cookTime} onChange={e=>set('cookTime',+e.target.value)} min={0} style={inputStyle}/>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Your name (optional)</label>
                <input value={form.author} onChange={e=>set('author',e.target.value)} placeholder="Anonymous" style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Photo keyword</label>
                <input value={form.photo} onChange={e=>set('photo',e.target.value)}
                  placeholder="e.g. miso salmon rice" style={inputStyle}/>
                <p style={{margin:'4px 0 0',fontSize:10,color:T.ink3,fontFamily:FB}}>Helps find the right photo — leave blank to use the title</p>
              </div>
              <div>
                <label style={labelStyle}>Dietary tags</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:4}}>
                  {Object.entries(DIET_TAG_ICONS).map(([tag,icon])=>(
                    <button key={tag} onClick={()=>toggleTag(tag)}
                      style={{padding:'5px 11px',borderRadius:4,border:`1.5px solid ${form.tags.includes(tag)?T.green:T.border}`,background:form.tags.includes(tag)?T.greenBg:'transparent',color:form.tags.includes(tag)?T.green:T.ink2,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:FB}}>
                      {icon} {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: INGREDIENTS ── */}
          {step===2&&(
            <div>
              <p style={{margin:'0 0 4px',fontSize:12,color:T.ink3,fontFamily:FB}}>
                Add ingredients with prices from Japanese supermarkets. Calories and servings will be estimated automatically.
              </p>

              {/* Live nutrition preview */}
              {form.ingredients.some(i=>i.en.trim())&&(
                <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:'12px 14px',marginBottom:14,display:'flex',gap:0}}>
                  <div style={{flex:1,textAlign:'center',borderRight:`1px solid ${T.border}`}}>
                    <p style={{margin:0,fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>Est. servings</p>
                    <p style={{margin:0,fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>{nutrition.servings}</p>
                  </div>
                  <div style={{flex:1,textAlign:'center',borderRight:`1px solid ${T.border}`}}>
                    <p style={{margin:0,fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>Kcal/serving</p>
                    <p style={{margin:0,fontSize:20,fontFamily:FD,fontWeight:700,color:T.red}}>{nutrition.calories}</p>
                  </div>
                  <div style={{flex:1,textAlign:'center',borderRight:`1px solid ${T.border}`}}>
                    <p style={{margin:0,fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>Protein</p>
                    <p style={{margin:0,fontSize:20,fontFamily:FD,fontWeight:700,color:T.green}}>{nutrition.macros.protein}g</p>
                  </div>
                  <div style={{flex:1,textAlign:'center'}}>
                    <p style={{margin:0,fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.ink3,fontFamily:FB}}>Cost</p>
                    <p style={{margin:0,fontSize:20,fontFamily:FD,fontWeight:700,color:T.ink}}>{yen(form.ingredients.reduce((s,i)=>s+(i.price||0),0))}</p>
                  </div>
                </div>
              )}

              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {form.ingredients.map((ing,i)=>(
                  <div key={i} style={{background:T.surface,borderRadius:10,padding:'13px',border:`1px solid ${T.border}`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <span style={{fontSize:10,fontWeight:700,color:T.ink3,fontFamily:FB,textTransform:'uppercase',letterSpacing:'0.1em'}}>#{i+1}</span>
                      {form.ingredients.length>1&&(
                        <button onClick={()=>removeIngredient(i)} style={{background:'none',border:'none',cursor:'pointer',padding:2}}><Trash2 size={13} color={T.red}/></button>
                      )}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                      <input value={ing.en} onChange={e=>setIngredient(i,'en',e.target.value)}
                        placeholder="Name (any language)" style={inputStyle}/>
                      <input value={ing.ja} onChange={e=>setIngredient(i,'ja',e.target.value)}
                        placeholder="日本語名 (optional)" style={{...inputStyle,fontFamily:FM}}/>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                      <input type="number" value={ing.amount} onChange={e=>setIngredient(i,'amount',+e.target.value)}
                        placeholder="Amount" style={inputStyle} min={0}/>
                      <select value={ing.unit} onChange={e=>setIngredient(i,'unit',e.target.value)} style={{...inputStyle,cursor:'pointer'}}>
                        {['g','kg','ml','l','unit','pack'].map(u=><option key={u}>{u}</option>)}
                      </select>
                      <div style={{position:'relative'}}>
                        <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontSize:13,color:T.ink3,pointerEvents:'none'}}>¥</span>
                        <input type="number" value={ing.price} onChange={e=>setIngredient(i,'price',+e.target.value)}
                          placeholder="Price" style={{...inputStyle,paddingLeft:22}} min={0}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addIngredient}
                style={{width:'100%',background:'transparent',border:`1.5px dashed ${T.border}`,borderRadius:10,padding:12,fontWeight:700,fontSize:13,cursor:'pointer',color:T.ink2,fontFamily:FB,marginTop:10,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <Plus size={14}/> Add ingredient
              </button>
            </div>
          )}

          {/* ── STEP 3: INSTRUCTIONS ── */}
          {step===3&&(
            <div>
              <p style={{margin:'0 0 14px',fontSize:12,color:T.ink3,fontFamily:FB}}>
                Write in any language — steps will be translated automatically before sharing.
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:9}}>
                {form.steps.map((s,i)=>(
                  <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                    <span style={{background:T.ink,color:'#fff',width:24,height:24,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,fontFamily:FB,marginTop:10}}>{i+1}</span>
                    <textarea value={s} onChange={e=>setStep2(i,e.target.value)}
                      placeholder={'Step '+(i+1)+'…'} rows={2}
                      style={{...inputStyle,resize:'vertical',lineHeight:1.5,padding:'10px 13px'}}/>
                    {form.steps.length>2&&(
                      <button onClick={()=>removeStep(i)} style={{background:'none',border:'none',cursor:'pointer',padding:'10px 4px',flexShrink:0}}>
                        <Trash2 size={13} color={T.red}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addStep}
                style={{width:'100%',background:'transparent',border:`1.5px dashed ${T.border}`,borderRadius:10,padding:12,fontWeight:700,fontSize:13,cursor:'pointer',color:T.ink2,fontFamily:FB,marginTop:10,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <Plus size={14}/> Add step
              </button>
            </div>
          )}

          {error&&(
            <div style={{background:T.redBg,border:`1px solid ${T.red}33`,borderRadius:8,padding:'10px 14px',marginTop:14,fontSize:12,color:T.red,fontFamily:FB,display:'flex',alignItems:'center',gap:7}}>
              <AlertCircle size={13}/> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{position:'sticky',bottom:0,background:T.bg,borderTop:`1px solid ${T.border}`,padding:'12px 18px',display:'flex',gap:8}}>
          {step>1&&(
            <button onClick={()=>setStep(s=>s-1)}
              style={{flex:1,background:'transparent',border:`1.5px solid ${T.border}`,borderRadius:8,padding:13,fontWeight:700,fontSize:13,cursor:'pointer',color:T.ink2,fontFamily:FB}}>
              ← Back
            </button>
          )}
          {step<3?(
            <button onClick={()=>setStep(s=>s+1)}
              style={{flex:2,background:T.ink,color:'#fff',border:'none',borderRadius:8,padding:13,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:FB}}>
              Next →
            </button>
          ):(
            <button onClick={submit} disabled={saving||translating}
              style={{flex:2,background:(saving||translating)?T.ink2:T.green,color:'#fff',border:'none',borderRadius:8,padding:13,fontWeight:700,fontSize:13,cursor:(saving||translating)?'default':'pointer',fontFamily:FB,display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
              {translating
                ? <><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/> Translating…</>
                : saving
                ? <><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/> Saving…</>
                : <><Send size={14}/> Share recipe</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────── */
export default function App(){
  const [view,     setView    ]=useState('discover');
  const [selected, setSelected]=useState(null);
  const [pantryMealType,setPantryMealType]=useState(null);
  const [settings, setSettings]=usePersist('kc_settings',{weeklyBudget:8000,calorieGoal:2000,dietaryProfile:'none',allergies:[]});
  const [favorites,setFavorites]=usePersist('kc_favorites',[]);
  const [saved,    setSaved   ]=usePersist('kc_saved',[]);
  const [cart,     setCart    ]=usePersist('kc_cart',[]);
  const [pantry,   setPantry  ]=usePersist('kc_pantry',[]);

  const toggleFav=id=>setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);
  const saveRecipe=r=>setSaved(s=>s.find(x=>x.id===r.id)?s:[r,...s].slice(0,60));
  const addToCart=items=>setCart(c=>{const m=Object.fromEntries(c.map(i=>[i.en,i]));items.forEach(i=>{if(!m[i.en])m[i.en]=i;});return Object.values(m);});
  const handleSelect=r=>{saveRecipe(r);setSelected(r);};

  const NAV=[
    {id:'discover',   icon:Search,       label:'Discover'},
    {id:'pantry',     icon:Refrigerator, label:'Pantry',  badge:pantry.length||null},
    {id:'shop',       icon:ShoppingCart, label:'Shop',    badge:cart.length||null},
    {id:'saved',      icon:Heart,        label:'Saved',   badge:favorites.length||null},
    {id:'community',  icon:Users,        label:'Community'},
    {id:'tips',       icon:Lightbulb,    label:'Tips'},
    {id:'goals',      icon:Target,       label:'Goals'},
    {id:'donate',     icon:Star,         label:'Support'},
  ];

  const dp=settings.dietaryProfile&&settings.dietaryProfile!=='none'?DIETARY_PROFILES.find(p=>p.id===settings.dietaryProfile):null;

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap');
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        @keyframes slideUp {from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes shimmer {0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes spin    {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .noscroll::-webkit-scrollbar{display:none}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0;background:#F7F4EF;font-family:-apple-system,'Helvetica Neue',sans-serif}
        img{display:block}
        select{appearance:none;-webkit-appearance:none}
        a{transition:opacity 0.14s}
        a:hover{opacity:0.85}
      `}}/>

      <div style={{minHeight:'100dvh',background:T.bg,paddingBottom:76,maxWidth:600,margin:'0 auto'}}>
        <header style={{padding:'50px 20px 0',background:T.bg}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
            <div>
              <h1 style={{margin:0,fontSize:27,fontFamily:'Lora,Georgia,serif',fontWeight:700,color:T.ink,letterSpacing:'-0.02em',lineHeight:1}}>買い物 Cook</h1>
              <p style={{margin:'3px 0 0',fontSize:9,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:T.ink3,fontFamily:FB}}>Japan Budget Kitchen</p>
            </div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap',justifyContent:'flex-end'}}>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,padding:'5px 10px',borderRadius:5,display:'flex',alignItems:'center',gap:4}}>
                <span style={{fontSize:11,fontFamily:FM,fontWeight:700,color:T.green}}>{yen(settings.weeklyBudget)}</span>
                <span style={{fontSize:8,color:T.ink3,fontFamily:FB}}>/wk</span>
              </div>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,padding:'5px 10px',borderRadius:5,display:'flex',alignItems:'center',gap:4}}>
                <span style={{fontSize:11,fontFamily:FM,fontWeight:700,color:T.red}}>{settings.calorieGoal}</span>
                <span style={{fontSize:8,color:T.ink3,fontFamily:FB}}>kcal</span>
              </div>
              {dp&&<div style={{background:T.surface,border:`1px solid ${T.border}`,padding:'5px 10px',borderRadius:5,display:'flex',alignItems:'center',gap:4}}>
                <span style={{fontSize:12}}>{dp.emoji}</span>
                <span style={{fontSize:9,color:T.ink2,fontFamily:FB,fontWeight:700}}>{dp.label}</span>
              </div>}
            </div>
          </div>
          <div style={{display:'flex',gap:0,overflowX:'auto',borderBottom:`1px solid ${T.border}`,marginLeft:-20,marginRight:-20,paddingLeft:20}}>
            {NAV.map(({id,label,badge})=>(
              <button key={id} onClick={()=>setView(id)}
                style={{position:'relative',padding:'9px 13px',border:'none',background:'transparent',fontSize:11,fontWeight:700,letterSpacing:'0.04em',cursor:'pointer',whiteSpace:'nowrap',fontFamily:FB,color:view===id?T.ink:T.ink3,borderBottom:`2px solid ${view===id?T.ink:'transparent'}`,transition:'all 0.14s',flexShrink:0}}>
                {label}
                {badge>0&&<span style={{position:'absolute',top:5,right:3,background:T.red,color:'#fff',fontSize:8,fontWeight:900,width:14,height:14,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FB}}>{badge>9?'9+':badge}</span>}
              </button>
            ))}
          </div>
        </header>

        <main style={{padding:'18px 16px 0'}}>
          {view==='discover'&&<DiscoverView settings={settings} favorites={favorites} onSelectRecipe={handleSelect} pantryItems={pantry} initialMealType={pantryMealType} onMealTypeUsed={()=>setPantryMealType(null)}/>}
          {view==='pantry'  &&<PantryView pantryItems={pantry} onChange={setPantry} onGenerateWithPantry={mt=>{setPantryMealType(mt);setView('discover');}}/>}
          {view==='shop'    &&<ShoppingView cart={cart} onUpdateCart={setCart}/>}
          {view==='saved'   &&<SavedView savedRecipes={saved} favorites={favorites} onSelectRecipe={handleSelect} onToggleFav={toggleFav}/>}
          {view==='tips'    &&<TipsView/>}
          {view==='goals'   &&<GoalsView settings={settings} onChange={setSettings}/>}
          {view==='donate'     &&<DonateView/>}
          {view==='community' &&<CommunityView onSelectRecipe={handleSelect} calorieGoal={settings.calorieGoal} favorites={favorites}/>}
        </main>

        <nav style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:600,background:'rgba(247,244,239,0.96)',backdropFilter:'blur(20px)',borderTop:`1px solid ${T.border}`,padding:'8px 0 max(8px,env(safe-area-inset-bottom))',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:40}}>
          {NAV.map(({id,icon:Icon,label,badge})=>(
            <button key={id} onClick={()=>setView(id)}
              style={{position:'relative',background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'2px 5px',transition:'all 0.14s',minWidth:40}}>
              <Icon size={19} color={view===id?T.ink:T.ink3}/>
              <span style={{fontSize:8,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:view===id?T.ink:T.ink3,fontFamily:FB}}>{label}</span>
              {badge>0&&<span style={{position:'absolute',top:-1,right:1,background:T.red,color:'#fff',fontSize:7,fontWeight:900,width:13,height:13,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>{badge>9?'9+':badge}</span>}
            </button>
          ))}
        </nav>
      </div>

      {selected&&(
        <RecipeModal recipe={selected} calorieGoal={settings.calorieGoal} favorites={favorites}
          onToggleFav={toggleFav} onClose={()=>setSelected(null)} onAddToCart={addToCart}/>
      )}
    </>
  );
}
