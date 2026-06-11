import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";

export function ExploreProductGridSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.image} />
          <View style={styles.content}>
            <View style={styles.lineLarge} />
            <View style={styles.row}>
              <View style={styles.priceLine} />
              <View style={styles.badgeLine} />
            </View>
            <View style={styles.lineSmall} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10
  },
  card: {
    width: "48.5%",
    height: 166,
    overflow: "hidden",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  image: {
    height: 82,
    backgroundColor: "#F1ECE4"
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 8
  },
  lineLarge: {
    width: "72%",
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9
  },
  priceLine: {
    width: 34,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border
  },
  badgeLine: {
    width: 58,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#F1ECE4",
    marginLeft: 8
  },
  lineSmall: {
    width: "56%",
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.border,
    marginTop: 11
  }
});
