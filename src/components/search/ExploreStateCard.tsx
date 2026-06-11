import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ExploreStateCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function ExploreStateCard({ icon, title, message, actionLabel, onActionPress }: ExploreStateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.button} onPress={onActionPress}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 20,
    marginTop: 8
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: colors.mint,
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  message: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 17,
    textAlign: "center"
  },
  button: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.text,
    paddingHorizontal: 16,
    marginTop: 13
  },
  buttonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "700"
  }
});
