import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function AiPriceRecommendation() {
  return (
    <View style={styles.card}>
      <View style={styles.textWrap}>
        <Text style={styles.label}>AI price recommendation</Text>
        <Text style={styles.price}>€200 – €240</Text>
        <Text style={styles.sub}>Based on 312 similar listings</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>High demand</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 68,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#BFE9DC",
    backgroundColor: colors.mint,
    padding: 12
  },
  textWrap: {
    flex: 1,
    paddingRight: 12
  },
  label: {
    color: colors.primary,
    fontSize: 10.5,
    fontWeight: "700"
  },
  price: {
    marginTop: 3,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  sub: {
    marginTop: 1,
    color: "#51706E",
    fontSize: 10.5,
    fontWeight: "500"
  },
  badge: {
    height: 23,
    justifyContent: "center",
    borderRadius: 11.5,
    borderWidth: 1,
    borderColor: "#BFE9DC",
    backgroundColor: colors.surface,
    paddingHorizontal: 9
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800"
  }
});
