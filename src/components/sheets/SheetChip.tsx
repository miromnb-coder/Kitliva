import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";

type SheetChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function SheetChip({ label, selected = false, onPress }: SheetChipProps) {
  return (
    <Pressable style={[styles.chip, selected && styles.selectedChip]} onPress={onPress}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  selectedChip: {
    borderColor: colors.buttonPrimary,
    backgroundColor: colors.buttonPrimary
  },
  text: {
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "700"
  },
  selectedText: {
    color: colors.buttonPrimaryText
  }
});
