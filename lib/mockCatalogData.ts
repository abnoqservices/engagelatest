// lib/mockCatalogData.ts  (or wherever you store your mock data)

export interface SocialLink {
    platform: string;
    url: string;
    icon?: string; // optional - for lucide-react icons if you want to map them
  }
  
  export interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    image: string;
    images?:string[];
    description: string;
    shortDescription?: string;   // for card previews if you want shorter text
    features: string[];
    dimensions: string;
    weight: string;
    inStock: boolean;
    sku?: string;
    material?: string;
    colorOptions?: string[];
    rating?: number;             // optional - stars out of 5
    reviewCount?: number;
    cta?: string;              // optional - e.g. "Buy Now", "Learn More"
  }
  
  export interface CatalogData {
    logo: string;
    name: string;
    tagline: string;
    description: string;
    about: string;
    mission: string;
    vision: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    socialLinks: SocialLink[];
    products: Product[];
    cta?: string; 
  }
  
  export const mockData: CatalogData = {
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
    name: "Elegance & Co.",
    tagline: "Crafting Excellence Since 2010",
    description: "Curating timeless, handcrafted pieces that blend artistry with modern functionality for discerning individuals.",
    about: "Founded in 2010, Elegance & Co. began as a small atelier dedicated to reviving traditional craftsmanship in a fast-fashion world. Today we partner with master artisans across India and Europe to bring sustainable, high-quality home goods, accessories and lifestyle products to conscious consumers.",
    mission: "To deliver exceptional quality, ethically made products that bring beauty, durability and joy into everyday life while supporting artisan communities and sustainable practices.",
    vision: "To become the most trusted global name in thoughtful luxury — where every purchase is an investment in craftsmanship, people, and the planet.",
    
    address: "Plot No. 14, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010, India",
    phone: "+91 522 406 7890",
    email: "hello@eleganceandco.in",
    website: "https://eleganceandco.in",
    socialLinks: [
      { platform: "Instagram", url: "https://instagram.com/eleganceandco" },
      { platform: "Facebook",  url: "https://facebook.com/eleganceandco.in" },
      { platform: "Twitter",    url: "https://twitter.com/elegance_co" },
      { platform: "Pinterest",  url: "https://pinterest.com/eleganceandco" },
    ],
  
    products: [
      {
        id: 1,
        name: "Italian Leather Tote Bag",
        category: "Bags",
        price: "₹24,999",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop"
          ],
       
        description: "Handcrafted from full-grain Italian leather with antique brass hardware. Features multiple interior pockets, detachable shoulder strap, and protective feet.",
        shortDescription: "Premium full-grain leather tote with timeless design",
        features: [
          "100% full-grain Italian leather",
          "Cotton canvas lining",
          "YKK antique brass zipper",
          "Adjustable & detachable strap",
          "Base reinforced with protective studs",
        ],
        dimensions: "42 × 32 × 15 cm",
        weight: "1.2 kg",
        inStock: true,
        sku: "EL-TB-001-BLK",
        material: "Full-grain leather",
        colorOptions: ["Black", "Cognac", "Tan"],
        rating: 4.8,
        reviewCount: 142,
        cta:'Enquire Now'
      },
      {
        id: 2,
        name: "Hand-Blown Glass Table Lamp",
        category: "Lighting",
        price: "₹18,499",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop",
        description: "Mouth-blown amber glass shade with hand-turned mango wood base. Dimmable E27 LED compatible fitting. Each piece is unique due to artisanal production.",
        features: [
          "Hand-blown glass shade",
          "Solid mango wood base",
          "Dimmable touch control",
          "1.8 m fabric cord",
          "CE certified",
        ],
        dimensions: "Height 58 cm, Base Ø 18 cm",
        weight: "2.8 kg",
        inStock: true,
        sku: "EL-LP-003-AMB",
        material: "Glass + Mango Wood",
        colorOptions: ["Amber", "Smoked Grey", "Clear"],
        rating: 4.7,
        reviewCount: 89,
        cta:'Enquire Now'
      },
      {
        id: 3,
        name: "Organic Cotton Throw Blanket",
        category: "Home Textiles",
        price: "₹6,299",
        image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&auto=format&fit=crop",
        description: "Luxuriously soft 100% GOTS certified organic cotton throw. Reversible waffle weave pattern. Perfect year-round use.",
        features: [
          "GOTS certified organic cotton",
          "Reversible design",
          "Pre-washed for softness",
          "Machine washable",
          "Eco-friendly natural dyes",
        ],
        dimensions: "150 × 200 cm",
        weight: "1.4 kg",
        inStock: false,
        sku: "EL-THR-002-GRY",
        material: "100% Organic Cotton",
        colorOptions: ["Grey", "Sage Green", "Terracotta"],
        rating: 4.9,
        reviewCount: 213,
        cta:'Enquire Now'
      },
      {
        id: 4,
        name: "Ceramic Dinner Plate Set (4 pcs)",
        category: "Tableware",
        price: "₹9,499",
        image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop",
        description: "Hand-thrown stoneware plates with reactive glaze. Microwave, dishwasher and oven safe up to 220°C.",
        features: [
          "Handmade stoneware",
          "Reactive glaze finish",
          "Dishwasher & microwave safe",
          "Stackable design",
          "Each piece unique",
        ],
        dimensions: "Ø 27 cm",
        weight: "0.9 kg each",
        inStock: true,
        sku: "EL-DP-SET-04",
        material: "Stoneware",
        colorOptions: ["Ocean Blue", "Forest Green", "Warm Taupe"],
        rating: 4.6,
        reviewCount: 67,
        cta:'Enquire Now'
      },
      {
        id: 5,
        name: "Walnut Wood Cutting Board",
        category: "Kitchen",
        price: "₹4,999",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
        description: "End-grain walnut board with juice groove and handle cutouts. Food-safe mineral oil finish.",
        features: [
          "End-grain construction",
          "Natural walnut wood",
          "Built-in juice groove",
          "Hand grips on sides",
          "Food-safe finish",
        ],
        dimensions: "38 × 25 × 3.8 cm",
        weight: "2.1 kg",
        inStock: true,
        sku: "EL-CB-001-WNT",
        material: "Walnut",
        colorOptions: ["Natural Walnut"],
        rating: 4.8,
        reviewCount: 104,
        cta:'Enquire Now'
      },
    ],
  };
  
  // Optional: helper function if you use dynamic slugs later
  export function getMockCatalog(slug: string = "elegance-co"): CatalogData {
    return mockData;
  }