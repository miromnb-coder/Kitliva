import { Ionicons } from "@expo/vector-icons";

import { ListingCategory } from "@/types/listing";

export type HomeCategory = {
  id: ListingCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const homeCategories: HomeCategory[] = [
  { id: "cycling", label: "Cycling", icon: "bicycle" },
  { id: "winter", label: "Winter", icon: "snow" },
  { id: "outdoor", label: "Outdoor", icon: "triangle" },
  { id: "music", label: "Music", icon: "musical-notes" },
  { id: "cameras", label: "Cameras", icon: "camera" },
  { id: "fitness", label: "Fitness", icon: "barbell" },
  { id: "gaming", label: "Gaming", icon: "game-controller" },
  { id: "kids", label: "Kids’ Gear", icon: "happy" }
];
