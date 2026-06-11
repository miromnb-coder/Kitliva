import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { InboxHeader } from "@/components/inbox/InboxHeader";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { ConversationSummary, getConversations } from "@/services/conversations";
import { formatPrice } from "@/utils/formatPrice";

export default function InboxScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isInboxLoading, setIsInboxLoading] = useState(true);

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
        const nextConversations = await getConversations(user.id);

        if (isMounted) {
          setConversations(nextConversations);
          setIsInboxLoading(false);
        }
      }

      loadConversations().catch(() => {
        if (isMounted) {
          setConversations([]);
          setIsInboxLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
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
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <InboxHeader />

        <Text style={styles.sectionTitle}>Messages</Text>

        {isInboxLoading ? (
          <View style={styles.stateCard}><Text style={styles.stateTitle}>Loading inbox...</Text></View>
        ) : conversations.length === 0 ? (
          <View style={styles.stateCard}>
            <View style={styles.stateIcon}><Ionicons name="chatbubble-outline" size={22} color={colors.primary} /></View>
            <Text style={styles.stateTitle}>No messages yet</Text>
            <Text style={styles.stateBody}>When you contact sellers or buyers message you, conversations will appear here.</Text>
            <Pressable style={styles.primaryAction} onPress={() => router.push("/search")}><Text style={styles.primaryActionText}>Browse listings</Text></Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {conversations.map((conversation) => (
              <Pressable key={conversation.id} style={styles.card} onPress={() => router.push(`/conversation/${conversation.id}`)}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{conversation.otherInitial}</Text>
                </View>
                {conversation.listingImageUrl ? <Image source={{ uri: conversation.listingImageUrl }} style={styles.thumb} contentFit="cover" /> : null}
                <View style={styles.cardContent}>
                  <View style={styles.topRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{conversation.listingTitle}</Text>
                    <Text style={styles.timeText}>{conversation.lastMessageAt ? "Recent" : "New"}</Text>
                  </View>
                  <Text style={styles.priceText}>{formatPrice(conversation.listingPrice, "EUR")}</Text>
                  <Text style={styles.messageText} numberOfLines={1}>{conversation.lastMessageText}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 118 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 12 },
  list: { gap: 10 },
  card: { minHeight: 76, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12 },
  avatar: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: colors.mint, marginRight: 10 },
  avatarText: { color: colors.primary, fontSize: 16, fontWeight: "800" },
  thumb: { width: 42, height: 42, borderRadius: 10, marginRight: 10, backgroundColor: "#EDF2F0" },
  cardContent: { flex: 1 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardTitle: { flex: 1, color: colors.text, fontSize: 14, fontWeight: "800" },
  timeText: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  priceText: { marginTop: 2, color: colors.primary, fontSize: 12, fontWeight: "800" },
  messageText: { marginTop: 3, color: colors.muted, fontSize: 12.5, fontWeight: "500" },
  stateCard: { minHeight: 180, alignItems: "center", justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 18 },
  stateIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: colors.mint, marginBottom: 10 },
  stateTitle: { color: colors.text, fontSize: 16, fontWeight: "800", textAlign: "center" },
  stateBody: { marginTop: 5, color: colors.muted, fontSize: 12.5, fontWeight: "500", textAlign: "center", lineHeight: 18 },
  primaryAction: { height: 36, justifyContent: "center", borderRadius: 18, backgroundColor: colors.primary, paddingHorizontal: 16, marginTop: 12 },
  primaryActionText: { color: colors.surface, fontSize: 12.5, fontWeight: "800" }
});
