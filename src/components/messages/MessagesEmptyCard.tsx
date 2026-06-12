import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type MessagesEmptyCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
};

export function MessagesEmptyCard({ icon, title, message }: MessagesEmptyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={26} color="#A77C3A" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 22
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F7F2EB",
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  message: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: "center"
  }
});
