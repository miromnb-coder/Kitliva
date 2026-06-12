import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SellFlowActionsProps = {
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  isPrimaryLoading?: boolean;
  isPrimaryDisabled?: boolean;
  isSecondaryDisabled?: boolean;
};

export function SellFlowActions({ primaryLabel, onPrimaryPress, secondaryLabel, onSecondaryPress, isPrimaryLoading = false, isPrimaryDisabled = false, isSecondaryDisabled = false }: SellFlowActionsProps) {
  const primaryDisabled = isPrimaryDisabled || isPrimaryLoading;

  return (
    <View style={styles.container}>
      {secondaryLabel && onSecondaryPress ? (
        <Pressable style={[styles.secondaryButton, isSecondaryDisabled && styles.disabledButton]} onPress={onSecondaryPress} disabled={isSecondaryDisabled}>
          <Text style={[styles.secondaryText, isSecondaryDisabled && styles.disabledSecondaryText]}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}
      <Pressable style={[styles.primaryButton, secondaryLabel ? styles.primaryWithSecondary : null, primaryDisabled && styles.disabledPrimaryButton]} onPress={onPrimaryPress} disabled={primaryDisabled}>
        {isPrimaryLoading ? <ActivityIndicator size="small" color={colors.buttonPrimaryText} /> : <Text style={styles.primaryText}>{primaryLabel}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  secondaryButton: { height: 50, minWidth: 88, alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.buttonPrimary, backgroundColor: colors.surface, paddingHorizontal: 15 },
  disabledButton: { opacity: 0.55 },
  secondaryText: { color: colors.text, fontSize: 15, fontWeight: "600" },
  disabledSecondaryText: { color: colors.muted },
  primaryButton: { height: 58, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: colors.buttonPrimary, paddingHorizontal: 18 },
  disabledPrimaryButton: { opacity: 0.7 },
  primaryWithSecondary: { flex: 1 },
  primaryText: { color: colors.buttonPrimaryText, fontSize: 15, fontWeight: "600" }
});
