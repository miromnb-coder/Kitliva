import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { ConversationMessage, ConversationSummary, getConversation, getMessages, sendMessage } from "@/services/conversations";
import { getConversationOffers, Offer, updateOfferStatus } from "@/services/offers";
import { formatPrice } from "@/utils/formatPrice";

function getDateSeparator(messages: ConversationMessage[]) {
  const firstMessage = messages[0];
  if (!firstMessage) return null;
  const date = new Date(firstMessage.createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
}

function getTimeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getOfferTitle(offer: Offer, isSeller: boolean) {
  if (offer.status === "accepted") return "Offer accepted";
  if (offer.status === "declined") return "Offer declined";
  return isSeller ? "New offer" : "Offer sent";
}

function getOfferStatusLabel(offer: Offer) {
  if (offer.status === "pending") return "pending";
  if (offer.status === "accepted") return "accepted";
  return "declined";
}

export default function ConversationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView | null>(null);
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

      setError(null);
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

  function handleAttachmentPress() {
    Alert.alert("Attachments", "Attachments are coming later.");
  }

  function handleCallPress() {
    Alert.alert("Calling", "Calling is not available yet.");
  }

  function handleSafetyPress() {
    Alert.alert("Safe messaging", "Keep conversations and agreements on Kitliva.");
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  const dateSeparator = getDateSeparator(messages);
  const latestOffer = offers[offers.length - 1] ?? null;
  const acceptedOffer = offers.find((offer) => offer.status === "accepted");

  return (
    <Screen noPadding>
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
          <View style={styles.avatar}><Text style={styles.avatarText}>{conversation?.otherInitial ?? "K"}</Text></View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>{conversation?.otherName ?? "Conversation"}</Text>
            <View style={styles.statusRow}><View style={styles.onlineDot} /><Text style={styles.headerSub} numberOfLines={1}>Active conversation</Text></View>
          </View>
          <Pressable style={styles.headerIconButton} onPress={handleCallPress}><Ionicons name="call-outline" size={22} color={colors.text} /></Pressable>
          <Pressable style={styles.headerIconButton} onPress={handleSafetyPress}><Ionicons name="information-circle-outline" size={22} color={colors.text} /></Pressable>
        </View>

        {conversation ? (
          <Pressable style={styles.listingCard} onPress={() => router.push(`/listing/${conversation.listingId}`)}>
            {conversation.listingImageUrl ? <Image source={{ uri: conversation.listingImageUrl }} style={styles.listingImage} contentFit="cover" /> : <View style={styles.listingPlaceholder}><Ionicons name="image-outline" size={24} color={colors.primary} /></View>}
            <View style={styles.listingTextWrap}>
              <Text style={styles.listingTitle} numberOfLines={2}>{conversation.listingTitle}</Text>
              <Text style={styles.listingMeta}>{formatPrice(conversation.listingPrice, "EUR")}</Text>
              <View style={styles.listingPill}><View style={styles.pillDot} /><Text style={styles.pillText}>{latestOffer ? `Offer ${getOfferStatusLabel(latestOffer)}` : "Active chat"}</Text></View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ) : null}

        <Pressable style={styles.safetyCard} onPress={handleSafetyPress}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={styles.safetyText}>Safe messaging on Kitliva</Text>
          <Ionicons name="chevron-forward" size={17} color={colors.muted} />
        </Pressable>

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {dateSeparator ? <Text style={styles.dateSeparator}>{dateSeparator}</Text> : null}

          {offers.map((offer) => {
            const isSeller = offer.sellerId === user.id;
            const pending = offer.status === "pending";
            return (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerTopRow}>
                  <Text style={styles.offerTitle}>{getOfferTitle(offer, isSeller)}</Text>
                  <View style={styles.offerBadge}><Text style={styles.offerBadgeText}>{offer.status}</Text></View>
                </View>
                <Text style={styles.offerAmount}>€{offer.amount}</Text>
                {offer.message ? <Text style={styles.offerMessage}>{offer.message}</Text> : null}
                <Text style={styles.offerSub}>{pending ? (isSeller ? "Accept or decline this offer." : "Waiting for seller response") : offer.status === "accepted" ? "Continue arranging pickup or delivery in chat." : "This offer was declined."}</Text>
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
              {[
                "Is this still available?",
                "Can you ship it?",
                "What condition is it in?"
              ].map((text) => (
                <Pressable key={text} style={styles.suggestionChip} onPress={() => setDraft(text)}><Text style={styles.suggestionText}>{text}</Text></Pressable>
              ))}
            </View>
          ) : (
            messages.map((message) => {
              const mine = message.senderId === user.id;
              return (
                <View key={message.id} style={[styles.messageBlock, mine && styles.myMessageBlock]}>
                  {!mine ? <View style={styles.messageAvatar}><Text style={styles.messageAvatarText}>{conversation?.otherInitial ?? "S"}</Text></View> : null}
                  <View style={styles.messageContentWrap}>
                    <View style={[styles.bubble, mine ? styles.myBubble : styles.theirBubble]}>
                      <Text style={styles.bubbleText}>{message.body}</Text>
                    </View>
                    <View style={[styles.timeRow, mine && styles.myTimeRow]}>
                      <Text style={styles.messageTime}>{getTimeLabel(message.createdAt)}</Text>
                      {mine ? <Ionicons name="checkmark-done" size={14} color={colors.muted} style={styles.checkIcon} /> : null}
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {acceptedOffer ? (
            <View style={styles.systemCard}>
              <View style={styles.systemIcon}><Ionicons name="cube-outline" size={20} color={colors.surface} /></View>
              <View style={styles.systemTextWrap}>
                <Text style={styles.systemTitle}>Deal agreed</Text>
                <Text style={styles.systemSub}>Continue arranging pickup or delivery in chat.</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={colors.muted} />
            </View>
          ) : null}
        </ScrollView>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={[styles.composer, { paddingBottom: keyboardOffset > 0 ? 8 : Math.max(insets.bottom + 10, 18) }]}>
          <Pressable style={styles.plusButton} onPress={handleAttachmentPress}><Ionicons name="add" size={24} color="#A77C3A" /></Pressable>
          <TextInput style={styles.input} value={draft} onChangeText={setDraft} placeholder="Write a message" placeholderTextColor="#A0A6A1" multiline />
          <Pressable style={[styles.sendButton, (!draft.trim() || sending) && styles.disabledSend]} onPress={handleSend} disabled={!draft.trim() || sending}><Ionicons name="paper-plane" size={21} color={colors.surface} /></Pressable>
        </View>
        {keyboardOffset > 0 ? <View style={{ height: keyboardOffset }} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 64, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, backgroundColor: colors.background },
  backButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", marginRight: 10 },
  avatar: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#F7F2EB", overflow: "hidden" },
  avatarText: { color: colors.primary, fontSize: 16, fontWeight: "700" },
  headerTextWrap: { flex: 1, marginLeft: 12 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "700", lineHeight: 20 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#7A8A3A", marginRight: 6 },
  headerSub: { color: colors.muted, fontSize: 12, fontWeight: "400" },
  headerIconButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  listingCard: { height: 114, marginTop: 14, marginHorizontal: 20, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  listingImage: { width: 112, height: 86, borderRadius: 12, backgroundColor: "#F7F2EB" },
  listingPlaceholder: { width: 112, height: 86, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#F7F2EB" },
  listingTextWrap: { flex: 1, marginLeft: 14 },
  listingTitle: { color: colors.text, fontSize: 15.5, fontWeight: "700", lineHeight: 20 },
  listingMeta: { marginTop: 6, color: colors.muted, fontSize: 12.5, fontWeight: "500" },
  listingPill: { height: 26, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", borderRadius: 13, backgroundColor: "#F7F2EB", paddingHorizontal: 10, marginTop: 9 },
  pillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#A77C3A", marginRight: 6 },
  pillText: { color: "#5F655F", fontSize: 11.5, fontWeight: "500" },
  safetyCard: { height: 52, marginTop: 14, marginHorizontal: 20, flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", paddingHorizontal: 14 },
  safetyText: { flex: 1, marginLeft: 10, color: "#5F655F", fontSize: 13, fontWeight: "500" },
  messages: { flex: 1 },
  messagesContent: { paddingHorizontal: 20, paddingTop: 26, paddingBottom: 112 },
  dateSeparator: { alignSelf: "center", marginBottom: 18, color: colors.muted, fontSize: 12.5, fontWeight: "400" },
  offerCard: { width: "100%", alignSelf: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginVertical: 12 },
  offerTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  offerTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  offerBadge: { height: 24, justifyContent: "center", borderRadius: 12, backgroundColor: "#F7F2EB", paddingHorizontal: 9 },
  offerBadgeText: { color: "#5F655F", fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  offerAmount: { marginTop: 8, color: colors.text, fontSize: 24, fontWeight: "700" },
  offerMessage: { marginTop: 4, color: colors.text, fontSize: 12.5, fontWeight: "500", lineHeight: 18 },
  offerSub: { marginTop: 5, color: "#5F655F", fontSize: 12, fontWeight: "500" },
  offerActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  acceptButton: { height: 38, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#171717" },
  acceptText: { color: colors.surface, fontSize: 12.5, fontWeight: "700" },
  declineButton: { height: 38, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  declineText: { color: colors.text, fontSize: 12.5, fontWeight: "700" },
  emptyChat: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  emptyText: { marginTop: 6, color: colors.muted, fontSize: 12.5, fontWeight: "400", textAlign: "center" },
  suggestionChip: { minHeight: 34, justifyContent: "center", borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, marginTop: 9 },
  suggestionText: { color: colors.primary, fontSize: 12, fontWeight: "700" },
  messageBlock: { flexDirection: "row", alignItems: "flex-end", marginBottom: 18 },
  myMessageBlock: { justifyContent: "flex-end" },
  messageAvatar: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: "#F7F2EB", marginRight: 10 },
  messageAvatarText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  messageContentWrap: { maxWidth: "78%" },
  bubble: { borderRadius: 17, paddingHorizontal: 15, paddingVertical: 12 },
  theirBubble: { borderBottomLeftRadius: 6, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  myBubble: { borderBottomRightRadius: 6, borderWidth: 1, borderColor: "#E7D8C8", backgroundColor: "#F7F2EB" },
  bubbleText: { color: colors.text, fontSize: 15, fontWeight: "400", lineHeight: 21 },
  timeRow: { marginTop: 7, flexDirection: "row", alignItems: "center" },
  myTimeRow: { justifyContent: "flex-end" },
  messageTime: { color: colors.muted, fontSize: 12 },
  checkIcon: { marginLeft: 4 },
  systemCard: { marginTop: 12, marginBottom: 8, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, flexDirection: "row", alignItems: "center" },
  systemIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#7A8A3A" },
  systemTextWrap: { flex: 1, marginLeft: 12 },
  systemTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  systemSub: { marginTop: 3, color: colors.muted, fontSize: 12.5, lineHeight: 17 },
  errorText: { color: colors.primary, fontSize: 12, fontWeight: "700", paddingHorizontal: 20, marginBottom: 6 },
  composer: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: "rgba(250,248,243,0.96)" },
  plusButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 48, maxHeight: 96, borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 18, paddingVertical: 13, color: colors.text, fontSize: 14 },
  sendButton: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 26, backgroundColor: "#A77C3A" },
  disabledSend: { opacity: 0.45 }
});
