import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { ConversationMessage, ConversationSummary, getConversation, getMessages, sendMessage } from "@/services/conversations";
import { getConversationOffers, Offer, updateOfferStatus } from "@/services/offers";
import { formatPrice } from "@/utils/formatPrice";

export default function ConversationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, user } = useAuth();
  const [conversation, setConversation] = useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSubscription = Keyboard.addListener(showEvent, (event) => setKeyboardOffset(Math.max(0, event.endCoordinates.height - insets.bottom + 10)));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardOffset(0));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom]);

  const loadConversation = useCallback(async () => {
    if (!user || !id) return;
    const [nextConversation, nextMessages, nextOffers] = await Promise.all([getConversation(id, user.id), getMessages(id), getConversationOffers(id)]);
    setConversation(nextConversation);
    setMessages(nextMessages);
    setOffers(nextOffers);
  }, [id, user]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
        return;
      }

      loadConversation().catch(() => setError("Could not load conversation."));
    }, [isLoading, loadConversation, router, user])
  );

  async function handleSend() {
    if (!user || !id || !draft.trim() || sending) return;
    const body = draft.trim();
    setDraft("");
    setSending(true);
    setError(null);
    setMessages((current) => [...current, { id: `local-${Date.now()}`, senderId: user.id, body, createdAt: new Date().toISOString() }]);
    const result = await sendMessage(id, user.id, body);
    setSending(false);
    if (!result.success) setError(result.message ?? "Could not send message. Try again.");
    else loadConversation();
  }

  async function handleOfferStatus(offerId: string, status: "accepted" | "declined") {
    if (!user) return;
    const result = await updateOfferStatus({ offerId, sellerId: user.id, status });
    if (!result.success) setError(result.message ?? "Could not update offer.");
    else loadConversation();
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  return (
    <Screen noPadding>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="chevron-back" size={22} color={colors.text} /></Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>{conversation?.otherName ?? "Conversation"}</Text>
            <Text style={styles.headerSub} numberOfLines={1}>{conversation?.listingTitle ?? "Marketplace chat"}</Text>
          </View>
          <View style={styles.roundButton}><Ionicons name="ellipsis-horizontal" size={20} color={colors.text} /></View>
        </View>

        {conversation ? (
          <Pressable style={styles.listingCard} onPress={() => router.push(`/listing/${conversation.listingId}`)}>
            {conversation.listingImageUrl ? <Image source={{ uri: conversation.listingImageUrl }} style={styles.listingImage} contentFit="cover" /> : <View style={styles.listingPlaceholder}><Ionicons name="image-outline" size={20} color={colors.primary} /></View>}
            <View style={styles.listingTextWrap}><Text style={styles.listingTitle} numberOfLines={1}>{conversation.listingTitle}</Text><Text style={styles.listingPrice}>{formatPrice(conversation.listingPrice, "EUR")}</Text></View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ) : null}

        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {offers.map((offer) => {
            const isSeller = offer.sellerId === user.id;
            const pending = offer.status === "pending";
            return (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerTopRow}>
                  <Text style={styles.offerTitle}>{isSeller ? "New offer" : "Offer sent"}</Text>
                  <View style={[styles.offerBadge, offer.status !== "pending" && styles.mutedOfferBadge]}><Text style={[styles.offerBadgeText, offer.status !== "pending" && styles.mutedOfferBadgeText]}>{offer.status}</Text></View>
                </View>
                <Text style={styles.offerAmount}>€{offer.amount}</Text>
                {offer.message ? <Text style={styles.offerMessage}>{offer.message}</Text> : null}
                <Text style={styles.offerSub}>{pending ? (isSeller ? "Accept or decline this offer." : "Waiting for seller response") : offer.status === "accepted" ? "Offer accepted" : "Offer declined"}</Text>
                {isSeller && pending ? (
                  <View style={styles.offerActions}>
                    <Pressable style={styles.acceptButton} onPress={() => handleOfferStatus(offer.id, "accepted")}><Text style={styles.acceptText}>Accept</Text></Pressable>
                    <Pressable style={styles.declineButton} onPress={() => handleOfferStatus(offer.id, "declined")}><Text style={styles.declineText}>Decline</Text></Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}

          {messages.length === 0 && offers.length === 0 ? (
            <View style={styles.emptyChat}>
              <Text style={styles.emptyTitle}>Start the conversation</Text>
              <Text style={styles.emptyText}>Ask about condition, pickup or what is included.</Text>
              {["Is this still available?", "Can you ship it?", "What condition is it in?"].map((text) => (
                <Pressable key={text} style={styles.suggestionChip} onPress={() => setDraft(text)}><Text style={styles.suggestionText}>{text}</Text></Pressable>
              ))}
            </View>
          ) : (
            messages.map((message) => {
              const mine = message.senderId === user.id;
              return <View key={message.id} style={[styles.messageRow, mine && styles.myMessageRow]}><View style={[styles.bubble, mine ? styles.myBubble : styles.theirBubble]}><Text style={[styles.bubbleText, mine && styles.myBubbleText]}>{message.body}</Text></View></View>;
            })
          )}
        </ScrollView>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={[styles.composer, { paddingBottom: keyboardOffset > 0 ? 8 : Math.max(insets.bottom + 10, 18) }]}>
          <TextInput style={styles.input} value={draft} onChangeText={setDraft} placeholder="Message..." placeholderTextColor={colors.muted} multiline />
          <Pressable style={[styles.sendButton, !draft.trim() && styles.disabledSend]} onPress={handleSend} disabled={!draft.trim() || sending}><Ionicons name="send" size={17} color={draft.trim() ? colors.surface : colors.muted} /></Pressable>
        </View>
        {keyboardOffset > 0 ? <View style={{ height: keyboardOffset }} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  roundButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  headerTextWrap: { flex: 1, alignItems: "center", paddingHorizontal: 12 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  headerSub: { marginTop: 2, color: colors.muted, fontSize: 11.5, fontWeight: "500" },
  listingCard: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginBottom: 10, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 10 },
  listingImage: { width: 48, height: 48, borderRadius: 11, marginRight: 10 },
  listingPlaceholder: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 11, backgroundColor: colors.mint, marginRight: 10 },
  listingTextWrap: { flex: 1 },
  listingTitle: { color: colors.text, fontSize: 13.5, fontWeight: "800" },
  listingPrice: { marginTop: 3, color: colors.primary, fontSize: 12.5, fontWeight: "800" },
  messages: { flex: 1 },
  messagesContent: { paddingHorizontal: 16, paddingVertical: 12 },
  offerCard: { borderRadius: 16, borderWidth: 1, borderColor: "#BFE9DC", backgroundColor: colors.mint, padding: 13, marginBottom: 12 },
  offerTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  offerTitle: { color: colors.primary, fontSize: 13, fontWeight: "800" },
  offerBadge: { height: 24, justifyContent: "center", borderRadius: 12, backgroundColor: colors.surface, paddingHorizontal: 9 },
  mutedOfferBadge: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  offerBadgeText: { color: colors.primary, fontSize: 11, fontWeight: "800", textTransform: "capitalize" },
  mutedOfferBadgeText: { color: colors.muted },
  offerAmount: { marginTop: 8, color: colors.text, fontSize: 24, fontWeight: "800" },
  offerMessage: { marginTop: 4, color: colors.text, fontSize: 12.5, fontWeight: "600", lineHeight: 18 },
  offerSub: { marginTop: 5, color: "#51706E", fontSize: 12, fontWeight: "600" },
  offerActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  acceptButton: { height: 38, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.primary },
  acceptText: { color: colors.surface, fontSize: 12.5, fontWeight: "800" },
  declineButton: { height: 38, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  declineText: { color: colors.text, fontSize: 12.5, fontWeight: "800" },
  emptyChat: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  emptyText: { marginTop: 5, color: colors.muted, fontSize: 12.5, fontWeight: "500", textAlign: "center" },
  suggestionChip: { minHeight: 34, justifyContent: "center", borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, marginTop: 9 },
  suggestionText: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  messageRow: { flexDirection: "row", marginBottom: 9 },
  myMessageRow: { justifyContent: "flex-end" },
  bubble: { maxWidth: "76%", borderRadius: 16, paddingHorizontal: 13, paddingVertical: 9 },
  myBubble: { backgroundColor: colors.primary, borderTopRightRadius: 5 },
  theirBubble: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderTopLeftRadius: 5 },
  bubbleText: { color: colors.text, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  myBubbleText: { color: colors.surface },
  errorText: { color: colors.primary, fontSize: 12, fontWeight: "700", paddingHorizontal: 16, marginBottom: 6 },
  composer: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 8, backgroundColor: colors.background },
  input: { flex: 1, minHeight: 44, maxHeight: 92, borderRadius: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 11, color: colors.text, fontSize: 13 },
  sendButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: colors.primary, marginLeft: 9 },
  disabledSend: { backgroundColor: colors.border }
});
