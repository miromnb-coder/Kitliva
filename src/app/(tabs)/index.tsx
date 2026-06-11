import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";

export default function HomeScreen() {
  return (
    <Screen centered>
      <View style={styles.card}>
        <Text style={styles.title}>Kitliva</Text>
        <Text style={styles.subtitle}>Used gear for every hobby.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl
  },
  title: {
    color: colors.primary,
    fontSize: typography.title,
    fontWeight: "800",
    letterSpacing: -0.5
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.body,
    fontWeight: "500",
    textAlign: "center"
  }
});
