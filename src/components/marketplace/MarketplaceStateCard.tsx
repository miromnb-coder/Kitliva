import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function MarketplaceStateCard({ icon, title, message, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.actionButton} onPress={onActionPress}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 158,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18
  },
  iconCircle: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.mint,
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center"
  },
  message: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12.5,
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center"
  },
  actionButton: {
    height: 36,
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    marginTop: 13
  },
  actionText: {
    color: colors.surface,
    fontSize: 12.5,
    fontWeight: "800"
  }
});
