import { StyleSheet, Text } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";

export default function InboxScreen() {
  return (
    <Screen centered>
      <Text style={styles.title}>Inbox</Text>
      <Text style={styles.subtitle}>Messages and active orders will appear here.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.body,
    textAlign: "center"
  }
});
