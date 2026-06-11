import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";

export function ProductGridSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.image} />
          <View style={styles.lineShort} />
          <View style={styles.line} />
          <View style={styles.priceLine} />
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
    rowGap: 12
  },
  card: {
    width: "48.5%",
    height: 150,
    overflow: "hidden",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingBottom: 8
  },
  image: {
    height: 78,
    backgroundColor: "#EDF2F0"
  },
  lineShort: {
    width: "72%",
    height: 9,
    borderRadius: 5,
    backgroundColor: "#EDF2F0",
    marginLeft: 9,
    marginTop: 9
  },
  line: {
    width: "58%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EDF2F0",
    marginLeft: 9,
    marginTop: 7
  },
  priceLine: {
    width: "42%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EDF2F0",
    marginLeft: 9,
    marginTop: 8
  }
});
