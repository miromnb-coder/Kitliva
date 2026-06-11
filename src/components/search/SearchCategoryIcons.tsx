import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { homeCategories } from "@/constants/categories";
import { colors } from "@/constants/colors";

export function SearchCategoryIcons() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Browse by category</Text>
      <View style={styles.row}>
        {homeCategories.map((category) => (
          <View key={category.id} style={styles.item}>
            <View style={styles.iconCircle}>
              <Ionicons name={category.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {category.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 18
  },
  title: {
    marginBottom: 11,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  item: {
    width: 40,
    alignItems: "center"
  },
  iconCircle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 5
  },
  label: {
    color: colors.text,
    fontSize: 9.5,
    fontWeight: "600",
    lineHeight: 12,
    textAlign: "center"
  }
});
