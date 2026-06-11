import { Ionicons } from "@expo/vector-icons";

export type ProfileSectionItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
};

export type ProfileSection = {
  title: string;
  items: ProfileSectionItem[];
};

export type ProfileStat = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
};

export const mockProfile: {
  user: {
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    trustLabel: string;
    avatarUrl: string;
  };
  stats: ProfileStat[];
  sections: ProfileSection[];
} = {
  user: {
    name: "Luca R.",
    location: "Dublin, Ireland",
    rating: 4.9,
    reviewCount: 78,
    trustLabel: "Trusted seller",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
  },
  stats: [
    { label: "Listings", value: 12, icon: "pricetag-outline" },
    { label: "Sold", value: 34, icon: "bag-handle-outline" },
    { label: "Saved", value: 18, icon: "heart-outline" }
  ],
  sections: [
    {
      title: "My activity",
      items: [
        { label: "My listings", icon: "pricetag-outline" },
        { label: "Saved items", icon: "heart-outline" },
        { label: "Offers", icon: "ticket-outline", badge: 2 },
        { label: "Orders", icon: "cube-outline", badge: 1 },
        { label: "Reviews", icon: "star-outline" }
      ]
    },
    {
      title: "Selling tools",
      items: [
        { label: "Drafts", icon: "document-text-outline", badge: 3 },
        { label: "Price insights", icon: "analytics-outline" },
        { label: "Shipping preferences", icon: "car-outline" }
      ]
    },
    {
      title: "Support & account",
      items: [
        { label: "Help center", icon: "help-circle-outline" },
        { label: "Payments", icon: "card-outline" },
        { label: "Addresses", icon: "location-outline" },
        { label: "Notifications", icon: "notifications-outline" },
        { label: "Sign out", icon: "log-out-outline" }
      ]
    }
  ]
};
