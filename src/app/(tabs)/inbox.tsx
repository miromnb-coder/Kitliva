import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { InboxHeader } from "@/components/inbox/InboxHeader";
import { ActiveDealCard } from "@/components/messages/ActiveDealCard";
import { MessageLoadingRows } from "@/components/messages/MessageLoadingRows";
import { MessageThreadRow } from "@/components/messages/MessageThreadRow";
import { MessageFilter, MessagesFilterTabs } from "@/components/messages/MessagesFilterTabs";
import { MessagesEmptyCard } from "@/components/messages/MessagesEmptyCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { ConversationSummary, getConversations } from "@/services/conversations";
import { Deal, getActiveDealsForUser } from "@/services/deals";

function getConversationRole(conversation: ConversationSummary): "buying" | "selling" {
  return conversation.otherName === "Seller" ? "buying" : "selling";
}

export default function InboxScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [isInboxLoading, setIsInboxLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("all");
  const [retryKey, setRetryKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadConversations() {
        if (!isLoading && !user) {
          router.push("/auth/welcome");
          return;
        }
        if (!user) return;

        setIsInboxLoading(true);
        setHasError(false);
        const [nextConversations, nextDeals] = await Promise.all([getConversations(user.id), getActiveDealsForUser(user.id)]);

        if (isMounted) {
          setConversations(nextConversations);
          setActiveDeals(nextDeals);
          setIsInboxLoading(false);
        }
      }

      loadConversations().catch(() => {
        if (isMounted) {
          setConversations([]);
          setActiveDeals([]);
          setHasError(true);
          setIsInboxLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [isLoading, retryKey, router, user])
  );

  const visibleConversations = useMemo(() => {
    if (activeFilter === "support") return [];
    if (activeFilter === "all") return conversations;
    return conversations.filter((conversation) => getConversationRole(conversation) === activeFilter);
  }, [activeFilter, conversations]);

  const activeDeal = activeDeals[0] ?? null;

  if (isLoading || !user) {
    return (
      <Screen noPadding>
        <View style={styles.screen} />
      </Screen>
    );
  }

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <InboxHeader />
        <Text style={styles.title}>Messages</Text>
        <MessagesFilterTabs activeFilter={activeFilter} onChange={setActiveFilter} />

        {isInboxLoading ? (
          <MessageLoadingRows />
        ) : hasError ? (
          <View>
            <MessagesEmptyCard icon="refresh-outline" title="Could not load messages" message="Please try again in a moment." />
            <Pressable style={styles.retryButton} onPress={() => setRetryKey((current) => current + 1)}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {activeDeal && activeFilter !== "support" ? <ActiveDealCard deal={activeDeal} onPress={() => router.push(`/deal/${activeDeal.id}`)} /> : null}

            {visibleConversations.length === 0 ? (
              <MessagesEmptyCard
                icon="chatbubble-ellipses-outline"
                title={activeFilter === "support" ? "No support messages yet" : "No messages yet"}
                message={activeFilter === "support" ? "Support conversations will appear here when you contact Kitliva." : "Start a conversation from a listing you like."}
              />
            ) : (
              <View style={styles.list}>
                {visibleConversations.map((conversation, index) => (
                  <MessageThreadRow
                    key={conversation.id}
                    conversation={conversation}
                    isLast={index === visibleConversations.length - 1}
                    onPress={() => router.push(`/conversation/${conversation.id}`)}
                  />
                ))}
              </View>
            )}
          </>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 112
  },
  title: {
    marginTop: 22,
    color: colors.text,
    fontSize: 34,
    fontWeight: "600",
    letterSpacing: -0.8,
    lineHeight: 40
  },
  list: {
    marginTop: 22
  },
  retryButton: {
    height: 36,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#171717",
    paddingHorizontal: 18,
    marginTop: 14
  },
  retryText: {
    color: colors.surface,
    fontSize: 12.5,
    fontWeight: "700"
  }
});
