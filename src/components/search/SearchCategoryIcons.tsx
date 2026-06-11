import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { homeCategories } from "@/constants/categories";
import { colors } from "@/constants/colors";

function getShortLabel(label: string) {
  if (label === "Kids’ Gear") {
    return "Kids";
  }

  if (label === "Cameras") {
    return "Camera";
  }

  return label;
}

export function SearchCategoryIcons() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Browse by category</Text>
      <View style={styles.row}>
        {homeCategories.map((category) => (
          <View key={category.id} style={styles.item}>
            <View style={styles.iconCircle}>
              <Ionicons name={category.icon} size={16} color={colors.primary} />
            </View>
            <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
              {getShortLabel(category.label)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 15
  },
  title: {
    marginBottom: 9,
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  item: {
    width: 37,
    alignItems: "center"
  },
  iconCircle: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 4
  },
  label: {
    width: 42,
    color: colors.text,
    fontSize: 8.4,
    fontWeight: "600",
    lineHeight: 10,
    textAlign: "center"
  }
});
