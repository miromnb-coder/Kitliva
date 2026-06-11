import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

type AuthScreenProps = PropsWithChildren<{
  compact?: boolean;
}>;

export function AuthScreen({ children, compact = false }: AuthScreenProps) {
  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, compact && styles.compactContent]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28
  },
  compactContent: {
    justifyContent: "center"
  }
});
