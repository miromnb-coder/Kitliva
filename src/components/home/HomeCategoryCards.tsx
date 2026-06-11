import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const categories = [
  { label: "Camera", icon: "camera-outline" as const },
  { label: "Cycling", icon: "bicycle-outline" as const },
  { label: "Outdoor", icon: "triangle-outline" as const },
  { label: "Music", icon: "musical-notes-outline" as const },
  { label: "Winter", icon: "snow-outline" as const }
];

export function HomeCategoryCards() {
  return (
    <View style={styles.row}>
      {categories.map((category) => (
        <Pressable key={category.label} style={styles.card}>
          <Ionicons name={category.icon} size={19} color={colors.text} />
          <Text style={styles.label} numberOfLines={1}>{category.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 7,
    marginTop: 12
  },
  card: {
    flex: 1,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  label: {
    marginTop: 5,
    color: colors.text,
    fontSize: 9.2,
    fontWeight: "500",
    lineHeight: 11,
    textAlign: "center"
  }
});
