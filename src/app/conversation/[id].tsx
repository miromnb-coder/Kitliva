import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Keyboard, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OfferSheet } from "@/components/listing/OfferSheet";
import { KitlivaBottomSheet } from "@/components/sheets/KitlivaBottomSheet";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { ConversationMessage, ConversationSummary, getConversation, getMessages, sendMessage } from "@/services/conversations";
import { Deal, getDealForConversation } from "@/services/deals";
import { createOffer, getConversationOffers, Offer, updateOfferStatus } from "@/services/offers";
import { Listing } from "@/types/listing";

type IconName = keyof typeof Ionicons.glyphMap;
type AttachmentActionId = "take_photo" | "choose_photo" | "share_listing" | "send_location" | "make_offer" | "order_details";

const attachmentActions: { id: AttachmentActionId; label: string; icon: IconName }[] = [
  { id: "take_photo", label: "Take photo", icon: "camera-outline" },
  { id: "choose_photo", label: "Choose photo", icon: "image-outline" },
  { id: "share_listing", label: "Share listing", icon: "share-outline" },
  { id: "send_location", label: "Send location", icon: "location-outline" },
  { id: "make_offer", label: "Make offer", icon: "pricetag-outline" },
  { id: "order_details", label: "Order details", icon: "receipt-outline" }
];

function getDateSeparator(messages: ConversationMessage[]) {
  const firstMessage = messages[0];
  if (!firstMessage) return null;
  const date = new Date(firstMessage.createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
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

function getConversationDisplayId(conversationId?: string) {
  if (!conversationId) return "Order #KTL-78241";
  const cleanId = conversationId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `Order #KTL-${cleanId || "78241"}`;
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
  const [deal, setDeal] = useState<Deal | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerError, setOfferError] = useState<string | null>(null);
  const [isSendingOffer, setIsSendingOffer] = useState(false);

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
    const [nextConversation, nextMessages, nextOffers, nextDeal] = await Promise.all([getConversation(id, user.id), getMessages(id), getConversationOffers(id), getDealForConversation(id)]);
    setConversation(nextConversation);
    setMessages(nextMessages);
    setOffers(nextOffers);
    setDeal(nextDeal);
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

  function toggleAttachmentSheet() {
    Keyboard.dismiss();
    setIsAttachmentSheetOpen((current) => !current);
  }

  function handleCallPress() {
    Alert.alert("Calling", "Calling is not available yet.");
  }

  function handleSafetyPress() {
    Alert.alert("Safe messaging", "Keep conversations and agreements on Kitliva.");
  }

  function openOfferSheet() {
    if (!conversation || !user) return;

    setIsAttachmentSheetOpen(false);
    if (conversation.sellerId === user.id) {
      setError("You cannot make an offer on your own listing.");
      return;
    }

    setOfferError(null);
    setIsOfferOpen(true);
  }

  async function sendOfferFromConversation() {
    if (!conversation || !user || isSendingOffer) return;

    if (!offerAmount.trim()) {
      setOfferError("Please enter an offer amount.");
      return;
    }

    setIsSendingOffer(true);
    setOfferError(null);
    const result = await createOffer({ listingId: conversation.listingId, buyerId: user.id, sellerId: conversation.sellerId, amountLabel: offerAmount, message: offerMessage });
    setIsSendingOffer(false);

    if (!result.success) {
      setOfferError(result.message ?? "Could not send offer. Try again.");
      return;
    }

    setIsOfferOpen(false);
    setOfferAmount("");
    setOfferMessage("");
    loadConversation();
  }

  async function handleAttachmentAction(actionId: AttachmentActionId) {
    if (!conversation) return;

    if (actionId === "make_offer") {
      openOfferSheet();
      return;
    }

    if (actionId === "order_details") {
      setIsAttachmentSheetOpen(false);
      if (deal) router.push(`/deal/${deal.id}`);
      else router.push(`/listing/${conversation.listingId}`);
      return;
    }

    if (actionId === "share_listing") {
      setIsAttachmentSheetOpen(false);
      await Share.share({ message: `Check this Kitliva listing: ${conversation.listingTitle}` });
      return;
    }

    setIsAttachmentSheetOpen(false);
    const comingSoonMap: Record<AttachmentActionId, string> = {
      take_photo: "Camera sharing is coming later.",
      choose_photo: "Photo sharing is coming later.",
      share_listing: "Listing sharing is coming later.",
      send_location: "Location sharing is coming later.",
      make_offer: "Offers are coming later.",
      order_details: "Order details are coming later."
    };
    Alert.alert("Coming soon", comingSoonMap[actionId]);
  }

  const dateSeparator = getDateSeparator(messages);
  const latestOffer = offers[offers.length - 1] ?? null;
  const acceptedOffer = offers.find((offer) => offer.status === "accepted");
  const displayOrderId = getConversationDisplayId(conversation?.id);
  const statusLabel = deal || acceptedOffer ? "In transit" : latestOffer ? `Offer ${getOfferStatusLabel(latestOffer)}` : "Active chat";

  const offerListing = useMemo<Listing | null>(() => {
    if (!conversation) return null;
    return {
      id: conversation.listingId,
      sellerId: conversation.sellerId,
      title: conversation.listingTitle,
      subtitle: "Kitliva conversation",
      category: "outdoor",
      categoryName: "Outdoor",
      price: conversation.listingPrice,
      currency: "EUR",
      imageUrl: conversation.listingImageUrl,
      imageUrls: conversation.listingImageUrl ? [conversation.listingImageUrl] : [],
      imageCount: conversation.listingImageUrl ? 1 : 0,
      condition: "good",
      conditionLabel: "Good condition",
      sellerName: conversation.otherName,
      sellerInitial: conversation.otherInitial,
      sellerLocation: "Location not set",
      sellerDistanceKm: 0,
      sellerRating: 0,
      sellerReviewCount: 0,
      aiPriceMin: Math.max(0, Math.round(conversation.listingPrice * 0.85)),
      aiPriceMax: Math.round(conversation.listingPrice * 1.15),
      aiSimilarListings: 0,
      details: [],
      deliveryOptions: []
    };
  }, [conversation]);

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  return (
    <Screen noPadding>
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 16) }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={26} color={colors.text} /></Pressable>
          <View style={styles.avatar}><Text style={styles.avatarText}>{conversation?.otherInitial ?? "K"}</Text></View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>{conversation?.otherName ?? "Conversation"}</Text>
            <View style={styles.statusRow}><View style={styles.onlineDot} /><Text style={styles.headerSub} numberOfLines={1}>Usually replies quickly</Text></View>
          </View>
          <Pressable style={styles.headerIconButton} onPress={handleCallPress}><Ionicons name="call-outline" size={23} color={colors.text} /></Pressable>
          <Pressable style={styles.headerIconButton} onPress={handleSafetyPress}><Ionicons name="information-circle-outline" size={23} color={colors.text} /></Pressable>
        </View>

        {conversation ? (
          <Pressable style={styles.listingCard} onPress={() => router.push(`/listing/${conversation.listingId}`)}>
            {conversation.listingImageUrl ? <Image source={{ uri: conversation.listingImageUrl }} style={styles.listingImage} contentFit="cover" /> : <View style={styles.listingPlaceholder}><Ionicons name="image-outline" size={24} color={colors.primary} /></View>}
            <View style={styles.listingTextWrap}>
              <Text style={styles.listingTitle} numberOfLines={1}>{conversation.listingTitle}</Text>
              <Text style={styles.listingMeta}>{displayOrderId}</Text>
              <View style={styles.listingPill}><View style={styles.pillDot} /><Text style={styles.pillText}>{statusLabel}</Text></View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        ) : null}

        <Pressable style={styles.safetyCard} onPress={handleSafetyPress}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
          <Text style={styles.safetyText}>Secure payments protected by Kitliva</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
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
              {["Is this still available?", "Can you ship it?", "What condition is it in?"].map((text) => (
                <Pressable key={text} style={styles.suggestionChip} onPress={() => setDraft(text)}><Text style={styles.suggestionText}>{text}</Text></Pressable>
              ))}
            </View>
          ) : (
            messages.map((message, index) => {
              const mine = message.senderId === user.id;
              const isLastTheirMessage = !mine && index === messages.length - 1;
              return (
                <View key={message.id} style={[styles.messageBlock, mine && styles.myMessageBlock]}>
                  {!mine ? <View style={styles.messageAvatar}><Text style={styles.messageAvatarText}>{conversation?.otherInitial ?? "S"}</Text></View> : null}
                  <View style={styles.messageContentWrap}>
                    <View style={[styles.bubble, mine ? styles.myBubble : styles.theirBubble]}>
                      <Text style={styles.bubbleText}>{message.body}</Text>
                    </View>
                    <View style={[styles.timeRow, mine && styles.myTimeRow]}>
                      <Text style={styles.messageTime}>{getTimeLabel(message.createdAt)}</Text>
                      {mine ? <Ionicons name="checkmark-done" size={13} color={colors.muted} style={styles.checkIcon} /> : null}
                    </View>
                    {isLastTheirMessage ? <View style={styles.reactionPill}><Text style={styles.reactionText}>👍</Text></View> : null}
                  </View>
                </View>
              );
            })
          )}

          <Pressable style={styles.systemCard} onPress={() => conversation && (deal ? router.push(`/deal/${deal.id}`) : router.push(`/listing/${conversation.listingId}`))}>
            <View style={styles.systemIcon}><Ionicons name="cube-outline" size={20} color={colors.buttonPrimaryText} /></View>
            <View style={styles.systemTextWrap}>
              <Text style={styles.systemTitle}>{deal || acceptedOffer ? "Order is in transit" : "Active conversation"}</Text>
              <Text style={styles.systemSub}>{deal || acceptedOffer ? "Est. delivery: 18 May" : "Keep pickup, offer and delivery details in chat."}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        </ScrollView>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={[styles.composer, { paddingBottom: keyboardOffset > 0 ? 8 : Math.max(insets.bottom + 8, 16) }]}>
          <Pressable style={styles.plusButton} onPress={toggleAttachmentSheet}><Ionicons name={isAttachmentSheetOpen ? "close" : "add"} size={25} color={isAttachmentSheetOpen ? colors.text : colors.accent} /></Pressable>
          <TextInput style={styles.input} value={draft} onChangeText={setDraft} placeholder="Write a message" placeholderTextColor={colors.inputPlaceholder} multiline />
          <Pressable style={[styles.sendButton, (!draft.trim() || sending) && styles.disabledSend]} onPress={handleSend} disabled={!draft.trim() || sending}><Ionicons name="paper-plane" size={21} color={colors.buttonPrimaryText} /></Pressable>
        </View>
        {keyboardOffset > 0 ? <View style={{ height: keyboardOffset }} /> : null}

        <ChatAttachmentSheet
          visible={isAttachmentSheetOpen}
          draft={draft}
          sending={sending}
          onClose={() => setIsAttachmentSheetOpen(false)}
          onActionPress={handleAttachmentAction}
          onChangeDraft={setDraft}
          onSend={handleSend}
        />

        {offerListing ? (
          <OfferSheet
            visible={isOfferOpen}
            listing={offerListing}
            amount={offerAmount}
            message={offerMessage}
            error={offerError}
            isSending={isSendingOffer}
            onChangeAmount={setOfferAmount}
            onChangeMessage={setOfferMessage}
            onSend={sendOfferFromConversation}
            onClose={() => setIsOfferOpen(false)}
          />
        ) : null}
      </View>
    </Screen>
  );
}

function ChatAttachmentSheet({
  visible,
  draft,
  sending,
  onClose,
  onActionPress,
  onChangeDraft,
  onSend
}: {
  visible: boolean;
  draft: string;
  sending: boolean;
  onClose: () => void;
  onActionPress: (actionId: AttachmentActionId) => void;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <KitlivaBottomSheet visible={visible} title="" snapPoints={["42%"]} showHeader={false} backdropOpacity={0.08} onClose={onClose}>
      <View style={styles.attachmentGrid}>
        {attachmentActions.map((action) => (
          <Pressable key={action.id} style={styles.attachmentTile} onPress={() => onActionPress(action.id)}>
            <Ionicons name={action.icon} size={30} color="#6F633F" />
            <Text style={styles.attachmentLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.sheetComposer}>
        <Pressable style={styles.sheetCloseButton} onPress={onClose}><Ionicons name="close" size={25} color={colors.text} /></Pressable>
        <TextInput style={styles.sheetInput} value={draft} onChangeText={onChangeDraft} placeholder="Write a message" placeholderTextColor={colors.inputPlaceholder} multiline />
        <Pressable style={[styles.sheetSendButton, (!draft.trim() || sending) && styles.disabledSend]} onPress={onSend} disabled={!draft.trim() || sending}><Ionicons name="paper-plane" size={21} color={colors.buttonPrimaryText} /></Pressable>
      </View>
    </KitlivaBottomSheet>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 62, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, backgroundColor: colors.background },
  backButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginLeft: -10, marginRight: 4 },
  avatar: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: colors.softGreen, overflow: "hidden" },
  avatarText: { color: colors.primary, fontSize: 16, fontWeight: "700" },
  headerTextWrap: { flex: 1, marginLeft: 12 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "700", lineHeight: 20 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#7A873E", marginRight: 6 },
  headerSub: { color: colors.muted, fontSize: 12, fontWeight: "400" },
  headerIconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  listingCard: {
    height: 112,
    marginTop: 14,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.035,
    shadowRadius: 10,
    elevation: 2
  },
  listingImage: { width: 92, height: 78, borderRadius: 13, backgroundColor: colors.softGold },
  listingPlaceholder: { width: 92, height: 78, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.softGold },
  listingTextWrap: { flex: 1, marginLeft: 14 },
  listingTitle: { color: colors.text, fontSize: 15.5, fontWeight: "700", lineHeight: 20 },
  listingMeta: { marginTop: 5, color: colors.muted, fontSize: 13, fontWeight: "400" },
  listingPill: { height: 26, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", borderRadius: 13, backgroundColor: colors.softGold, paddingHorizontal: 11, marginTop: 9 },
  pillDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#7A873E", marginRight: 7 },
  pillText: { color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500" },
  safetyCard: { height: 48, marginTop: 14, marginHorizontal: 20, flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.softGold, paddingHorizontal: 16 },
  safetyText: { flex: 1, marginLeft: 10, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500" },
  messages: { flex: 1 },
  messagesContent: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 112 },
  dateSeparator: { alignSelf: "center", marginBottom: 20, color: colors.muted, fontSize: 12, fontWeight: "500", letterSpacing: -0.1 },
  offerCard: { width: "100%", alignSelf: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginVertical: 12 },
  offerTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  offerTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  offerBadge: { height: 24, justifyContent: "center", borderRadius: 12, backgroundColor: colors.softGold, paddingHorizontal: 9 },
  offerBadgeText: { color: colors.mutedStrong, fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  offerAmount: { marginTop: 8, color: colors.text, fontSize: 24, fontWeight: "700" },
  offerMessage: { marginTop: 4, color: colors.text, fontSize: 12.5, fontWeight: "500", lineHeight: 18 },
  offerSub: { marginTop: 5, color: colors.mutedStrong, fontSize: 12, fontWeight: "500" },
  offerActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  acceptButton: { height: 38, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.buttonPrimary },
  acceptText: { color: colors.buttonPrimaryText, fontSize: 12.5, fontWeight: "700" },
  declineButton: { height: 38, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  declineText: { color: colors.text, fontSize: 12.5, fontWeight: "700" },
  emptyChat: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  emptyText: { marginTop: 6, color: colors.muted, fontSize: 12.5, fontWeight: "400", textAlign: "center" },
  suggestionChip: { minHeight: 34, justifyContent: "center", borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, marginTop: 9 },
  suggestionText: { color: colors.primary, fontSize: 12, fontWeight: "700" },
  messageBlock: { flexDirection: "row", alignItems: "flex-end", marginBottom: 18 },
  myMessageBlock: { justifyContent: "flex-end" },
  messageAvatar: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.softGreen, marginRight: 10 },
  messageAvatarText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  messageContentWrap: { maxWidth: "78%" },
  bubble: { borderRadius: 17, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: colors.border },
  theirBubble: { borderBottomLeftRadius: 7, backgroundColor: colors.surface },
  myBubble: { borderBottomRightRadius: 7, backgroundColor: colors.highlight },
  bubbleText: { color: colors.text, fontSize: 14, fontWeight: "400", lineHeight: 20 },
  timeRow: { marginTop: 6, flexDirection: "row", alignItems: "center" },
  myTimeRow: { justifyContent: "flex-end" },
  messageTime: { color: colors.muted, fontSize: 11.5 },
  checkIcon: { marginLeft: 4 },
  reactionPill: { height: 24, alignSelf: "flex-start", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.softGold, paddingHorizontal: 8, marginTop: 4 },
  reactionText: { fontSize: 13 },
  systemCard: { height: 66, marginTop: 12, marginBottom: 8, borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
  systemIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: "#6F7A3D" },
  systemTextWrap: { flex: 1, marginLeft: 12 },
  systemTitle: { color: colors.text, fontSize: 13.5, fontWeight: "700" },
  systemSub: { marginTop: 3, color: colors.muted, fontSize: 12, lineHeight: 17 },
  errorText: { color: colors.primary, fontSize: 12, fontWeight: "700", paddingHorizontal: 20, marginBottom: 6 },
  composer: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingTop: 13, borderTopWidth: 1, borderTopColor: "rgba(229,222,212,0.72)", backgroundColor: colors.background },
  plusButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 42, maxHeight: 96, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 18, paddingVertical: 10, color: colors.text, fontSize: 14 },
  sendButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.accent, shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 5 },
  disabledSend: { opacity: 0.45 },
  attachmentGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12, paddingTop: 12, paddingBottom: 18 },
  attachmentTile: { width: "31%", height: 92, alignItems: "center", justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  attachmentLabel: { marginTop: 10, color: colors.text, fontSize: 12.5, fontWeight: "500", textAlign: "center" },
  sheetComposer: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 8 },
  sheetCloseButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  sheetInput: { flex: 1, minHeight: 42, maxHeight: 82, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 18, paddingVertical: 10, color: colors.text, fontSize: 14 },
  sheetSendButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.accent, shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 5 }
});
