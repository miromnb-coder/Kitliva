import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const categories = [
  { label: "Camera", categoryName: "Cameras", icon: "camera-outline" as const },
  { label: "Cycling", categoryName: "Cycling", icon: "bicycle-outline" as const },
  { label: "Outdoor", categoryName: "Outdoor", icon: "triangle-outline" as const },
  { label: "Music", categoryName: "Music", icon: "musical-notes-outline" as const },
  { label: "Winter", categoryName: "Winter", icon: "snow-outline" as const }
];

type HomeCategoryCardsProps = {
  selectedCategoryName: string;
  onSelectCategory: (categoryName: string) => void;
};

export function HomeCategoryCards({ selectedCategoryName, onSelectCategory }: HomeCategoryCardsProps) {
  return (
    <View style={styles.row}>
      {categories.map((category) => {
        const selected = selectedCategoryName === category.categoryName;
        return (
          <Pressable key={category.label} style={[styles.card, selected && styles.selectedCard]} onPress={() => onSelectCategory(selected ? "All" : category.categoryName)}>
            <Ionicons name={category.icon} size={19} color={selected ? colors.surface : colors.text} />
            <Text style={[styles.label, selected && styles.selectedLabel]} numberOfLines={1}>{category.label}</Text>
          </Pressable>
        );
      })}
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
  selectedCard: {
    borderColor: "#171717",
    backgroundColor: "#171717"
  },
  label: {
    marginTop: 5,
    color: colors.text,
    fontSize: 9.2,
    fontWeight: "500",
    lineHeight: 11,
    textAlign: "center"
  },
  selectedLabel: {
    color: colors.surface,
    fontWeight: "700"
  }
});
