import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function SectionHeader({ title, actionLabel = "See all" }: { title: string; actionLabel?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.action}>{actionLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  action: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700"
  }
});
