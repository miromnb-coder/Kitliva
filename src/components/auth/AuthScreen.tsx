import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

type AuthScreenProps = PropsWithChildren<{
  compact?: boolean;
}>;

export function AuthScreen({ children, compact = false }: AuthScreenProps) {
  return (
    <Screen noPadding>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={[styles.content, compact && styles.compactContent]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 6,
    paddingBottom: 24
  },
  compactContent: {
    justifyContent: "center"
  }
});
