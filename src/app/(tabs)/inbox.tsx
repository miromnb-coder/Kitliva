import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActiveOrderCard } from "@/components/inbox/ActiveOrderCard";
import { ContactAvatarRow } from "@/components/inbox/ContactAvatarRow";
import { InboxHeader } from "@/components/inbox/InboxHeader";
import { MessageThreadList } from "@/components/inbox/MessageThreadList";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

export default function InboxScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
      }
    }, [isLoading, router, user])
  );

  if (isLoading || !user) {
    return (
      <Screen noPadding>
        <View style={styles.screen} />
      </Screen>
    );
  }

  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InboxHeader />
        <ContactAvatarRow />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active orders</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <ActiveOrderCard />
        <MessageThreadList />
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 118
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  seeAll: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700"
  }
});
