export type Product = {
  id: string;
  name: string;
  vendor: string;
  vendorId: string;
  price: number;
  rating: number;
  reviews: number;
  eta: string;
  veg: boolean;
  spice: 1 | 2 | 3;
  image: string;
  category: "curry" | "kit" | "ingredient";
  tags: string[];
  description: string;
  ingredients?: string[];
  calories?: number;
  protein?: number;
  cookTime?: string;
};

const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const categories = [
  { id: "all", label: "All", icon: "🍽️" },
  { id: "curry", label: "Curries", icon: "🍛" },
  { id: "kit", label: "Meal Kits", icon: "📦" },
  { id: "ingredient", label: "Ingredients", icon: "🌶️" },
  { id: "veg", label: "Pure Veg", icon: "🥬" },
  { id: "spicy", label: "Spicy", icon: "🔥" },
  { id: "quick", label: "Quick", icon: "⚡" },
  { id: "protein", label: "Protein", icon: "💪" },
];

export const products: Product[] = [
  {
    id: "p1", name: "Butter Paneer Masala", vendor: "Spice Route Kitchen", vendorId: "v1",
    price: 249, rating: 4.7, reviews: 1284, eta: "25-30 min", veg: true, spice: 2,
    image: img("photo-1631452180519-c014fe946bc7"), category: "curry",
    tags: ["Bestseller", "North Indian"],
    description: "Creamy tomato-cashew gravy with hand-cut paneer cubes, slow simmered with garam masala.",
    ingredients: ["Paneer 200g", "Tomato puree", "Cashew cream", "Butter", "Garam masala"],
    calories: 480, protein: 22, cookTime: "30 min",
  },
  {
    id: "p2", name: "Chicken Chettinad", vendor: "Madras Mess", vendorId: "v2",
    price: 329, rating: 4.8, reviews: 942, eta: "30-35 min", veg: false, spice: 3,
    image: img("photo-1604908176997-125f25cc6f3d"), category: "curry",
    tags: ["Spicy", "South Indian"],
    description: "Fiery Tamil Nadu classic with roasted spices, curry leaves and black pepper.",
    calories: 520, protein: 38, cookTime: "40 min",
  },
  {
    id: "p3", name: "Biryani Meal Kit", vendor: "Spice Route Kitchen", vendorId: "v1",
    price: 449, rating: 4.6, reviews: 612, eta: "10 min", veg: false, spice: 2,
    image: img("photo-1563379091339-03b21ab4a4f8"), category: "kit",
    tags: ["AI Picked", "Serves 2"],
    description: "Pre-marinated chicken, basmati rice, biryani masala and saffron — cook in 25 min.",
    ingredients: ["Basmati rice 500g", "Marinated chicken 400g", "Biryani masala", "Saffron strands", "Fried onions"],
    calories: 720, protein: 42, cookTime: "25 min",
  },
  {
    id: "p4", name: "Dal Makhani", vendor: "Punjab Tadka", vendorId: "v3",
    price: 199, rating: 4.5, reviews: 2103, eta: "20-25 min", veg: true, spice: 1,
    image: img("photo-1626777552726-4a6b54c97e46"), category: "curry",
    tags: ["Comfort"],
    description: "Slow-cooked black lentils with butter, cream and a hint of smoke.",
    calories: 380, protein: 18,
  },
  {
    id: "p5", name: "Garam Masala Blend", vendor: "Spice Route Kitchen", vendorId: "v1",
    price: 149, rating: 4.9, reviews: 421, eta: "15 min", veg: true, spice: 2,
    image: img("photo-1596040033229-a9821ebd058d"), category: "ingredient",
    tags: ["Premium"], description: "Stone-ground house blend — cardamom, clove, cinnamon, mace.",
  },
  {
    id: "p6", name: "Paneer Tikka Kit", vendor: "Punjab Tadka", vendorId: "v3",
    price: 299, rating: 4.7, reviews: 388, eta: "10 min", veg: true, spice: 2,
    image: img("photo-1567188040759-fb8a883dc6d8"), category: "kit",
    tags: ["Party Pack"],
    description: "Marinated paneer, bell peppers, onions and skewers. Grill in 12 min.",
    ingredients: ["Paneer 300g", "Bell peppers", "Onion", "Tikka marinade", "Bamboo skewers"],
    cookTime: "12 min",
  },
  {
    id: "p7", name: "Hyderabadi Mutton Curry", vendor: "Madras Mess", vendorId: "v2",
    price: 449, rating: 4.8, reviews: 567, eta: "35-40 min", veg: false, spice: 3,
    image: img("photo-1545247181-516773cae754"), category: "curry",
    tags: ["Premium", "Slow Cooked"],
    description: "Tender mutton braised with yogurt, fried onions and whole spices.",
    calories: 610, protein: 45,
  },
  {
    id: "p8", name: "Kashmiri Saffron 2g", vendor: "Spice Route Kitchen", vendorId: "v1",
    price: 399, rating: 4.9, reviews: 198, eta: "15 min", veg: true, spice: 1,
    image: img("photo-1599909533730-fce6c4ab3f0b"), category: "ingredient",
    tags: ["Premium Grade"], description: "Hand-picked Mongra saffron threads from Pampore valley.",
  },
];

export const vendors = [
  { id: "v1", name: "Spice Route Kitchen", rating: 4.7, items: 48, verified: true, image: img("photo-1517248135467-4c7edcad34c4") },
  { id: "v2", name: "Madras Mess", rating: 4.8, items: 36, verified: true, image: img("photo-1555396273-367ea4eb4db5") },
  { id: "v3", name: "Punjab Tadka", rating: 4.6, items: 52, verified: true, image: img("photo-1414235077428-338989a2e8c0") },
];

export const offers = [
  { id: "o1", title: "First Order 50% OFF", subtitle: "Code WELCOME50", gradient: "bg-gradient-warm" },
  { id: "o2", title: "AI Picks Just For You", subtitle: "Try smart meal kits", gradient: "bg-gradient-ai" },
  { id: "o3", title: "Free Delivery Above ₹299", subtitle: "Today only", gradient: "bg-gradient-sunset" },
];

export const mockOrders = [
  {
    id: "ORD8421", status: "out_for_delivery" as const, placedAt: "12:42 PM",
    items: [{ name: "Butter Paneer Masala", qty: 1, price: 249 }, { name: "Garlic Naan", qty: 2, price: 80 }],
    total: 409, vendor: "Spice Route Kitchen", eta: 8, otp: "4827",
    partner: { name: "Rahul S.", rating: 4.9, vehicle: "DL 8C 4231" },
  },
  {
    id: "ORD8398", status: "delivered" as const, placedAt: "Yesterday 8:20 PM",
    items: [{ name: "Chicken Chettinad", qty: 1, price: 329 }], total: 379, vendor: "Madras Mess",
  },
  {
    id: "ORD8377", status: "delivered" as const, placedAt: "2 days ago",
    items: [{ name: "Biryani Meal Kit", qty: 1, price: 449 }], total: 449, vendor: "Spice Route Kitchen",
  },
];

export const notifications = [
  { id: "n1", type: "order", title: "Out for delivery", body: "Rahul is 8 mins away with your order", time: "now", unread: true },
  { id: "n2", type: "ai", title: "AI Recommendation", body: "Try Hyderabadi Mutton — matches your taste profile", time: "1h", unread: true },
  { id: "n3", type: "offer", title: "Flat ₹100 OFF", body: "On your next meal kit. Code KIT100", time: "3h", unread: false },
  { id: "n4", type: "order", title: "Order delivered", body: "ORD8398 delivered. Rate your experience.", time: "1d", unread: false },
];
