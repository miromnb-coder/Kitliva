import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";

type AuthButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "tertiary";
  onPress?: () => void;
};

export function AuthButton({ label, variant = "primary", onPress }: AuthButtonProps) {
  if (variant === "tertiary") {
    return (
      <Pressable style={styles.tertiaryButton} onPress={onPress}>
        <Text style={styles.tertiaryText}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.button, variant === "secondary" ? styles.secondaryButton : styles.primaryButton]} onPress={onPress}>
      <Text style={[styles.buttonText, variant === "secondary" ? styles.secondaryText : styles.primaryText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12
  },
  primaryButton: {
    backgroundColor: colors.primary
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#BFD5D1",
    backgroundColor: colors.surface
  },
  buttonText: {
    fontSize: 14.5,
    fontWeight: "800"
  },
  primaryText: {
    color: colors.surface
  },
  secondaryText: {
    color: colors.text
  },
  tertiaryButton: {
    height: 26,
    alignItems: "center",
    justifyContent: "center"
  },
  tertiaryText: {
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "800"
  }
});
