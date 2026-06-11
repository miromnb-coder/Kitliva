import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { HomeCategory } from "@/constants/categories";

export function CategoryTile({ category }: { category: HomeCategory }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={category.icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {category.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "25%",
    alignItems: "center",
    marginBottom: 12
  },
  iconCircle: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  label: {
    marginTop: 6,
    color: colors.text,
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center"
  }
});
