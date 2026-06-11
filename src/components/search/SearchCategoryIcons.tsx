import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { homeCategories } from "@/constants/categories";
import { colors } from "@/constants/colors";

const allCategories = [{ id: "all", label: "All", icon: "apps-outline" as const }, ...homeCategories];

function getShortLabel(label: string) {
  if (label === "Kids’ Gear") return "Kids";
  if (label === "Cameras") return "Camera";
  return label;
}

type SearchCategoryIconsProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export function SearchCategoryIcons({ selectedCategory, onSelectCategory }: SearchCategoryIconsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Browse by category</Text>
      <View style={styles.row}>
        {allCategories.map((category) => {
          const selected = selectedCategory === category.label;
          return (
            <Pressable key={category.id} style={styles.item} onPress={() => onSelectCategory(category.label)}>
              <View style={[styles.iconCircle, selected && styles.selectedIconCircle]}>
                <Ionicons name={category.icon} size={16} color={selected ? colors.surface : colors.primary} />
              </View>
              <Text style={[styles.label, selected && styles.selectedLabel]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
                {getShortLabel(category.label)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 15 },
  title: { marginBottom: 9, color: colors.text, fontSize: 13, fontWeight: "800" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  item: { width: 37, alignItems: "center" },
  iconCircle: { width: 31, height: 31, alignItems: "center", justifyContent: "center", borderRadius: 15.5, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 4 },
  selectedIconCircle: { borderColor: colors.primary, backgroundColor: colors.primary },
  label: { width: 42, color: colors.text, fontSize: 8.4, fontWeight: "600", lineHeight: 10, textAlign: "center" },
  selectedLabel: { color: colors.primary, fontWeight: "800" }
});
