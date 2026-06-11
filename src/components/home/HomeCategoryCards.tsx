import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const categories = [
  { label: "Camera", icon: "camera-outline" as const },
  { label: "Cycling", icon: "bicycle-outline" as const },
  { label: "Outdoor", icon: "triangle-outline" as const },
  { label: "Music", icon: "musical-notes-outline" as const },
  { label: "Winter Sports", icon: "snow-outline" as const }
];

export function HomeCategoryCards() {
  return (
    <View style={styles.row}>
      {categories.map((category) => (
        <Pressable key={category.label} style={styles.card}>
          <Ionicons name={category.icon} size={22} color={colors.text} />
          <Text style={styles.label} numberOfLines={2}>{category.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 7,
    marginTop: 14
  },
  card: {
    flex: 1,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  label: {
    marginTop: 8,
    color: colors.text,
    fontSize: 10.5,
    fontWeight: "500",
    lineHeight: 13,
    textAlign: "center"
  }
});
