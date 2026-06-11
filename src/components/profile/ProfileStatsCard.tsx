import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { mockProfile } from "@/data/mockProfile";

export function ProfileStatsCard() {
  return (
    <View style={styles.card}>
      {mockProfile.stats.map((stat, index) => (
        <View key={stat.label} style={styles.statWrap}>
          <View style={styles.stat}>
            <Ionicons name={stat.icon} size={20} color={colors.text} style={styles.icon} />
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>

          {index < mockProfile.stats.length - 1 ? <View style={styles.separator} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 86,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 18
  },
  statWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: "100%"
  },
  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    marginBottom: 5
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22
  },
  label: {
    marginTop: 2,
    color: "#657575",
    fontSize: 12.5,
    fontWeight: "500"
  },
  separator: {
    width: 1,
    height: 54,
    backgroundColor: colors.border
  }
});
