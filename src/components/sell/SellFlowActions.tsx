import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SellFlowActionsProps = {
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export function SellFlowActions({ primaryLabel, onPrimaryPress, secondaryLabel, onSecondaryPress }: SellFlowActionsProps) {
  return (
    <View style={styles.container}>
      {secondaryLabel && onSecondaryPress ? (
        <Pressable style={styles.secondaryButton} onPress={onSecondaryPress}>
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}

      <Pressable style={[styles.primaryButton, secondaryLabel ? styles.primaryWithSecondary : null]} onPress={onPrimaryPress}>
        <Text style={styles.primaryText}>{primaryLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  secondaryButton: {
    height: 46,
    minWidth: 86,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 15
  },
  secondaryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  primaryButton: {
    height: 46,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 18
  },
  primaryWithSecondary: {
    flex: 1
  },
  primaryText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800"
  }
});
