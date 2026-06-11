import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function AiConditionCheck() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>AI condition check</Text>
      <View style={styles.card}>
        <View style={styles.textWrap}>
          <Text style={styles.title}>Looks great!</Text>
          <Text style={styles.sub}>Light use, clean, all parts included.</Text>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>92%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18
  },
  label: {
    marginBottom: 8,
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  card: {
    minHeight: 72,
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
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  sub: {
    marginTop: 3,
    color: "#51706E",
    fontSize: 11,
    fontWeight: "500"
  },
  scoreCircle: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: 4,
    borderColor: colors.primary
  },
  scoreText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  }
});
