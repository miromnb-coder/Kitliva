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
    minHeight: 76,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFE9DC",
    backgroundColor: colors.mint,
    padding: 14
  },
  textWrap: {
    flex: 1,
    paddingRight: 12
  },
  label: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700"
  },
  price: {
    marginTop: 4,
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  sub: {
    marginTop: 2,
    color: "#51706E",
    fontSize: 11,
    fontWeight: "500"
  },
  badge: {
    height: 24,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFE9DC",
    backgroundColor: colors.surface,
    paddingHorizontal: 9
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10.5,
    fontWeight: "800"
  }
});
