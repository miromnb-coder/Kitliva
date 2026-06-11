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
    marginBottom: 15
  },
  label: {
    marginBottom: 7,
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "800"
  },
  card: {
    minHeight: 64,
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
  title: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  sub: {
    marginTop: 2,
    color: "#51706E",
    fontSize: 10.5,
    fontWeight: "500"
  },
  scoreCircle: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.primary
  },
  scoreText: {
    color: colors.primary,
    fontSize: 11.5,
    fontWeight: "800"
  }
});
