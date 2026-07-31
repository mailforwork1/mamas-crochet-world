import type { Product } from "./components/ProductCard";

/* ---------- IMAGE POOL ----------
   AI-generated (our own):  /images/*
   Stock (Pexels CDN):      https://images.pexels.com/... */

const IMG = {
  hero: "/images/hero.jpg",
  clock: "/images/wall-clock.jpg",
  sunflower: "/images/sunflower-art.jpg",
  strawberry: "/images/strawberry-basket.jpg",
  bottles: "/images/bottle-covers.jpg",
  clips: "/images/hair-clips.jpg",
  cake: "/images/cake-box.jpg",
  cardigan: "/images/cardigan.jpg",
  hands: "/images/story.jpg",
  roses: "/images/flowers.jpg",
  bear: "https://images.pexels.com/photos/37328223/pexels-photo-37328223.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  pinkTeddy: "https://images.pexels.com/photos/12109904/pexels-photo-12109904.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  purpleBear: "https://images.pexels.com/photos/7738663/pexels-photo-7738663.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  catToy: "https://images.pexels.com/photos/14852081/pexels-photo-14852081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  cupYarn: "https://images.pexels.com/photos/29242759/pexels-photo-29242759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  yarnHook: "https://images.pexels.com/photos/7156841/pexels-photo-7156841.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  yarnCircle: "https://images.pexels.com/photos/7297165/pexels-photo-7297165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  driedBouquet: "https://images.pexels.com/photos/1214202/pexels-photo-1214202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  yellowBouquet: "https://images.pexels.com/photos/7467236/pexels-photo-7467236.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  yellowCrochet: "https://images.pexels.com/photos/7177578/pexels-photo-7177578.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  colorBlanket: "https://images.pexels.com/photos/6462892/pexels-photo-6462892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  tealBlanket: "https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bluePattern: "https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  cushions: "https://images.pexels.com/photos/9290601/pexels-photo-9290601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  cozyCorner: "https://images.pexels.com/photos/4451667/pexels-photo-4451667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  greenPillow: "https://images.pexels.com/photos/4155251/pexels-photo-4155251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  handbag: "https://images.pexels.com/photos/3808229/pexels-photo-3808229.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  letters: "https://images.pexels.com/photos/7784602/pexels-photo-7784602.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  paperCraft: "https://images.pexels.com/photos/11082996/pexels-photo-11082996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  valentine: "https://images.pexels.com/photos/11118086/pexels-photo-11118086.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  helloFrame: "https://images.pexels.com/photos/1214205/pexels-photo-1214205.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export type ProductDetail = Product & {
  category: string;         // Top-level (e.g. "Keychains & Charms")
  categorySlug: string;     // e.g. "keychains"
  subcategory?: string;     // e.g. "Cartoon & Anime Characters"
  tagline?: string;
  description?: string;
  details?: string[];
  care?: string[];
  materials?: string;
  dimensions?: string;
  gallery?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
};

/* Small helper to reduce boilerplate */
const p = (
  id: string,
  name: string,
  price: number,
  image: string,
  category: string,
  categorySlug: string,
  subcategory: string,
  extras: Partial<ProductDetail> = {}
): ProductDetail => ({
  id,
  name,
  price,
  image,
  category,
  categorySlug,
  subcategory,
  rating: 5,
  reviews: 20 + Math.floor(Math.random() * 200),
  tagline: extras.tagline,
  description:
    extras.description ??
    `A hand-loomed ${name.toLowerCase()} from our cottage studio, stitched one loop at a time with natural fibres and finished with a small maker's tag.`,
  details: extras.details ?? [
    "Hand-crocheted in small batches",
    "100% natural cotton yarn",
    "Wrapped in tissue with a wax-sealed note",
    "Signed by the maker",
  ],
  care: extras.care ?? [
    "Spot clean with cool water & mild soap",
    "Lay flat to dry, reshape gently",
  ],
  materials: extras.materials ?? "100% cotton yarn, cotton stuffing",
  dimensions: extras.dimensions ?? "Approx. 8–14cm",
  gallery: extras.gallery ?? [image, IMG.hands, IMG.yarnHook],
  colors: extras.colors,
  sizes: extras.sizes,
  badge: extras.badge,
});

/* ==================================================================
   1 · POUCHES & MINI ORGANIZERS
   ================================================================== */
const pouches: ProductDetail[] = [
  p("po-cow", "Cow Mini Pouch", 1200, IMG.pinkTeddy, "Pouches & Mini Organizers", "pouches", "Animal & Character Pouches", { badge: "New" }),
  p("po-cat", "Kitty Cat Pouch", 1200, IMG.catToy, "Pouches & Mini Organizers", "pouches", "Animal & Character Pouches"),
  p("po-bear", "Little Bear Pouch", 1400, IMG.bear, "Pouches & Mini Organizers", "pouches", "Animal & Character Pouches", { badge: "Bestseller" }),
  p("po-frog", "Frog Prince Pouch", 1200, IMG.yellowCrochet, "Pouches & Mini Organizers", "pouches", "Animal & Character Pouches"),
  p("po-tiger", "Tiger Cub Pouch", 1400, IMG.strawberry, "Pouches & Mini Organizers", "pouches", "Animal & Character Pouches"),
  p("po-earbuds", "Earbuds Cosy Pouch", 800, IMG.cake, "Pouches & Mini Organizers", "pouches", "Functional, Tech & Everyday", { badge: "New" }),
  p("po-mock", "Mockup Everyday Pouch", 1000, IMG.bottles, "Pouches & Mini Organizers", "pouches", "Functional, Tech & Everyday"),
  p("po-general", "Petit Pouch (Standard)", 900, IMG.clips, "Pouches & Mini Organizers", "pouches", "Functional, Tech & Everyday"),
  p("po-key", "Pouch Keychain Duo", 600, IMG.clips, "Pouches & Mini Organizers", "pouches", "Functional, Tech & Everyday"),
];

/* ==================================================================
   2 · KEYCHAINS & CHARMS
   ================================================================== */
const keychains: ProductDetail[] = [
  // Cartoon / Anime
  p("kc-minion", "Minion Charm Keychain", 400, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Cartoon & Anime Characters", { badge: "New" }),
  p("kc-spider", "Spider-Man Charm Keychain", 400, IMG.strawberry, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-pika", "Pikachu Charm Keychain", 400, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Cartoon & Anime Characters", { badge: "Bestseller" }),
  p("kc-po", "Po (Kung Fu Panda) Charm", 500, IMG.bear, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-sponge", "SpongeBob Charm Keychain", 400, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-turtles", "Ninja Turtles Charm Set", 900, IMG.tealBlanket, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-sonic", "Sonic Charm Keychain", 400, IMG.bluePattern, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-hk", "Hello Kitty Charm Keychain", 400, IMG.pinkTeddy, "Keychains & Charms", "keychains", "Cartoon & Anime Characters", { badge: "Bestseller" }),
  p("kc-pooh", "Pooh Bear Charm", 400, IMG.bear, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-mickey", "Mickey Mouse Charm", 400, IMG.catToy, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-patrick", "Patrick Star Charm", 400, IMG.pinkTeddy, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-toothless", "Night Fury Toothless Charm", 500, IMG.bluePattern, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),
  p("kc-angry", "Angry Bird Charm", 400, IMG.strawberry, "Keychains & Charms", "keychains", "Cartoon & Anime Characters"),

  // Animals & Birds
  p("kc-hen", "Little Hen Charm", 350, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-bunny", "Bunny Rabbit Charm", 350, IMG.purpleBear, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-panda", "Panda Charm Keychain", 400, IMG.bear, "Keychains & Charms", "keychains", "Animals, Insects & Birds", { badge: "New" }),
  p("kc-parrot", "Parrot Charm Keychain", 400, IMG.colorBlanket, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-penguin", "Penguin Charm Keychain", 400, IMG.catToy, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-chicks", "Baby Chicks Charm Set", 550, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-dog", "Little Dog Charm", 400, IMG.bear, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-cat", "Little Cat Charm", 400, IMG.catToy, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-owl", "Owl Charm Keychain", 400, IMG.purpleBear, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-teddy", "Teddy Bear Charm", 400, IMG.bear, "Keychains & Charms", "keychains", "Animals, Insects & Birds", { badge: "Bestseller" }),
  p("kc-mochi", "Mochi Cat Charm", 400, IMG.pinkTeddy, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-butterfly", "Butterfly Charm", 350, IMG.colorBlanket, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-frog", "Little Frog Charm", 350, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-lizard", "Tiny Lizard Charm", 350, IMG.tealBlanket, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-bee", "Honeybee Charm", 350, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),
  p("kc-ladybug", "Ladybug Charm", 350, IMG.strawberry, "Keychains & Charms", "keychains", "Animals, Insects & Birds"),

  // Sea creatures
  p("kc-fish", "Little Fish Charm", 350, IMG.bluePattern, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-octopus", "Octopus Charm", 400, IMG.pinkTeddy, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic", { badge: "New" }),
  p("kc-jelly", "Jellyfish Charm", 400, IMG.purpleBear, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-starfish", "Starfish Charm", 350, IMG.strawberry, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-turtle", "Sea Turtle Charm", 400, IMG.tealBlanket, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-whale", "Little Whale Charm", 400, IMG.bluePattern, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-dolphin", "Dolphin Charm", 400, IMG.bluePattern, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-shark", "Baby Shark Charm", 400, IMG.tealBlanket, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-snail", "Rainbow Snail Charm", 350, IMG.colorBlanket, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-crab", "Little Crab Charm", 350, IMG.strawberry, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),
  p("kc-puffer", "Pufferfish Charm", 400, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Sea Creatures & Aquatic"),

  // Food & novelty
  p("kc-apple", "Apple Miniature Charm", 300, IMG.strawberry, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-pineapple", "Pineapple Charm", 350, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-banana", "Banana Charm", 300, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-cherry", "Cherry Duo Charm", 350, IMG.strawberry, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-grapes", "Grapes Charm", 350, IMG.purpleBear, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-berry", "Strawberry Charm", 300, IMG.strawberry, "Keychains & Charms", "keychains", "Food, Plants & Novelty", { badge: "Bestseller" }),
  p("kc-orange", "Orange Slice Charm", 300, IMG.strawberry, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-oreo", "Oreo Biscuit Charm", 350, IMG.bear, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-icecream", "Ice Cream Cone Charm", 400, IMG.cake, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-cupcake", "Cupcake Charm", 400, IMG.cake, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-donut", "Sprinkle Donut Charm", 400, IMG.cake, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-cola", "Coca-Cola Charm", 400, IMG.strawberry, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-bagpack", "Mini Backpack Charm", 500, IMG.handbag, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-carkey", "Car Key Cover Charm", 500, IMG.handbag, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-star", "Little Star Charm", 300, IMG.sunflower, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-badminton", "Badminton Racket Charm", 400, IMG.bluePattern, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-cactus", "Cactus Charm", 350, IMG.tealBlanket, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-mushroom", "Mushroom Charm", 350, IMG.strawberry, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
  p("kc-beermug", "Beer Mug Charm", 400, IMG.yellowCrochet, "Keychains & Charms", "keychains", "Food, Plants & Novelty"),
];

/* ==================================================================
   3 · HOME DECOR & ACCENTS
   ================================================================== */
const homeDecor: ProductDetail[] = [
  p("hd-clock", "Rosalie Floral-Frame Wall Clock", 3100, IMG.clock, "Home Decor & Accents", "home-decor", "Wall Decor & Timepieces", { badge: "Bestseller" }),
  p("hd-clock-frame", "Cottage Clock Frame", 2300, IMG.clock, "Home Decor & Accents", "home-decor", "Wall Decor & Timepieces"),
  p("hd-vase", "Drawing Room Rose Vase", 1900, IMG.roses, "Home Decor & Accents", "home-decor", "Floral Arrangements & Plants", { badge: "New" }),
  p("hd-vase2", "Bud Vase Bouquet", 1700, IMG.roses, "Home Decor & Accents", "home-decor", "Floral Arrangements & Plants"),
  p("hd-bouquet", "Garden Bouquet", 2550, IMG.driedBouquet, "Home Decor & Accents", "home-decor", "Floral Arrangements & Plants"),
  p("hd-flower", "Single Stem Flower", 900, IMG.yellowBouquet, "Home Decor & Accents", "home-decor", "Floral Arrangements & Plants"),
  p("hd-roses", "Heirloom Rose Trio", 2150, IMG.roses, "Home Decor & Accents", "home-decor", "Floral Arrangements & Plants"),
  p("hd-cactus", "Potted Cactus Charm", 1300, IMG.tealBlanket, "Home Decor & Accents", "home-decor", "Floral Arrangements & Plants"),
  p("hd-cushion", "Meadow Crochet Cushion", 2700, IMG.cushions, "Home Decor & Accents", "home-decor", "Cushions & Soft Furnishings", { badge: "New" }),
  p("hd-pillows", "Cottage Pillow Set", 3500, IMG.cozyCorner, "Home Decor & Accents", "home-decor", "Cushions & Soft Furnishings" ),
  p("hd-sunflower", "Sunfield Sunflower Art", 2550, IMG.sunflower, "Home Decor & Accents", "home-decor", "Wall Decor & Timepieces"),
];

/* ==================================================================
   4 · KITCHEN, DINING & STORAGE
   ================================================================== */
const kitchen: ProductDetail[] = [
  p("kd-tigerbox", "Tiger Storage Box", 1350, IMG.cake, "Kitchen, Dining & Storage", "kitchen", "Storage & Utility Boxes"),
  p("kd-rabbitbox", "Rabbit Storage Box", 1350, IMG.pinkTeddy, "Kitchen, Dining & Storage", "kitchen", "Storage & Utility Boxes"),
  p("kd-burger", "Burger Novelty Box", 1250, IMG.cake, "Kitchen, Dining & Storage", "kitchen", "Storage & Utility Boxes"),
  p("kd-panda", "Panda Storage Box", 1350, IMG.bear, "Kitchen, Dining & Storage", "kitchen", "Storage & Utility Boxes"),
  p("kd-cake", "Cottage Cake Keepsake Box", 1250, IMG.cake, "Kitchen, Dining & Storage", "kitchen", "Storage & Utility Boxes", { badge: "Bestseller" }),
  p("kd-basket", "Cottage Basket", 1350, IMG.strawberry, "Kitchen, Dining & Storage", "kitchen", "Baskets"),
  p("kd-fruitbasket", "Fruit Display Basket", 1650, IMG.strawberry, "Kitchen, Dining & Storage", "kitchen", "Baskets"),
  p("kd-ramazan", "Ramazan Gift Basket", 2500, IMG.strawberry, "Kitchen, Dining & Storage", "kitchen", "Baskets", { badge: "Seasonal" }),
  p("kd-crochet-fruit", "Crochet Fruit Basket", 2000, IMG.strawberry, "Kitchen, Dining & Storage", "kitchen", "Baskets"),
  p("kd-crochet-veg", "Crochet Vegetable Basket", 2000, IMG.strawberry, "Kitchen, Dining & Storage", "kitchen", "Baskets"),
  p("kd-cupset", "Cosy Cup Set (4)", 1400, IMG.bottles, "Kitchen, Dining & Storage", "kitchen", "Tableware & Drinkware"),
  p("kd-coasterset", "Floral Coaster Set", 1000, IMG.bottles, "Kitchen, Dining & Storage", "kitchen", "Tableware & Drinkware", { badge: "New" }),
  p("kd-coaster", "Single Crochet Coaster", 500, IMG.bottles, "Kitchen, Dining & Storage", "kitchen", "Tableware & Drinkware"),
  p("kd-mug", "Beer Mug Cosy", 850, IMG.yellowCrochet, "Kitchen, Dining & Storage", "kitchen", "Tableware & Drinkware"),
];

/* ==================================================================
   5 · APPAREL & CLOTHING
   ================================================================== */
const apparel: ProductDetail[] = [
  p("ap-bolero", "Meadow Bolero", 4050, IMG.cardigan, "Apparel & Clothing", "apparel", "Outerwear & Tops", { sizes: ["XS","S","M","L","XL"], colors: [{name:"Cream",hex:"#faf5ee"},{name:"Blush",hex:"#f3d9d4"},{name:"Sage",hex:"#c5d3bf"}] }),
  p("ap-jacket", "Cottage Crochet Jacket", 5500, IMG.cardigan, "Apparel & Clothing", "apparel", "Outerwear & Tops", { sizes: ["XS","S","M","L","XL"] }),
  p("ap-sweater", "Lace Panel Sweater", 4750, IMG.hero, "Apparel & Clothing", "apparel", "Outerwear & Tops", { badge: "Signature", sizes: ["XS","S","M","L","XL"] }),
  p("ap-babygirl", "Baby Girl Garden Dress", 2400, IMG.pinkTeddy, "Apparel & Clothing", "apparel", "Baby Wear & Outfits", { sizes: ["0–3m","3–6m","6–12m","12–18m"] }),
  p("ap-babyboy", "Baby Boy Cotton Set", 2200, IMG.bear, "Apparel & Clothing", "apparel", "Baby Wear & Outfits", { sizes: ["0–3m","3–6m","6–12m","12–18m"] }),
  p("ap-romper", "Baby Romper Onesie", 2550, IMG.purpleBear, "Apparel & Clothing", "apparel", "Baby Wear & Outfits", { badge: "New" }),
  p("ap-frock", "Little Girl Crochet Frock", 2850, IMG.pinkTeddy, "Apparel & Clothing", "apparel", "Baby Wear & Outfits", { sizes: ["1y","2y","3y","4y"] }),
];

/* ==================================================================
   6 · FOOTWEAR
   ================================================================== */
const footwear: ProductDetail[] = [
  p("ft-tiger", "Tiger Baby Shoes", 800, IMG.strawberry, "Footwear", "footwear", "Character & Themed Shoes", { sizes: ["0–6m","6–12m","1–2y"] }),
  p("ft-rabbit", "Rabbit Baby Shoes", 800, IMG.pinkTeddy, "Footwear", "footwear", "Character & Themed Shoes"),
  p("ft-hk", "Hello Kitty Baby Shoes", 900, IMG.pinkTeddy, "Footwear", "footwear", "Character & Themed Shoes", { badge: "Bestseller" }),
  p("ft-simple", "Simple Everyday Booties", 700, IMG.bottles, "Footwear", "footwear", "Casual & Fashion Footwear"),
  p("ft-fancy", "Fancy Lace Slippers", 1350, IMG.cardigan, "Footwear", "footwear", "Casual & Fashion Footwear"),
  p("ft-sandal-summer", "Summer Sandals", 1150, IMG.clips, "Footwear", "footwear", "Casual & Fashion Footwear", { badge: "New" }),
  p("ft-shoes", "Cosy Cotton Shoes", 950, IMG.bottles, "Footwear", "footwear", "Casual & Fashion Footwear"),
  p("ft-ladysandal", "Ladies Garden Sandals", 1600, IMG.clips, "Footwear", "footwear", "Casual & Fashion Footwear"),
];

/* ==================================================================
   7 · FASHION ACCESSORIES & BAGS
   ================================================================== */
const fashion: ProductDetail[] = [
  p("fa-cap", "Cotton Sun Cap", 1000, IMG.hero, "Fashion Accessories & Bags", "fashion", "Headwear & Handwear", { badge: "New" }),
  p("fa-mittens", "Mittens (Pair)", 850, IMG.hands, "Fashion Accessories & Bags", "fashion", "Headwear & Handwear"),
  p("fa-gloves", "Lace Fingerless Gloves", 1000, IMG.hands, "Fashion Accessories & Bags", "fashion", "Headwear & Handwear"),
  p("fa-earrings", "Blossom Earring Set", 700, IMG.roses, "Fashion Accessories & Bags", "fashion", "Jewelry & Hair Accessories"),
  p("fa-bracelet", "Woven Cotton Bracelet", 600, IMG.clips, "Fashion Accessories & Bags", "fashion", "Jewelry & Hair Accessories"),
  p("fa-hairpins", "Garden Hair Pin Set", 750, IMG.clips, "Fashion Accessories & Bags", "fashion", "Jewelry & Hair Accessories", { badge: "Bestseller" }),
  p("fa-crown", "Wildflower Crown", 1300, IMG.roses, "Fashion Accessories & Bags", "fashion", "Jewelry & Hair Accessories"),
  p("fa-handbag", "Meadow Handbag", 2500, IMG.handbag, "Fashion Accessories & Bags", "fashion", "Bags & Pouches"),
  p("fa-pouch", "Everyday Pouch", 800, IMG.bottles, "Fashion Accessories & Bags", "fashion", "Bags & Pouches"),
  p("fa-earbud", "Earbuds Cosy", 600, IMG.cake, "Fashion Accessories & Bags", "fashion", "Bags & Pouches"),
];

/* ==================================================================
   8 · TOYS, AMIGURUMI & PLAYTHINGS
   ================================================================== */
const toys: ProductDetail[] = [
  p("ty-grad", "Graduation Doll Keepsake", 2500, IMG.bear, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies", { badge: "New" }),
  p("ty-chicks", "Baby Chicks Plush Trio", 1600, IMG.yellowCrochet, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-sonic", "Sonic Plush Doll", 1450, IMG.bluePattern, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-hk", "Hello Kitty Plush Doll", 1450, IMG.pinkTeddy, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies", { badge: "Bestseller" }),
  p("ty-pooh", "Pooh Plush Doll", 1600, IMG.bear, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-mickey", "Mickey Mouse Plush", 1600, IMG.catToy, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-patrick", "Patrick Star Plush", 1450, IMG.pinkTeddy, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-toothless", "Night Fury Toothless Plush", 1850, IMG.bluePattern, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-angry", "Angry Bird Plush", 1200, IMG.strawberry, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-mochi", "Mochi Cat Plush", 1050, IMG.pinkTeddy, "Toys, Amigurumi & Playthings", "toys", "Dolls & Plushies"),
  p("ty-duck", "Rubber Duck Plush", 950, IMG.yellowCrochet, "Toys, Amigurumi & Playthings", "toys", "Sports & Soft Play"),
  p("ty-ball", "Soft Play Ball", 800, IMG.colorBlanket, "Toys, Amigurumi & Playthings", "toys", "Sports & Soft Play"),
];

/* ==================================================================
   9 · STATIONERY & CARDS
   ================================================================== */
const stationery: ProductDetail[] = [
  p("st-bookmark", "Floral Bookmark", 300, IMG.roses, "Stationery & Cards", "stationery", "Reading & Book Accessories", { badge: "New" }),
  p("st-cover", "Crochet Book Cover", 900, IMG.cardigan, "Stationery & Cards", "stationery", "Reading & Book Accessories"),
  p("st-friend", "Friendship Greeting Card", 250, IMG.helloFrame, "Stationery & Cards", "stationery", "Handmade Greeting Cards"),
  p("st-sorry", "Sorry Greeting Card", 250, IMG.paperCraft, "Stationery & Cards", "stationery", "Handmade Greeting Cards"),
  p("st-wedding", "Wedding Greeting Card", 350, IMG.letters, "Stationery & Cards", "stationery", "Handmade Greeting Cards", { badge: "Bestseller" }),
  p("st-love", "Love Greeting Card", 250, IMG.valentine, "Stationery & Cards", "stationery", "Handmade Greeting Cards"),
  p("st-lucky", "Lucky Leaf Card", 250, IMG.sunflower, "Stationery & Cards", "stationery", "Handmade Greeting Cards"),
  p("st-envelope", "Envelope Card Set", 300, IMG.letters, "Stationery & Cards", "stationery", "Handmade Greeting Cards"),
];

/* ---------- EXPORTS ---------- */
export const allProducts: ProductDetail[] = [
  ...pouches, ...keychains, ...homeDecor, ...kitchen,
  ...apparel, ...footwear, ...fashion, ...toys, ...stationery,
];

export const getProduct = (id: string) => allProducts.find((x) => x.id === id);

export type CategoryMeta = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  image: string;
};

export const categories: CategoryMeta[] = [
  { slug: "pouches", name: "Pouches & Mini Organizers", short: "Pouches & Mini Organizers", tagline: "Little zip-top friends for everyday carry.", image: "/images/cat-pouches.jpg" },
  { slug: "keychains", name: "Keychains & Bag Charms", short: "Keychains & Bag Charms", tagline: "Tiny hand-loomed companions for your keys.", image: "/images/cat-keychains.jpg" },
  { slug: "home-decor", name: "Home Decor & Floral Accents", short: "Home Decor & Floral Accents", tagline: "Cottage clocks, blooms & cushions.", image: "/images/cat-home-decor.jpg" },
  { slug: "kitchen", name: "Kitchen, Dining & Storage", short: "Kitchen, Dining & Storage", tagline: "Baskets, boxes and tableware for cosy meals.", image: "/images/cat-kitchen.jpg" },
  { slug: "apparel", name: "Apparel & Baby Wear", short: "Apparel & Baby Wear", tagline: "Heirloom lace & softly stitched baby wear.", image: "/images/cat-apparel.jpg" },
  { slug: "footwear", name: "Footwear & Shoes", short: "Footwear & Shoes", tagline: "Baby booties to fancy garden sandals.", image: "/images/cat-footwear.jpg" },
  { slug: "fashion", name: "Fashion Accessories & Bags", short: "Fashion Accessories & Bags", tagline: "Handbags, mittens, jewellery and crowns.", image: "/images/cat-accessories.jpg" },
  { slug: "toys", name: "Amigurumi Toys & Plushies", short: "Amigurumi Toys & Plushies", tagline: "Squishy plushies and soft-play favourites.", image: "/images/cat-amigurumi.jpg" },
  { slug: "stationery", name: "Stationery & Cards", short: "Stationery & Cards", tagline: "Bookmarks, book covers & handmade cards.", image: "/images/cat-stationery.jpg" },
];

export const productsByCategory = (slug: string) =>
  allProducts.filter((p) => p.categorySlug === slug);


/* Sub-category cover images (falls back to first product image) */
export const subImages: Record<string, string> = {
  "Animal & Character Pouches": "/images/sub/pouches-animal.jpg",
  "Functional, Tech & Everyday": "/images/sub/pouches-functional.jpg",
  "Cartoon & Anime Characters": "/images/sub/key-cartoon.jpg",
  "Animals, Insects & Birds": "/images/sub/key-animals.jpg",
  "Sea Creatures & Aquatic": "/images/sub/key-sea.jpg",
  "Food, Plants & Novelty": "/images/sub/key-food.jpg",
  "Wall Decor & Timepieces": "/images/sub/decor-wall.jpg",
  "Floral Arrangements & Plants": "/images/sub/decor-floral.jpg",
  "Cushions & Soft Furnishings": "/images/sub/decor-cushions.jpg",
  "Storage & Utility Boxes": "/images/sub/kitchen-storage.jpg",
};

export const productsBySubcategory = (slug: string) => {
  const list = productsByCategory(slug);
  const groups = new Map<string, ProductDetail[]>();
  list.forEach((p) => {
    const key = p.subcategory ?? "Everything";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  });
  return Array.from(groups.entries()).map(([name, items]) => ({
    name,
    items,
    image: subImages[name] ?? items[0]?.image ?? "",
  }));
};

/* Home-page groupings (a curated slice of the catalog) */
export const newArrivals: Product[] = allProducts.filter((p) => p.badge === "New").slice(0, 5);
export const favorites: Product[] = allProducts.filter((p) => p.badge === "Bestseller").slice(0, 8);

/* Small convenience picks for home-page category features (max 4 per) */
export const homeDecorFeatured: Product[] = productsByCategory("home-decor").slice(0, 4);
export const kitchenFeatured: Product[] = productsByCategory("kitchen").slice(0, 4);
export const apparelFeatured: Product[] = productsByCategory("apparel").slice(0, 4);
export const keychainsFeatured: Product[] = productsByCategory("keychains").slice(0, 4);

/* ---------- Customer reviews ---------- */
export type Review = { quote: string; name: string; role: string };

export const testimonials: Review[] = [
  {
    quote:
      "Ordered a cardigan for my daughter's birthday and it came wrapped so neatly, with a little handwritten note. The stitching is far better than the readymade ones from Liberty Market.",
    name: "Ayesha Tariq",
    role: "Lahore",
  },
  {
    quote:
      "I got the strawberry basket for my kitchen counter and everyone who visits asks where it's from. Delivery to Karachi took four days, packed properly, nothing damaged.",
    name: "Fatima Siddiqui",
    role: "Karachi",
  },
  {
    quote:
      "Bought keychains for my nieces on Eid. Honestly did not expect this quality at this price — the yarn is soft and the little faces are stitched so neatly. Will order again.",
    name: "Hira Khan",
    role: "Islamabad",
  },
];

export const productReviews: Review[] = [
  { quote: "Colour is exactly like the picture. My wife loved it, she has kept it in the drawing room.", name: "Bilal Ahmed", role: "Rawalpindi" },
  { quote: "Packing was very good, came in a nice box with tissue paper. Worth the money.", name: "Sana Javed", role: "Multan" },
  { quote: "My daughter has been carrying it to school every day since it arrived. Stitching is still perfect.", name: "Nimra Aslam", role: "Faisalabad" },
  { quote: "Ordered two, received both within a week here in Peshawar. Quality is much better than what I expected from online.", name: "Zainab Gul", role: "Peshawar" },
  { quote: "Gifted it to my mother and she keeps showing it to everyone who comes over. She is very happy with it.", name: "Usman Sheikh", role: "Hyderabad" },
  { quote: "Soft yarn, neat finishing, no loose threads anywhere. You can tell it is properly handmade.", name: "Mahnoor Abbas", role: "Sialkot" },
  { quote: "Was a little worried about ordering handmade things online but this was genuinely good. Recommended.", name: "Areeba Noor", role: "Quetta" },
  { quote: "The size was exactly as mentioned. Seller also messaged to confirm the order, very decent dealing.", name: "Hamza Iqbal", role: "Gujranwala" },
  { quote: "Bought it for my sister's baby shower. Everyone thought it was imported. Beautiful work.", name: "Rabia Kamran", role: "Lahore" },
  { quote: "Reasonable price for the amount of work in it. Washed it once gently and it is still perfectly fine.", name: "Saad Rehman", role: "Karachi" },
  { quote: "Second time ordering. Same good quality both times, that is why I keep coming back.", name: "Komal Shahid", role: "Abbottabad" },
  { quote: "Delivery was a day late but the product made up for it. Really pretty and well made.", name: "Iqra Mehmood", role: "Sargodha" },
];

/* Stable 3 reviews per product, so each page feels different */
export const reviewsForProduct = (id: string): Review[] => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const start = h % productReviews.length;
  return [0, 1, 2].map((k) => productReviews[(start + k * 5) % productReviews.length]);
};
