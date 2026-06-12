import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";

type AuthButtonProps = {
  label: string;
  loadingLabel?: string;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
};

export function AuthButton({ label, loadingLabel, variant = "primary", disabled = false, loading = false, onPress }: AuthButtonProps) {
  const isDisabled = disabled || loading;
  const buttonLabel = loading && loadingLabel ? loadingLabel : label;

  if (variant === "tertiary") {
    return (
      <Pressable style={[styles.tertiaryButton, isDisabled && styles.disabled]} disabled={isDisabled} onPress={onPress}>
        <Text style={styles.tertiaryText}>{buttonLabel}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.button, variant === "secondary" ? styles.secondaryButton : styles.primaryButton, isDisabled && styles.disabled]} disabled={isDisabled} onPress={onPress}>
      {loading ? <ActivityIndicator size="small" color={colors.surface} /> : <Text style={[styles.buttonText, variant === "secondary" ? styles.secondaryText : styles.primaryText]}>{buttonLabel}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9
  },
  primaryButton: {
    backgroundColor: "#171717"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: "transparent"
  },
  disabled: {
    opacity: 0.72
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700"
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
    fontSize: 15,
    fontWeight: "600"
  }
});
