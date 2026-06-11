import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

type AmountFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function AmountField({ value, onChangeText }: AmountFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set your price</Text>
      <View style={styles.box}>
        <Text style={styles.currency}>€</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="0"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
        />
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
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13
  },
  currency: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginRight: 7
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  }
});
