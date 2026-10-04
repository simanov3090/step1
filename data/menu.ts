export type MenuCategory =
  | "Филадельфия"
  | "Запечённые"
  | "Темпура"
  | "Классические"
  | "Суши"
  | "Сеты"
  | "Острые";

export type MenuProduct = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  new?: boolean;
};

export type MenuIngredient = { name: string; grams: number };

export type MenuProductDetails = {
  pieces: number;
  weight: number;
  ingredients: MenuIngredient[];
  story: string;
};

export const menuCategories = [
  "Все",
  "Филадельфия",
  "Запечённые",
  "Темпура",
  "Классические",
  "Суши",
  "Сеты",
  "Острые",
] as const;

export type MenuFilter = (typeof menuCategories)[number];

export const menu: MenuProduct[] = [
  { id: "philly-classic", name: "Филадельфия Classic", category: "Филадельфия", description: "Лосось · сливочный сыр · огурец", price: 690, image: "photo-1579871494447-9811cf80d66c", popular: true },
  { id: "philly-premium", name: "Филадельфия Premium", category: "Филадельфия", description: "Лосось · авокадо · сливочный сыр", price: 790, image: "photo-1729698597384-d218328dc3a9", popular: true },
  { id: "philly-eel", name: "Филадельфия с угрём", category: "Филадельфия", description: "Угорь · лосось · сливочный сыр", price: 850, image: "photo-1534604973900-c43ab4c2e0ab" },
  { id: "baked-salmon", name: "Запечённый лосось", category: "Запечённые", description: "Лосось · сырный соус · огурец", price: 620, image: "photo-1729698597333-358449c1d0e8" },
  { id: "baked-shrimp", name: "Запечённая креветка", category: "Запечённые", description: "Креветка · сливочный сыр · спайси", price: 650, image: "photo-1611143669185-af224c5e3252" },
  { id: "baked-eel", name: "Запечённый угорь", category: "Запечённые", description: "Угорь · сырный соус · унаги", price: 720, image: "photo-1617196034796-73dfa7b1fd56" },
  { id: "tempura-salmon", name: "Темпура Лосось", category: "Темпура", description: "Лосось · хрустящий кляр · соус понзу", price: 590, image: "photo-1553621042-f6e147245754" },
  { id: "tempura-shrimp", name: "Темпура Креветка", category: "Темпура", description: "Креветка · авокадо · соус манго", price: 610, image: "photo-1617196034796-73dfa7b1fd56" },
  { id: "tempura-eel", name: "Темпура Угорь", category: "Темпура", description: "Угорь · огурец · кунжут", price: 650, image: "photo-1534604973900-c43ab4c2e0ab" },
  { id: "california", name: "Калифорния", category: "Классические", description: "Краб · авокадо · тобико", price: 560, image: "photo-1611143669185-af224c5e3252", popular: true },
  { id: "canada", name: "Канада", category: "Классические", description: "Угорь · лосось · сливочный сыр", price: 720, image: "photo-1579871494447-9811cf80d66c" },
  { id: "dragon", name: "Дракон", category: "Классические", description: "Угорь · авокадо · соус унаги", price: 760, image: "photo-1617196034796-73dfa7b1fd56", new: true },
  { id: "nigiri-salmon", name: "Нигири Лосось", category: "Суши", description: "Лосось · рис · 2 шт.", price: 190, image: "photo-1553621042-f6e147245754" },
  { id: "nigiri-eel", name: "Нигири Угорь", category: "Суши", description: "Угорь · рис · унаги · 2 шт.", price: 220, image: "photo-1579584425555-c3ce17fd4351" },
  { id: "nigiri-shrimp", name: "Нигири Креветка", category: "Суши", description: "Тигровая креветка · рис · 2 шт.", price: 210, image: "photo-1611143669185-af224c5e3252" },
  { id: "set-vkusno", name: "Сет «Вкусно»", category: "Сеты", description: "Филадельфия · Калифорния · маки · 32 шт.", price: 1990, image: "photo-1611143669185-af224c5e3252", popular: true },
  { id: "set-ocean", name: "Сет «Океан»", category: "Сеты", description: "Лосось · угорь · креветка · 40 шт.", price: 2490, image: "photo-1579871494447-9811cf80d66c" },
  { id: "set-company", name: "Сет «Компания»", category: "Сеты", description: "6 любимых роллов · 56 шт.", price: 3490, image: "photo-1553621042-f6e147245754" },
  { id: "spicy-salmon", name: "Spicy Salmon", category: "Острые", description: "Лосось · спайси-соус · зелёный лук", price: 590, image: "photo-1579584425555-c3ce17fd4351" },
  { id: "spicy-tuna", name: "Spicy Tuna", category: "Острые", description: "Тунец · кимчи · хрустящий рис", price: 620, image: "photo-1617196034796-73dfa7b1fd56" },
  { id: "spicy-ebi", name: "Spicy Ebi", category: "Острые", description: "Креветка · авокадо · острый айоли", price: 610, image: "photo-1611143669185-af224c5e3252" },
  { id: "philly-mango", name: "Филадельфия с манго", category: "Филадельфия", description: "Лосось · манго · сливочный сыр", price: 820, image: "photo-1729698597333-358449c1d0e8", new: true },
  { id: "philly-shrimp", name: "Филадельфия с креветкой", category: "Филадельфия", description: "Лосось · креветка · сливочный сыр", price: 850, image: "photo-1534604973900-c43ab4c2e0ab" },
  { id: "baked-crab", name: "Запечённый краб", category: "Запечённые", description: "Краб · сырный мусс · унаги", price: 680, image: "photo-1611143669185-af224c5e3252" },
  { id: "tempura-ebi", name: "Темпура Эби", category: "Темпура", description: "Креветка · авокадо · хрустящий кляр", price: 670, image: "photo-1534604973900-c43ab4c2e0ab" },
  { id: "tuna-maki", name: "Маки с тунцом", category: "Классические", description: "Тунец · рис · нори", price: 460, image: "photo-1553621042-f6e147245754" },
  { id: "nigiri-tuna", name: "Нигири Тунец", category: "Суши", description: "Тунец · рис · 2 шт.", price: 230, image: "photo-1729698597384-d218328dc3a9" },
  { id: "set-warm", name: "Сет «Тёплый»", category: "Сеты", description: "Запечённый лосось · эби темпура · 24 шт.", price: 1790, image: "photo-1534604973900-c43ab4c2e0ab", new: true },
  { id: "spicy-crab", name: "Spicy Crab", category: "Острые", description: "Краб · острый айоли · зелёный лук", price: 640, image: "photo-1729698597333-358449c1d0e8" },
];

export const menuDetails: Record<string, MenuProductDetails> = {
  "philly-classic": {
    pieces: 8, weight: 280,
    ingredients: [{ name: "Лосось", grams: 95 }, { name: "Рис", grams: 115 }, { name: "Сливочный сыр", grams: 45 }, { name: "Огурец", grams: 20 }, { name: "Нори", grams: 5 }],
    story: "Мягкий сливочный сыр, прохладный огурец и лосось с чистым морским вкусом. Классика, в которой важен баланс каждого слоя.",
  },
  "philly-premium": {
    pieces: 8, weight: 300,
    ingredients: [{ name: "Лосось", grams: 110 }, { name: "Рис", grams: 115 }, { name: "Сливочный сыр", grams: 45 }, { name: "Авокадо", grams: 25 }, { name: "Нори", grams: 5 }],
    story: "Больше лосося и спелый авокадо делают вкус особенно нежным. Ролл для тех, кто выбирает щедрую подачу.",
  },
  "philly-eel": {
    pieces: 8, weight: 290,
    ingredients: [{ name: "Угорь", grams: 55 }, { name: "Лосось", grams: 50 }, { name: "Рис", grams: 125 }, { name: "Сливочный сыр", grams: 45 }, { name: "Огурец", grams: 10 }, { name: "Нори", grams: 5 }],
    story: "Два выразительных вкуса встречаются в одном ролле: сладковатый угорь и нежный лосось смягчает сливочный сыр.",
  },
  "baked-salmon": {
    pieces: 8, weight: 300,
    ingredients: [{ name: "Рис", grams: 120 }, { name: "Лосось", grams: 75 }, { name: "Сливочный сыр", grams: 35 }, { name: "Огурец", grams: 15 }, { name: "Запечённый соус", grams: 50 }, { name: "Нори", grams: 5 }],
    story: "Запечённая шапочка добавляет тёплую сливочную ноту, а лосось и огурец сохраняют свежий характер ролла.",
  },
  "baked-shrimp": {
    pieces: 8, weight: 290,
    ingredients: [{ name: "Рис", grams: 120 }, { name: "Креветка", grams: 60 }, { name: "Сливочный сыр", grams: 40 }, { name: "Огурец", grams: 15 }, { name: "Спайси-соус", grams: 50 }, { name: "Нори", grams: 5 }],
    story: "Сочная креветка, мягкий сыр и пикантный соус раскрываются после запекания — ароматно, но без лишней тяжести.",
  },
  "baked-eel": {
    pieces: 8, weight: 300,
    ingredients: [{ name: "Рис", grams: 120 }, { name: "Угорь", grams: 65 }, { name: "Сливочный соус", grams: 45 }, { name: "Соус унаги", grams: 20 }, { name: "Сливочный сыр", grams: 35 }, { name: "Нори и кунжут", grams: 15 }],
    story: "Глубокий вкус угря и карамельная нота унаги соединяются с нежной запечённой текстурой.",
  },
  "tempura-salmon": {
    pieces: 8, weight: 270,
    ingredients: [{ name: "Рис", grams: 130 }, { name: "Лосось", grams: 65 }, { name: "Огурец", grams: 20 }, { name: "Кляр", grams: 35 }, { name: "Соус понзу", grams: 15 }, { name: "Нори", grams: 5 }],
    story: "Тонкий хрустящий кляр встречается с нежным лососем. Понзу добавляет лёгкую цитрусовую свежесть.",
  },
  "tempura-shrimp": {
    pieces: 8, weight: 275,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Креветка", grams: 60 }, { name: "Сливочный сыр", grams: 25 }, { name: "Авокадо", grams: 20 }, { name: "Кляр", grams: 30 }, { name: "Соус манго", grams: 10 }, { name: "Нори", grams: 5 }],
    story: "Хрустящая креветка и бархатный авокадо уравновешены сладко-кислым соусом манго.",
  },
  "tempura-eel": {
    pieces: 8, weight: 275,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Угорь", grams: 55 }, { name: "Огурец", grams: 20 }, { name: "Кляр", grams: 35 }, { name: "Соус унаги", grams: 25 }, { name: "Нори и кунжут", grams: 15 }],
    story: "Тёплый угорь, тонкая хрустящая оболочка и сладковатый унаги — выразительный ролл с длинным послевкусием.",
  },
  california: {
    pieces: 8, weight: 250,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Снежный краб", grams: 45 }, { name: "Авокадо", grams: 25 }, { name: "Огурец", grams: 15 }, { name: "Тобико", grams: 25 }, { name: "Нори и кунжут", grams: 15 }],
    story: "Нежный краб, спелый авокадо и хрустящие икринки тобико создают знакомую, свежую классику.",
  },
  canada: {
    pieces: 8, weight: 280,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Угорь", grams: 45 }, { name: "Лосось", grams: 45 }, { name: "Сливочный сыр", grams: 40 }, { name: "Огурец", grams: 15 }, { name: "Нори и унаги", grams: 10 }],
    story: "Сливочный центр, свежий лосось и угорь с соусом унаги — насыщенная классика в мягком балансе.",
  },
  dragon: {
    pieces: 8, weight: 290,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Угорь", grams: 55 }, { name: "Креветка", grams: 25 }, { name: "Авокадо", grams: 35 }, { name: "Огурец", grams: 20 }, { name: "Соус унаги", grams: 20 }, { name: "Нори и кунжут", grams: 10 }],
    story: "Угорь и авокадо задают мягкую основу, креветка добавляет плотность, а унаги собирает вкус в единое целое.",
  },
  "nigiri-salmon": {
    pieces: 2, weight: 70,
    ingredients: [{ name: "Лосось", grams: 27 }, { name: "Рис", grams: 42 }, { name: "Васаби", grams: 1 }],
    story: "Тонкий ломтик свежего лосося лежит на слегка тёплом рисе. Ничего лишнего — только вкус рыбы и риса.",
  },
  "nigiri-eel": {
    pieces: 2, weight: 75,
    ingredients: [{ name: "Угорь", grams: 27 }, { name: "Рис", grams: 44 }, { name: "Унаги", grams: 3 }, { name: "Васаби", grams: 1 }],
    story: "Мягкий угорь с тонкой глазурью унаги на рисе ручной формовки — лаконичная пара с глубоким вкусом.",
  },
  "nigiri-shrimp": {
    pieces: 2, weight: 70,
    ingredients: [{ name: "Креветка", grams: 24 }, { name: "Рис", grams: 44 }, { name: "Васаби", grams: 2 }],
    story: "Упругая тигровая креветка и мягкий рис создают чистый, деликатный вкус.",
  },
  "set-vkusno": {
    pieces: 32, weight: 1100,
    ingredients: [{ name: "Филадельфия · 8 шт.", grams: 280 }, { name: "Калифорния · 8 шт.", grams: 250 }, { name: "Темпура с креветкой · 8 шт.", grams: 275 }, { name: "Запечённый лосось · 8 шт.", grams: 295 }],
    story: "Собрали в одном сете четыре характера: сливочный, свежий, хрустящий и тёплый. Удобный выбор для двоих.",
  },
  "set-ocean": {
    pieces: 40, weight: 1400,
    ingredients: [{ name: "Филадельфия · 8 шт.", grams: 280 }, { name: "Канада · 8 шт.", grams: 280 }, { name: "Дракон · 8 шт.", grams: 290 }, { name: "Темпура с креветкой · 8 шт.", grams: 275 }, { name: "Запечённый лосось · 8 шт.", grams: 275 }],
    story: "Пять роллов с лососем, угрём и креветкой — большое знакомство с морской частью нашего меню.",
  },
  "set-company": {
    pieces: 56, weight: 1960,
    ingredients: [{ name: "Филадельфия · 16 шт.", grams: 560 }, { name: "Калифорния · 8 шт.", grams: 250 }, { name: "Канада · 8 шт.", grams: 280 }, { name: "Темпура с креветкой · 8 шт.", grams: 275 }, { name: "Запечённый лосось · 8 шт.", grams: 295 }, { name: "Маки с угрём · 8 шт.", grams: 300 }],
    story: "Большой сет для общего стола: узнаваемые роллы, разные текстуры и достаточно выбора для компании.",
  },
  "spicy-salmon": {
    pieces: 8, weight: 270,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Лосось", grams: 70 }, { name: "Сливочный сыр", grams: 25 }, { name: "Спайси-соус", grams: 25 }, { name: "Огурец", grams: 15 }, { name: "Нори и кунжут", grams: 10 }],
    story: "Нежный лосось встречается с ярким спайси-соусом. Огурец освежает вкус и оставляет его лёгким.",
  },
  "spicy-tuna": {
    pieces: 8, weight: 270,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Тунец", grams: 65 }, { name: "Сливочный сыр", grams: 20 }, { name: "Кимчи", grams: 20 }, { name: "Огурец", grams: 20 }, { name: "Спайси-соус и нори", grams: 20 }],
    story: "Плотный тунец, острая кимчи и сливочный сыр дают выразительный, но собранный вкус.",
  },
  "spicy-ebi": {
    pieces: 8, weight: 270,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Креветка", grams: 65 }, { name: "Авокадо", grams: 25 }, { name: "Сливочный сыр", grams: 20 }, { name: "Огурец", grams: 20 }, { name: "Спайси-соус и нори", grams: 15 }],
    story: "Креветка и авокадо смягчают остроту айоли. Вкус получается сливочным, свежим и с лёгким жаром.",
  },
  "philly-mango": {
    pieces: 8, weight: 290,
    ingredients: [{ name: "Рис", grams: 115 }, { name: "Лосось", grams: 95 }, { name: "Сливочный сыр", grams: 45 }, { name: "Манго", grams: 30 }, { name: "Нори", grams: 5 }],
    story: "Сладкое спелое манго подчёркивает нежность лосося и добавляет классической Филадельфии солнечную фруктовую ноту.",
  },
  "philly-shrimp": {
    pieces: 8, weight: 300,
    ingredients: [{ name: "Рис", grams: 115 }, { name: "Лосось", grams: 85 }, { name: "Креветка", grams: 45 }, { name: "Сливочный сыр", grams: 45 }, { name: "Огурец", grams: 5 }, { name: "Нори", grams: 5 }],
    story: "Лосось снаружи, креветка внутри: два морских вкуса соединяются мягкой сливочной серединой.",
  },
  "baked-crab": {
    pieces: 8, weight: 290,
    ingredients: [{ name: "Рис", grams: 120 }, { name: "Краб", grams: 55 }, { name: "Сливочный сыр", grams: 35 }, { name: "Сырный мусс", grams: 45 }, { name: "Унаги", grams: 25 }, { name: "Нори", grams: 10 }],
    story: "Нежный краб и воздушный сырный мусс запекаются до золотистой шапочки; унаги добавляет карамельный штрих.",
  },
  "tempura-ebi": {
    pieces: 8, weight: 280,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Креветка", grams: 70 }, { name: "Авокадо", grams: 30 }, { name: "Кляр", grams: 35 }, { name: "Соус понзу", grams: 15 }, { name: "Нори", grams: 5 }],
    story: "Золотистая креветка темпура, сливочный авокадо и лёгкий понзу — контраст текстур в каждом кусочке.",
  },
  "tuna-maki": {
    pieces: 6, weight: 170,
    ingredients: [{ name: "Рис", grams: 115 }, { name: "Тунец", grams: 45 }, { name: "Нори", grams: 10 }],
    story: "Минималистичный маки с плотным тунцом. Чистый вкус рыбы, риса и листа нори.",
  },
  "nigiri-tuna": {
    pieces: 2, weight: 72,
    ingredients: [{ name: "Тунец", grams: 28 }, { name: "Рис", grams: 43 }, { name: "Васаби", grams: 1 }],
    story: "Свежий тунец с деликатной текстурой на тёплом рисе ручной формовки.",
  },
  "set-warm": {
    pieces: 24, weight: 820,
    ingredients: [{ name: "Запечённый лосось · 8 шт.", grams: 300 }, { name: "Эби темпура · 8 шт.", grams: 280 }, { name: "Запечённый краб · 8 шт.", grams: 240 }],
    story: "Три тёплых ролла с запечённой шапочкой и хрустящей креветкой — согревающий сет для уютного вечера.",
  },
  "spicy-crab": {
    pieces: 8, weight: 275,
    ingredients: [{ name: "Рис", grams: 125 }, { name: "Краб", grams: 65 }, { name: "Сливочный сыр", grams: 30 }, { name: "Огурец", grams: 20 }, { name: "Острый айоли", grams: 25 }, { name: "Нори и зелёный лук", grams: 10 }],
    story: "Сладковатый краб встречается с пряным айоли, а зелёный лук добавляет свежий аромат.",
  },
};

export function formatPrice(price: number) {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function menuPhoto(image: string, width = 900) {
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`;
}