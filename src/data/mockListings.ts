import { Listing, ListingCategory } from "@/types/listing";

const deliveryOptions = [
  {
    id: "pickup",
    title: "Local pickup",
    subtitle: "Dublin, 3 km",
    priceLabel: "Free",
    icon: "location-outline"
  },
  {
    id: "shipping",
    title: "Shipping",
    subtitle: "1–3 days",
    priceLabel: "€8.90",
    icon: "cube-outline"
  }
];

const defaultDetails = [
  { label: "Condition", value: "Good" },
  { label: "Includes", value: "Original accessories" },
  { label: "Posted", value: "3 days ago" },
  { label: "Views", value: "156" }
];

function createListing(input: {
  id: string;
  title: string;
  subtitle: string;
  category: ListingCategory;
  price: number;
  originalPrice: number;
  imageUrl: string;
  conditionLabel?: string;
  isGreatDeal?: boolean;
  aiPriceMin?: number;
  aiPriceMax?: number;
  aiSimilarListings?: number;
  details?: { label: string; value: string }[];
}): Listing {
  return {
    ...input,
    currency: "EUR",
    condition: "good",
    conditionLabel: input.conditionLabel ?? "Good condition",
    sellerName: "Luca R.",
    sellerInitial: "L",
    sellerLocation: "Dublin",
    sellerDistanceKm: 3,
    sellerRating: 4.9,
    sellerReviewCount: 78,
    aiPriceMin: input.aiPriceMin ?? Math.max(input.price - 30, 1),
    aiPriceMax: input.aiPriceMax ?? input.price + 70,
    aiSimilarListings: input.aiSimilarListings ?? 248,
    details: input.details ?? defaultDetails,
    deliveryOptions
  };
}

export const mockListings: Listing[] = [
  createListing({
    id: "sony-a7-iii-kit",
    title: "Sony A7 III Kit",
    subtitle: "Mirrorless Camera",
    category: "cameras",
    price: 750,
    originalPrice: 950,
    imageUrl: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=600&q=80",
    conditionLabel: "Great condition",
    isGreatDeal: true,
    aiPriceMin: 720,
    aiPriceMax: 820,
    aiSimilarListings: 248,
    details: [
      { label: "Condition", value: "Great" },
      { label: "Shutter count", value: "28K" },
      { label: "Includes", value: "24–70mm lens, battery, charger" },
      { label: "Posted", value: "3 days ago" },
      { label: "Views", value: "156" }
    ]
  }),
  createListing({
    id: "atomic-redster-s9",
    title: "Atomic Redster S9",
    subtitle: "Skis + Bindings",
    category: "winter",
    price: 420,
    originalPrice: 600,
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80",
    aiPriceMin: 390,
    aiPriceMax: 460
  }),
  createListing({
    id: "yamaha-fg800",
    title: "Yamaha FG800",
    subtitle: "Acoustic Guitar",
    category: "music",
    price: 180,
    originalPrice: 250,
    imageUrl: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=600&q=80",
    aiPriceMin: 160,
    aiPriceMax: 210
  }),
  createListing({
    id: "msr-hubba-nx",
    title: "MSR Hubba NX",
    subtitle: "2-Person Tent",
    category: "outdoor",
    price: 210,
    originalPrice: 280,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
    aiPriceMin: 200,
    aiPriceMax: 240
  }),
  createListing({
    id: "bullpadel-vertex-03",
    title: "Bullpadel Vertex 03",
    subtitle: "Padel Racket",
    category: "fitness",
    price: 120,
    originalPrice: 180,
    imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80",
    aiPriceMin: 105,
    aiPriceMax: 145
  }),
  createListing({
    id: "bauer-x-lp-skates",
    title: "Bauer X-LP Skates",
    subtitle: "Kids’ Ice Skates",
    category: "kids",
    price: 60,
    originalPrice: 90,
    imageUrl: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=600&q=80",
    aiPriceMin: 50,
    aiPriceMax: 75
  }),
  createListing({
    id: "gopro-hero-11",
    title: "GoPro HERO 11",
    subtitle: "Action Camera",
    category: "cameras",
    price: 280,
    originalPrice: 350,
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    conditionLabel: "Like new",
    aiPriceMin: 250,
    aiPriceMax: 310
  }),
  createListing({
    id: "kettlebell-16kg",
    title: "Kettlebell 16kg",
    subtitle: "Cast Iron",
    category: "fitness",
    price: 35,
    originalPrice: 55,
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
    aiPriceMin: 25,
    aiPriceMax: 45
  })
];
