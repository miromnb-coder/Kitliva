import { StyleSheet, View } from "react-native";

import { homeCategories } from "@/constants/categories";
import { CategoryTile } from "@/components/home/CategoryTile";

export function CategoryGrid() {
  return (
    <View style={styles.grid}>
      {homeCategories.map((category) => (
        <CategoryTile key={category.id} category={category} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4
  }
});
