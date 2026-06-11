import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const popularSearches = [
  { label: "Camera kit", query: "camera", icon: "camera-outline" as const },
  { label: "Skis", query: "skis", icon: "snow-outline" as const },
  { label: "Tent", query: "tent", icon: "triangle-outline" as const },
  { label: "Guitar", query: "guitar", icon: "musical-notes-outline" as const },
  { label: "Kids gear", query: "kids", icon: "happy-outline" as const }
];

type PopularSearchChipsProps = {
  onSelectSearch: (query: string) => void;
};

export function PopularSearchChips({ onSelectSearch }: PopularSearchChipsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Popular searches</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {popularSearches.map((search) => (
          <Pressable key={search.label} style={styles.chip} onPress={() => onSelectSearch(search.query)}>
            <Ionicons name={search.icon} size={14} color={colors.text} style={styles.icon} />
            <Text style={styles.label}>{search.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24
  },
  title: {
    marginBottom: 10,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18
  },
  content: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 2
  },
  chip: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  icon: {
    marginRight: 6
  },
  label: {
    color: colors.text,
    fontSize: 11.5,
    fontWeight: "500"
  }
});
