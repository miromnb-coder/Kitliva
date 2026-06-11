import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

type SellTextFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad" | "decimal-pad";
  onChangeText: (value: string) => void;
};

export function SellTextField({ label, value, placeholder, multiline = false, keyboardType = "default", onChangeText }: SellTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        textAlignVertical={multiline ? "top" : "center"}
      />
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
  input: {
    minHeight: 42,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "700"
  },
  multilineInput: {
    minHeight: 88,
    borderRadius: 13,
    padding: 12,
    color: "#4F6060",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18
  }
});
