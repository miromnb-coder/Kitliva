import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const conditions = ["New", "Like new", "Good", "Fair", "Poor"];

export function ConditionSelector() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Condition</Text>
      <View style={styles.chipRow}>
        {conditions.map((condition) => {
          const selected = condition === "Good";
          return (
            <View key={condition} style={[styles.chip, selected && styles.selectedChip]}>
              <Text style={[styles.chipText, selected && styles.selectedChipText]}>{condition}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.helpText}>What does this mean?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  title: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7
  },
  chip: {
    height: 31,
    justifyContent: "center",
    borderRadius: 15.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 11
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  chipText: {
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "700"
  },
  selectedChipText: {
    color: colors.surface
  },
  helpText: {
    marginTop: 5,
    color: colors.primary,
    fontSize: 10.5,
    fontWeight: "700",
    textAlign: "right"
  }
});
