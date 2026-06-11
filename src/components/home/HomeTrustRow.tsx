import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const trustItems = [
  { label: "Verified profiles", icon: "shield-checkmark" as const },
  { label: "Fair prices", icon: "pricetag-outline" as const },
  { label: "Safe messaging", icon: "lock-closed-outline" as const }
];

export function HomeTrustRow() {
  return (
    <View style={styles.container}>
      {trustItems.map((item, index) => (
        <View key={item.label} style={styles.itemWrap}>
          <View style={styles.item}>
            <Ionicons name={item.icon} size={13} color={colors.primary} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
          {index < trustItems.length - 1 ? <Text style={styles.dot}>•</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 22,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14
  },
  itemWrap: {
    flexDirection: "row",
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    alignItems: "center"
  },
  label: {
    marginLeft: 5,
    color: "#4F5752",
    fontSize: 11.5,
    fontWeight: "500"
  },
  dot: {
    marginHorizontal: 13,
    color: "#B5A78F",
    fontSize: 11,
    fontWeight: "600"
  }
});
