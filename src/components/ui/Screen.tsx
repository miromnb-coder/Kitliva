import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";

type ScreenProps = PropsWithChildren<{
  centered?: boolean;
  noPadding?: boolean;
  style?: ViewStyle;
}>;

export function Screen({ children, centered = false, noPadding = false, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, noPadding && styles.noPadding, centered && styles.centered, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingTop: 0
  },
  centered: {
    alignItems: "center",
    justifyContent: "center"
  }
});
