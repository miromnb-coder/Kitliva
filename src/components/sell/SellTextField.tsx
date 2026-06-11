import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SellTextFieldProps = {
  label: string;
  value: string;
  multiline?: boolean;
};

export function SellTextField({ label, value, multiline = false }: SellTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, multiline && styles.multilineBox]}>
        <Text style={[styles.value, multiline && styles.multilineValue]}>{value}</Text>
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
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  box: {
    minHeight: 42,
    justifyContent: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  multilineBox: {
    minHeight: 78,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 13,
    padding: 12
  },
  value: {
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "700"
  },
  multilineValue: {
    color: "#4F6060",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18
  }
});
