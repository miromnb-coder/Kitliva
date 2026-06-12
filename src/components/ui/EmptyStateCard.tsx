import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type EmptyStateCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
};

export function EmptyStateCard({ icon, title, body, primaryLabel, secondaryLabel, onPrimaryPress, onSecondaryPress }: EmptyStateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={24} color="#A77C3A" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {primaryLabel && onPrimaryPress ? (
        <Pressable style={styles.primaryButton} onPress={onPrimaryPress}>
          <Text style={styles.primaryText}>{primaryLabel}</Text>
        </Pressable>
      ) : null}
      {secondaryLabel && onSecondaryPress ? (
        <Pressable style={styles.secondaryButton} onPress={onSecondaryPress}>
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 22,
    paddingVertical: 28
  },
  iconCircle: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: "#F7F2EB",
    marginBottom: 12
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center"
  },
  body: {
    maxWidth: 270,
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19,
    textAlign: "center"
  },
  primaryButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#171717",
    paddingHorizontal: 18,
    marginTop: 16
  },
  primaryText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "700"
  },
  secondaryButton: {
    marginTop: 12
  },
  secondaryText: {
    color: "#7B623C",
    fontSize: 13,
    fontWeight: "700"
  }
});
