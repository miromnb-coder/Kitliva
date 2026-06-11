import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";

type SellContinueButtonProps = {
  label?: string;
  onPress?: () => void;
};

export function SellContinueButton({ label = "Continue", onPress }: SellContinueButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: colors.primary
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800"
  }
});
