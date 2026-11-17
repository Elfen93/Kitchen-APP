// Curated library: 40 budget recipes built around Japanese supermarket staples.
// Diet/allergen info is NOT stored here: it is derived from ingredients in src/lib/diet.js
export const RECIPES = [
  // ── BREAKFAST ──────────────────────────────────────────────
  { id:1, mealType:'breakfast', title:'Tamago Gohan', titleJa:'卵かけご飯', difficulty:'Easiest',
    prepTime:2, cookTime:0, servings:1, budget:80, calories:320,
    macros:{protein:14,carbs:55,fat:7}, equipment:['Bowl'], 
    steps:['Cook 1 cup rice in rice cooker or pot.','Let it cool for 1 minute — too hot will cook the egg.','Crack 1 raw egg directly over warm rice.','Add soy sauce and mix vigorously until creamy.'],
    ingredients:[{en:'Cooked rice',ja:'ご飯',price:30,amount:200,unit:'g'},{en:'Egg (1)',ja:'卵',price:20,amount:1,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:5,amount:5,unit:'ml'}]},

  { id:2, mealType:'breakfast', title:'Miso Soup & Rice', titleJa:'味噌汁とご飯', difficulty:'Easiest',
    prepTime:5, cookTime:5, servings:2, budget:120, calories:280,
    macros:{protein:10,carbs:50,fat:4}, equipment:['Pot','Bowl'], 
    steps:['Boil 400ml water, add 1 tsp dashi powder.','Lower heat, dissolve 2 tbsp miso — never boil after.','Add silken tofu cubes and wakame seaweed.','Serve with steamed rice and pickles if available.'],
    ingredients:[{en:'Miso paste',ja:'味噌',price:30,amount:40,unit:'g'},{en:'Silken tofu',ja:'絹豆腐',price:50,amount:150,unit:'g'},{en:'Dashi powder',ja:'だしの素',price:15,amount:5,unit:'g'},{en:'Dried wakame',ja:'わかめ',price:20,amount:3,unit:'g'}]},

  { id:3, mealType:'breakfast', title:'Japanese Toast Set', titleJa:'トーストセット', difficulty:'Easiest',
    prepTime:3, cookTime:5, servings:1, budget:150, calories:380,
    macros:{protein:12,carbs:52,fat:14}, equipment:['Toaster'], 
    steps:['Toast bread slices until golden.','Spread butter while hot.','Fry egg sunny-side up in a dry pan.','Serve with milk or coffee.'],
    ingredients:[{en:'Bread (2 slices)',ja:'食パン',price:40,amount:2,unit:'unit'},{en:'Butter',ja:'バター',price:30,amount:10,unit:'g'},{en:'Egg (1)',ja:'卵',price:20,amount:1,unit:'unit'},{en:'Milk',ja:'牛乳',price:40,amount:200,unit:'ml'}]},

  { id:4, mealType:'breakfast', title:'Natto Rice', titleJa:'納豆ご飯', difficulty:'Easiest',
    prepTime:2, cookTime:0, servings:1, budget:90, calories:340,
    macros:{protein:18,carbs:54,fat:6}, equipment:['Bowl'], 
    steps:['Open natto pack and add included sauce and mustard.','Stir vigorously 50 times until stringy.','Pour over warm rice.','Top with chopped green onion.'],
    ingredients:[{en:'Natto (1 pack)',ja:'納豆',price:50,amount:1,unit:'pack'},{en:'Cooked rice',ja:'ご飯',price:30,amount:200,unit:'g'},{en:'Green onion',ja:'ねぎ',price:10,amount:10,unit:'g'}]},

  { id:5, mealType:'breakfast', title:'Oat Porridge with Banana', titleJa:'オートミールバナナ', difficulty:'Easiest',
    prepTime:2, cookTime:5, servings:1, budget:130, calories:360,
    macros:{protein:9,carbs:65,fat:5}, equipment:['Pot or Microwave'], 
    steps:['Combine oats and water (or milk) in a bowl.','Microwave 2 min, stir halfway.','Slice banana on top.','Drizzle a little honey or soy milk if available.'],
    ingredients:[{en:'Rolled oats',ja:'オートミール',price:60,amount:80,unit:'g'},{en:'Banana (1)',ja:'バナナ',price:30,amount:1,unit:'unit'},{en:'Water or soy milk',ja:'水／豆乳',price:20,amount:200,unit:'ml'}]},

  { id:6, mealType:'breakfast', title:'Yogurt Granola Bowl', titleJa:'ヨーグルトグラノーラ', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:180, calories:390,
    macros:{protein:12,carbs:58,fat:9}, equipment:['Bowl'], 
    steps:['Spoon yogurt into a bowl.','Top generously with granola.','Add seasonal fruit if available.','Drizzle honey to taste.'],
    ingredients:[{en:'Plain yogurt',ja:'ヨーグルト',price:80,amount:200,unit:'g'},{en:'Granola',ja:'グラノーラ',price:60,amount:50,unit:'g'},{en:'Honey',ja:'はちみつ',price:20,amount:10,unit:'g'}]},

  // ── SNACKS ──────────────────────────────────────────────────
  { id:7, mealType:'snack', title:'Onigiri — Tuna Mayo', titleJa:'ツナマヨおにぎり', difficulty:'Easy',
    prepTime:10, cookTime:0, servings:2, budget:180, calories:280,
    macros:{protein:10,carbs:48,fat:6}, equipment:['Bowl','Plastic wrap'], 
    steps:['Mix drained canned tuna with mayonnaise and a pinch of soy sauce.','Wet hands and coat with salt.','Place rice in palm, add filling, shape into triangle.','Wrap with nori strip or leave plain.'],
    ingredients:[{en:'Cooked rice',ja:'ご飯',price:60,amount:400,unit:'g'},{en:'Canned tuna',ja:'ツナ缶',price:80,amount:70,unit:'g'},{en:'Mayonnaise',ja:'マヨネーズ',price:20,amount:15,unit:'g'},{en:'Nori sheet',ja:'のり',price:20,amount:2,unit:'unit'}]},

  { id:8, mealType:'snack', title:'Edamame with Sea Salt', titleJa:'塩枝豆', difficulty:'Easiest',
    prepTime:2, cookTime:8, servings:2, budget:120, calories:160,
    macros:{protein:12,carbs:12,fat:5}, equipment:['Pot'], 
    steps:['Bring salted water to a boil.','Add frozen edamame straight from bag.','Cook 5–6 minutes until tender.','Drain, sprinkle extra salt, and eat immediately.'],
    ingredients:[{en:'Frozen edamame',ja:'冷凍枝豆',price:120,amount:300,unit:'g'}]},

  { id:9, mealType:'snack', title:'Cheese & Crackers', titleJa:'チーズクラッカー', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:150, calories:240,
    macros:{protein:8,carbs:22,fat:12}, equipment:['None'], 
    steps:['Slice cheese into bite-size pieces.','Arrange on plate with crackers.','Optional: add a few grapes or cherry tomatoes.'],
    ingredients:[{en:'Sliced cheese',ja:'スライスチーズ',price:80,amount:3,unit:'unit'},{en:'Crackers',ja:'クラッカー',price:60,amount:10,unit:'unit'}]},

  { id:10, mealType:'snack', title:'Gyoza (Frozen Pan-fried)', titleJa:'冷凍餃子', difficulty:'Easiest',
    prepTime:2, cookTime:10, servings:2, budget:200, calories:300,
    macros:{protein:10,carbs:35,fat:10}, equipment:['Frying pan with lid'], 
    steps:['Heat oiled pan on medium-high.','Place frozen gyoza flat-side down.','Add 100ml water, cover immediately.','Steam 6 min, remove lid, fry 2 more min until crispy.'],
    ingredients:[{en:'Frozen gyoza (pack)',ja:'冷凍餃子',price:200,amount:1,unit:'pack'}]},

  { id:11, mealType:'snack', title:'Apple & Peanut Butter', titleJa:'りんごピーナッツバター', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:120, calories:220,
    macros:{protein:5,carbs:30,fat:9}, equipment:['Knife'], 
    steps:['Wash and slice apple into wedges.','Remove core.','Serve with peanut butter for dipping.'],
    ingredients:[{en:'Apple',ja:'りんご',price:80,amount:1,unit:'unit'},{en:'Peanut butter',ja:'ピーナッツバター',price:40,amount:30,unit:'g'}]},

  { id:12, mealType:'snack', title:'Mochi with Kinako', titleJa:'きなこ餅', difficulty:'Easiest',
    prepTime:2, cookTime:3, servings:2, budget:100, calories:280,
    macros:{protein:6,carbs:55,fat:3}, equipment:['Microwave'], 
    steps:['Microwave kirimochi on damp paper towel 1–2 min until puffy.','Mix kinako (roasted soy flour) with sugar and pinch of salt.','Roll hot mochi in kinako mix.','Eat immediately while soft.'],
    ingredients:[{en:'Kirimochi (2 pieces)',ja:'切り餅',price:60,amount:2,unit:'unit'},{en:'Kinako powder',ja:'きな粉',price:30,amount:20,unit:'g'},{en:'Sugar',ja:'砂糖',price:5,amount:5,unit:'g'}]},

  // ── LUNCH ───────────────────────────────────────────────────
  { id:13, mealType:'lunch', title:'Shoyu Ramen', titleJa:'醤油ラーメン', difficulty:'Easy',
    prepTime:5, cookTime:15, servings:2, budget:380, calories:520,
    macros:{protein:22,carbs:72,fat:12}, equipment:['Pot'], 
    steps:['Boil 600ml water with dashi, soy sauce, mirin and sesame oil.','Cook ramen noodles separately per packet instructions.','Drain noodles, place in bowls, pour hot broth over.','Top with soft-boiled egg, nori, and green onion.'],
    ingredients:[{en:'Ramen noodles',ja:'ラーメン麺',price:80,amount:2,unit:'pack'},{en:'Soy sauce',ja:'醤油',price:15,amount:30,unit:'ml'},{en:'Dashi powder',ja:'だしの素',price:10,amount:5,unit:'g'},{en:'Egg (2)',ja:'卵',price:40,amount:2,unit:'unit'},{en:'Green onion',ja:'ねぎ',price:20,amount:30,unit:'g'}]},

  { id:14, mealType:'lunch', title:'Curry Rice', titleJa:'カレーライス', difficulty:'Easy',
    prepTime:10, cookTime:25, servings:4, budget:650, calories:580,
    macros:{protein:18,carbs:80,fat:14}, equipment:['Pot'], 
    steps:['Sauté diced onion until golden, add carrot and potato chunks.','Add water, bring to boil, simmer 15 min until veg is soft.','Turn off heat, add curry roux blocks and stir until dissolved.','Simmer 5 more min, serve over rice.'],
    ingredients:[{en:'Curry roux (half pack)',ja:'カレールー',price:120,amount:100,unit:'g'},{en:'Chicken thigh',ja:'鶏もも肉',price:250,amount:300,unit:'g'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'},{en:'Carrot (1)',ja:'にんじん',price:30,amount:1,unit:'unit'},{en:'Potato (2)',ja:'じゃがいも',price:50,amount:2,unit:'unit'}]},

  { id:15, mealType:'lunch', title:'Vegetable Curry Rice', titleJa:'野菜カレー', difficulty:'Easy',
    prepTime:10, cookTime:25, servings:3, budget:420, calories:500,
    macros:{protein:10,carbs:82,fat:10}, equipment:['Pot'], 
    steps:['Sauté onion until golden in oil.','Add chopped sweet potato, eggplant and bell pepper.','Add 500ml water and simmer 15 min.','Dissolve vegan curry roux (check label) and simmer 5 min more.'],
    ingredients:[{en:'Curry roux (check vegan)',ja:'カレールー',price:120,amount:80,unit:'g'},{en:'Sweet potato',ja:'さつまいも',price:80,amount:200,unit:'g'},{en:'Eggplant (1)',ja:'なす',price:60,amount:1,unit:'unit'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'}]},

  { id:16, mealType:'lunch', title:'Gyudon Beef Bowl', titleJa:'牛丼', difficulty:'Easy',
    prepTime:5, cookTime:15, servings:2, budget:580, calories:620,
    macros:{protein:28,carbs:68,fat:18}, equipment:['Frying pan'], 
    steps:['Simmer sliced onion in dashi, soy sauce, mirin and sugar 5 min.','Add thinly sliced beef (koma-gire), cook 3–4 min.','Taste and adjust seasoning.','Serve over rice with pickled ginger on the side.'],
    ingredients:[{en:'Beef slices (koma-gire)',ja:'牛こま切れ',price:320,amount:250,unit:'g'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:20,amount:40,unit:'ml'},{en:'Mirin',ja:'みりん',price:15,amount:30,unit:'ml'}]},

  { id:17, mealType:'lunch', title:'Cold Soba Noodles', titleJa:'ざるそば', difficulty:'Easy',
    prepTime:5, cookTime:8, servings:2, budget:280, calories:380,
    macros:{protein:14,carbs:68,fat:2}, equipment:['Pot','Bowl'], 
    steps:['Boil soba noodles per packet (usually 4–5 min).','Rinse immediately under cold water until completely cold.','Mix mentsuyu with cold water per packet ratio for dipping sauce.','Serve noodles on a plate with dipping sauce, wasabi and green onion.'],
    ingredients:[{en:'Soba noodles (2 bundles)',ja:'そば',price:100,amount:200,unit:'g'},{en:'Mentsuyu concentrate',ja:'めんつゆ',price:80,amount:60,unit:'ml'},{en:'Green onion',ja:'ねぎ',price:15,amount:20,unit:'g'}]},

  { id:18, mealType:'lunch', title:'Fried Rice', titleJa:'チャーハン', difficulty:'Easy',
    prepTime:5, cookTime:10, servings:2, budget:280, calories:480,
    macros:{protein:16,carbs:65,fat:12}, equipment:['Wok or large pan'], 
    steps:['Use day-old cold rice for best results.','Beat eggs, scramble in oiled pan, set aside.','High heat: stir-fry ham and green onion 1 min.','Add rice, break up clumps, add scrambled egg back. Season with soy sauce.'],
    ingredients:[{en:'Cooked rice (cold)',ja:'ご飯',price:60,amount:400,unit:'g'},{en:'Eggs (2)',ja:'卵',price:40,amount:2,unit:'unit'},{en:'Ham or spam',ja:'ハム',price:80,amount:60,unit:'g'},{en:'Green onion',ja:'ねぎ',price:20,amount:30,unit:'g'},{en:'Soy sauce',ja:'醤油',price:10,amount:15,unit:'ml'}]},

  { id:19, mealType:'lunch', title:'Udon with Soft Egg', titleJa:'たまごうどん', difficulty:'Easiest',
    prepTime:3, cookTime:10, servings:2, budget:220, calories:440,
    macros:{protein:16,carbs:72,fat:8}, equipment:['Pot'], 
    steps:['Boil udon noodles per packet.','In a separate small pot, heat mentsuyu broth.','Soft boil eggs 6.5 min, peel under cold water.','Assemble: udon in broth, halve soft egg on top, add green onion.'],
    ingredients:[{en:'Frozen udon (2 packs)',ja:'冷凍うどん',price:100,amount:2,unit:'pack'},{en:'Mentsuyu',ja:'めんつゆ',price:60,amount:80,unit:'ml'},{en:'Eggs (2)',ja:'卵',price:40,amount:2,unit:'unit'}]},

  { id:20, mealType:'lunch', title:'Tofu & Veg Stir-fry Bowl', titleJa:'豆腐炒め丼', difficulty:'Easy',
    prepTime:8, cookTime:12, servings:2, budget:320, calories:420,
    macros:{protein:18,carbs:55,fat:14}, equipment:['Frying pan'], 
    steps:['Press firm tofu dry, cut into cubes, pan-fry until golden.','Add bean sprouts, cabbage and frozen veg, stir-fry 3 min.','Season with soy sauce (use tamari for GF), sesame oil and ginger.','Serve over rice with sesame seeds.'],
    ingredients:[{en:'Firm tofu',ja:'木綿豆腐',price:80,amount:300,unit:'g'},{en:'Bean sprouts',ja:'もやし',price:38,amount:200,unit:'g'},{en:'Cabbage',ja:'キャベツ',price:60,amount:150,unit:'g'},{en:'Sesame oil',ja:'ごま油',price:10,amount:10,unit:'ml'}]},

  { id:21, mealType:'lunch', title:'Salmon Flake Donburi', titleJa:'鮭フレーク丼', difficulty:'Easiest',
    prepTime:3, cookTime:0, servings:1, budget:280, calories:520,
    macros:{protein:24,carbs:60,fat:14}, equipment:['Bowl'], 
    steps:['Warm rice in bowl.','Spoon generous amount of salmon flakes over rice.','Add a raw egg yolk in the center if desired.','Season with soy sauce and sesame seeds.'],
    ingredients:[{en:'Salmon flakes jar',ja:'鮭フレーク',price:180,amount:1,unit:'pack'},{en:'Cooked rice',ja:'ご飯',price:50,amount:250,unit:'g'},{en:'Soy sauce',ja:'醤油',price:5,amount:5,unit:'ml'}]},

  { id:22, mealType:'lunch', title:'Avocado Tuna Salad Bowl', titleJa:'アボカドツナサラダ', difficulty:'Easiest',
    prepTime:8, cookTime:0, servings:2, budget:350, calories:460,
    macros:{protein:18,carbs:42,fat:20}, equipment:['Bowl'], 
    steps:['Drain tuna, mix with mayo, soy sauce and lemon juice.','Slice avocado, fan over rice.','Top with tuna mix.','Add cucumber slices, sesame seeds and a drizzle of sesame oil.'],
    ingredients:[{en:'Canned tuna (2)',ja:'ツナ缶',price:160,amount:2,unit:'unit'},{en:'Avocado (1)',ja:'アボカド',price:120,amount:1,unit:'unit'},{en:'Mayonnaise',ja:'マヨネーズ',price:20,amount:20,unit:'g'},{en:'Cooked rice',ja:'ご飯',price:50,amount:250,unit:'g'}]},

  // ── DINNER ──────────────────────────────────────────────────
  { id:23, mealType:'dinner', title:'Chicken Teriyaki', titleJa:'鶏の照り焼き', difficulty:'Easy',
    prepTime:10, cookTime:15, servings:2, budget:480, calories:560,
    macros:{protein:36,carbs:45,fat:18}, equipment:['Frying pan'], 
    steps:['Score chicken thighs with knife for even cooking.','Pan-fry skin-side down 7 min until golden, flip 3 min.','Mix soy sauce, mirin, sugar and sake, pour over chicken.','Simmer until sauce thickens and coats the chicken.'],
    ingredients:[{en:'Chicken thighs (2)',ja:'鶏もも肉',price:280,amount:300,unit:'g'},{en:'Soy sauce',ja:'醤油',price:20,amount:40,unit:'ml'},{en:'Mirin',ja:'みりん',price:15,amount:30,unit:'ml'},{en:'Sugar',ja:'砂糖',price:5,amount:10,unit:'g'}]},

  { id:24, mealType:'dinner', title:'Pork & Cabbage Stir-fry', titleJa:'豚キャベツ炒め', difficulty:'Easy',
    prepTime:8, cookTime:10, servings:2, budget:380, calories:480,
    macros:{protein:24,carbs:20,fat:22}, equipment:['Wok or large pan'], 
    steps:['Cut cabbage into large chunks, slice pork thin.','High heat, stir-fry pork with garlic until browned.','Add cabbage, cook 2–3 min until slightly wilted.','Season with oyster sauce, soy sauce and sesame oil.'],
    ingredients:[{en:'Pork slices (koma)',ja:'豚こま切れ',price:200,amount:200,unit:'g'},{en:'Cabbage (quarter)',ja:'キャベツ',price:60,amount:250,unit:'g'},{en:'Garlic',ja:'にんにく',price:10,amount:1,unit:'unit'},{en:'Oyster sauce',ja:'オイスターソース',price:15,amount:20,unit:'ml'}]},

  { id:25, mealType:'dinner', title:'Miso Salmon', titleJa:'鮭の味噌焼き', difficulty:'Easy',
    prepTime:5, cookTime:15, servings:2, budget:520, calories:480,
    macros:{protein:38,carbs:18,fat:20}, equipment:['Frying pan or oven'], 
    steps:['Mix miso, mirin, sake and sugar into a paste.','Coat salmon fillets generously.','Pan-fry on medium 4 min each side, or bake 200°C 12 min.','Serve with steamed rice and a side of pickled daikon.'],
    ingredients:[{en:'Salmon fillets (2)',ja:'鮭の切り身',price:360,amount:2,unit:'unit'},{en:'Miso paste',ja:'味噌',price:30,amount:40,unit:'g'},{en:'Mirin',ja:'みりん',price:10,amount:20,unit:'ml'},{en:'Sugar',ja:'砂糖',price:5,amount:5,unit:'g'}]},

  { id:26, mealType:'dinner', title:'Nikujaga Stew', titleJa:'肉じゃが', difficulty:'Intermediate',
    prepTime:15, cookTime:30, servings:4, budget:680, calories:520,
    macros:{protein:20,carbs:55,fat:16}, equipment:['Pot'], 
    steps:['Sauté beef slices, add sliced onions until soft.','Add quartered potatoes and halved carrots.','Add dashi, soy sauce, mirin and sugar, bring to boil.','Simmer 20 min covered until potatoes are tender.'],
    ingredients:[{en:'Beef slices',ja:'牛こま切れ',price:280,amount:200,unit:'g'},{en:'Potato (3)',ja:'じゃがいも',price:80,amount:3,unit:'unit'},{en:'Onion (1)',ja:'玉ねぎ',price:30,amount:1,unit:'unit'},{en:'Carrot (1)',ja:'にんじん',price:30,amount:1,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:20,amount:40,unit:'ml'},{en:'Mirin',ja:'みりん',price:15,amount:30,unit:'ml'}]},

  { id:27, mealType:'dinner', title:'Nabe Hot Pot', titleJa:'鍋', difficulty:'Easy',
    prepTime:10, cookTime:20, servings:3, budget:720, calories:380,
    macros:{protein:28,carbs:30,fat:14}, equipment:['Large pot'], 
    steps:['Prepare dashi broth with soy sauce and mirin in a large pot.','Add tofu, napa cabbage, mushrooms and green onion.','Add chicken or pork slices, simmer until cooked through.','Dip in ponzu sauce to eat; add udon noodles at the end.'],
    ingredients:[{en:'Napa cabbage',ja:'白菜',price:80,amount:300,unit:'g'},{en:'Firm tofu',ja:'豆腐',price:80,amount:300,unit:'g'},{en:'Enoki mushrooms',ja:'えのき',price:80,amount:1,unit:'pack'},{en:'Chicken thigh',ja:'鶏もも肉',price:250,amount:200,unit:'g'},{en:'Ponzu sauce',ja:'ポン酢',price:60,amount:1,unit:'pack'}]},

  { id:28, mealType:'dinner', title:'Vegan Nabe', titleJa:'野菜鍋', difficulty:'Easy',
    prepTime:10, cookTime:20, servings:3, budget:480, calories:290,
    macros:{protein:14,carbs:35,fat:8}, equipment:['Large pot'], 
    steps:['Make kombu dashi: soak kombu in cold water 30 min, then heat.','Add napa cabbage, tofu, mushrooms, and daikon.','Season with soy sauce (tamari for GF) and a little salt.','Simmer gently 15 min until vegetables are tender.'],
    ingredients:[{en:'Napa cabbage',ja:'白菜',price:80,amount:300,unit:'g'},{en:'Firm tofu',ja:'豆腐',price:80,amount:300,unit:'g'},{en:'Mixed mushrooms',ja:'きのこミックス',price:100,amount:200,unit:'g'},{en:'Daikon (chunk)',ja:'大根',price:60,amount:200,unit:'g'},{en:'Kombu',ja:'昆布',price:30,amount:1,unit:'pack'}]},

  { id:29, mealType:'dinner', title:'Egg & Tomato Stir-fry', titleJa:'トマト卵炒め', difficulty:'Easy',
    prepTime:5, cookTime:8, servings:2, budget:200, calories:320,
    macros:{protein:14,carbs:18,fat:16}, equipment:['Pan'], 
    steps:['Beat 3 eggs with pinch of salt and sugar.','Scramble in oiled pan until just set, remove.','Fry wedged tomatoes 2 min with garlic.','Add eggs back, season with soy sauce and sesame oil.'],
    ingredients:[{en:'Eggs (3)',ja:'卵',price:60,amount:3,unit:'unit'},{en:'Tomatoes (2)',ja:'トマト',price:80,amount:2,unit:'unit'},{en:'Sesame oil',ja:'ごま油',price:8,amount:8,unit:'ml'}]},

  { id:30, mealType:'dinner', title:'Pasta Mentaiko', titleJa:'明太子パスタ', difficulty:'Easy',
    prepTime:5, cookTime:12, servings:2, budget:420, calories:560,
    macros:{protein:22,carbs:78,fat:14}, equipment:['Pot','Bowl'], 
    steps:['Boil pasta al dente, reserve 2 tbsp pasta water.','Mix mentaiko (cod roe) with butter, cream and soy sauce in a bowl.','Drain hot pasta and immediately toss in the raw sauce.','Add pasta water as needed, garnish with nori strips.'],
    ingredients:[{en:'Pasta (200g)',ja:'パスタ',price:80,amount:200,unit:'g'},{en:'Mentaiko (1 pack)',ja:'明太子',price:180,amount:1,unit:'pack'},{en:'Butter',ja:'バター',price:30,amount:20,unit:'g'},{en:'Soy sauce',ja:'醤油',price:5,amount:5,unit:'ml'}]},

  { id:31, mealType:'dinner', title:'Mapo Tofu', titleJa:'麻婆豆腐', difficulty:'Intermediate',
    prepTime:8, cookTime:15, servings:2, budget:380, calories:440,
    macros:{protein:22,carbs:28,fat:20}, equipment:['Wok or pan'], 
    steps:['Fry ground pork with doubanjiang paste until fragrant.','Add chicken stock and bring to boil.','Slide in silken tofu cubes, simmer 5 min without stirring.','Thicken with cornstarch slurry, finish with sesame oil and Sichuan pepper.'],
    ingredients:[{en:'Silken tofu (1 block)',ja:'絹豆腐',price:80,amount:300,unit:'g'},{en:'Ground pork',ja:'豚ひき肉',price:180,amount:150,unit:'g'},{en:'Doubanjiang sauce',ja:'豆板醤',price:30,amount:20,unit:'g'},{en:'Green onion',ja:'ねぎ',price:15,amount:20,unit:'g'}]},

  { id:32, mealType:'dinner', title:'Vegan Mapo Tofu', titleJa:'ヴィーガン麻婆豆腐', difficulty:'Intermediate',
    prepTime:8, cookTime:15, servings:2, budget:300, calories:340,
    macros:{protein:16,carbs:28,fat:14}, equipment:['Pan'], 
    steps:['Finely chop shiitake mushrooms as meat substitute.','Fry with doubanjiang and garlic until fragrant.','Add vegetable stock, bring to boil.','Add silken tofu, simmer 5 min, thicken with cornstarch.'],
    ingredients:[{en:'Silken tofu (1 block)',ja:'絹豆腐',price:80,amount:300,unit:'g'},{en:'Shiitake mushrooms',ja:'しいたけ',price:100,amount:100,unit:'g'},{en:'Doubanjiang',ja:'豆板醤',price:30,amount:20,unit:'g'}]},

  { id:33, mealType:'dinner', title:'Karaage Chicken', titleJa:'唐揚げ', difficulty:'Intermediate',
    prepTime:15, cookTime:15, servings:2, budget:480, calories:640,
    macros:{protein:34,carbs:30,fat:28}, equipment:['Deep pot or deep pan'], 
    steps:['Marinate bite-size chicken in soy sauce, sake, ginger and garlic 15 min.','Coat lightly in potato starch (katakuriko).','Deep fry at 170°C for 4 min, rest 2 min, fry again at 190°C for 1 min.','Serve with lemon wedge and kewpie mayo.'],
    ingredients:[{en:'Chicken thigh (large)',ja:'鶏もも肉',price:320,amount:350,unit:'g'},{en:'Potato starch',ja:'片栗粉',price:30,amount:40,unit:'g'},{en:'Soy sauce',ja:'醤油',price:15,amount:30,unit:'ml'},{en:'Ginger',ja:'生姜',price:20,amount:10,unit:'g'}]},

  { id:34, mealType:'dinner', title:'Saba Shioyaki (Grilled Mackerel)', titleJa:'サバの塩焼き', difficulty:'Easy',
    prepTime:5, cookTime:12, servings:2, budget:320, calories:440,
    macros:{protein:36,carbs:2,fat:24}, equipment:['Grill or frying pan'], 
    steps:['Score mackerel fillet skin with 2–3 diagonal cuts.','Salt generously, rest 10 min, pat dry.','Grill or pan-fry skin-side down 6 min, flip 4 min.','Serve with grated daikon, soy sauce and lemon.'],
    ingredients:[{en:'Mackerel fillet (2)',ja:'サバの切り身',price:240,amount:2,unit:'unit'},{en:'Salt',ja:'塩',price:5,amount:5,unit:'g'},{en:'Daikon for grating',ja:'大根',price:40,amount:100,unit:'g'}]},

  { id:35, mealType:'dinner', title:'Oyakodon', titleJa:'親子丼', difficulty:'Easy',
    prepTime:8, cookTime:12, servings:2, budget:380, calories:580,
    macros:{protein:32,carbs:62,fat:16}, equipment:['Small pan'], 
    steps:['Simmer sliced chicken in dashi, soy sauce and mirin 5 min.','Beat eggs, pour over chicken in circular motion.','Cover and cook 1 min — eggs should be just set and creamy.','Slide over rice, garnish with mitsuba or green onion.'],
    ingredients:[{en:'Chicken thigh',ja:'鶏もも肉',price:200,amount:200,unit:'g'},{en:'Eggs (3)',ja:'卵',price:60,amount:3,unit:'unit'},{en:'Onion (half)',ja:'玉ねぎ',price:20,amount:0.5,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:15,amount:30,unit:'ml'},{en:'Mirin',ja:'みりん',price:10,amount:20,unit:'ml'}]},

  { id:36, mealType:'dinner', title:'Kimchi Fried Rice', titleJa:'キムチチャーハン', difficulty:'Easy',
    prepTime:5, cookTime:10, servings:2, budget:280, calories:490,
    macros:{protein:14,carbs:66,fat:12}, equipment:['Wok or pan'], 
    steps:['Fry chopped kimchi in sesame oil until fragrant.','Add cold cooked rice, break up and stir-fry on high heat.','Season with soy sauce and gochujang if available.','Top with fried egg and sesame seeds.'],
    ingredients:[{en:'Kimchi',ja:'キムチ',price:80,amount:100,unit:'g'},{en:'Cooked rice',ja:'ご飯',price:60,amount:400,unit:'g'},{en:'Egg (2)',ja:'卵',price:40,amount:2,unit:'unit'},{en:'Sesame oil',ja:'ごま油',price:8,amount:8,unit:'ml'}]},

  { id:37, mealType:'dinner', title:'Yaki Udon', titleJa:'焼きうどん', difficulty:'Easy',
    prepTime:5, cookTime:10, servings:2, budget:340, calories:510,
    macros:{protein:18,carbs:72,fat:10}, equipment:['Large pan'], 
    steps:['Pan-fry pork slices until cooked.','Add cabbage and bean sprouts, stir-fry 2 min.','Add thawed udon noodles, break apart.','Season with soy sauce, oyster sauce and sesame oil.'],
    ingredients:[{en:'Frozen udon (2 packs)',ja:'冷凍うどん',price:100,amount:2,unit:'pack'},{en:'Pork slices',ja:'豚こま切れ',price:150,amount:150,unit:'g'},{en:'Cabbage',ja:'キャベツ',price:50,amount:150,unit:'g'},{en:'Bean sprouts',ja:'もやし',price:38,amount:150,unit:'g'}]},

  { id:38, mealType:'dinner', title:'Spinach Gomaae', titleJa:'ほうれん草の胡麻和え', difficulty:'Easy',
    prepTime:5, cookTime:5, servings:2, budget:180, calories:160,
    macros:{protein:8,carbs:14,fat:8}, equipment:['Pot','Bowl'], 
    steps:['Blanch spinach 1 minute, drain and squeeze out ALL water.','Cut into 5cm pieces.','Mix toasted sesame paste, soy sauce, sugar and mirin for dressing.','Toss spinach in dressing, serve chilled.'],
    ingredients:[{en:'Spinach (1 bag)',ja:'ほうれん草',price:100,amount:200,unit:'g'},{en:'Sesame paste/tahini',ja:'ねりごま',price:30,amount:20,unit:'g'},{en:'Soy sauce',ja:'醤油',price:10,amount:15,unit:'ml'},{en:'Sugar',ja:'砂糖',price:5,amount:5,unit:'g'}]},

  { id:39, mealType:'dinner', title:'Tofu Steak', titleJa:'豆腐ステーキ', difficulty:'Easy',
    prepTime:5, cookTime:12, servings:2, budget:220, calories:280,
    macros:{protein:16,carbs:12,fat:14}, equipment:['Frying pan'], 
    steps:['Press firm tofu dry with paper towels, slice into thick slabs.','Pan-fry in sesame oil until both sides are golden and crispy.','Mix soy sauce, mirin, and grated ginger for sauce.','Pour sauce over hot tofu, garnish with green onion and sesame.'],
    ingredients:[{en:'Firm tofu (1 block)',ja:'木綿豆腐',price:80,amount:300,unit:'g'},{en:'Sesame oil',ja:'ごま油',price:10,amount:10,unit:'ml'},{en:'Soy sauce',ja:'醤油',price:15,amount:25,unit:'ml'},{en:'Ginger',ja:'生姜',price:15,amount:8,unit:'g'}]},

  { id:40, mealType:'dinner', title:'High-Protein Egg Fried Tofu', titleJa:'卵豆腐炒め', difficulty:'Easy',
    prepTime:8, cookTime:12, servings:2, budget:260, calories:380,
    macros:{protein:28,carbs:14,fat:20}, equipment:['Pan'], 
    steps:['Crumble firm tofu into rough chunks.','Beat 3 eggs with soy sauce.','Pan-fry tofu until slightly crispy.','Pour eggs over, fold together, season and serve over rice.'],
    ingredients:[{en:'Firm tofu (1 block)',ja:'木綿豆腐',price:80,amount:300,unit:'g'},{en:'Eggs (3)',ja:'卵',price:60,amount:3,unit:'unit'},{en:'Soy sauce',ja:'醤油',price:10,amount:15,unit:'ml'},{en:'Sesame oil',ja:'ごま油',price:8,amount:8,unit:'ml'}]},
];

const EMOJI = {"1":"🍚","2":"🥣","3":"🍞","4":"🫘","5":"🥣","6":"🥛","7":"🍙","8":"🫛","9":"🧀","10":"🥟","11":"🍎","12":"🍡","13":"🍜","14":"🍛","15":"🍛","16":"🥩","17":"🥢","18":"🍳","19":"🍜","20":"🥬","21":"🐟","22":"🥑","23":"🍗","24":"🥬","25":"🐟","26":"🥔","27":"🍲","28":"🍲","29":"🍅","30":"🍝","31":"🌶️","32":"🍄","33":"🍗","34":"🐟","35":"🍳","36":"🍚","37":"🍜","38":"🥬","39":"⬜","40":"🍳"};
for (const r of RECIPES) { r.emoji = EMOJI[r.id] || "🍽️"; r.source = "library"; }
