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
    marginBottom: 18
  },
  title: {
    marginBottom: 10,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    height: 34,
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  selectedChipText: {
    color: colors.surface
  },
  helpText: {
    marginTop: 6,
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right"
  }
});
