import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

type OfferSheetProps = {
  visible: boolean;
  listing: Listing;
  amount: string;
  message: string;
  error?: string | null;
  isSending?: boolean;
  onChangeAmount: (value: string) => void;
  onChangeMessage: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
};

export function OfferSheet({ visible, listing, amount, message, error, isSending = false, onChangeAmount, onChangeMessage, onSend, onClose }: OfferSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView style={styles.keyboardAvoider} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <View style={styles.headerTextWrap}>
                <Text style={styles.title}>Make an offer</Text>
                <Text style={styles.subtitle}>Send a price the seller can accept or decline.</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={onClose}><Ionicons name="close" size={18} color={colors.text} /></Pressable>
            </View>

            <View style={styles.listingCard}>
              {listing.imageUrl ? <Image source={{ uri: listing.imageUrl }} style={styles.listingImage} contentFit="cover" /> : <View style={styles.listingPlaceholder}><Ionicons name="image-outline" size={20} color={colors.primary} /></View>}
              <View style={styles.listingTextWrap}>
                <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
                <Text style={styles.listingPrice}>Asking price {formatPrice(listing.price, listing.currency)}</Text>
              </View>
            </View>

            {error ? <View style={styles.errorCard}><Text style={styles.errorText}>{error}</Text></View> : null}

            <Text style={styles.label}>Your offer</Text>
            <View style={styles.amountBox}>
              <Text style={styles.currency}>€</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={onChangeAmount}
                placeholder="0"
                placeholderTextColor="#A0A6A1"
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>

            <Text style={styles.label}>Message to seller</Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={onChangeMessage}
              placeholder="I can pick it up this week."
              placeholderTextColor="#A0A6A1"
              multiline
              textAlignVertical="top"
              returnKeyType="default"
            />

            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>No payment is taken yet. The seller can accept or decline your offer.</Text>
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Cancel</Text></Pressable>
              <Pressable style={[styles.primaryButton, isSending && styles.disabledButton]} onPress={onSend} disabled={isSending}><Text style={styles.primaryText}>{isSending ? "Sending..." : "Send offer"}</Text></Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 50 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(16,22,20,0.28)" },
  keyboardAvoider: { flex: 1, justifyContent: "flex-end" },
  sheet: { maxHeight: "92%", borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: colors.background, overflow: "hidden" },
  sheetContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: Platform.OS === "ios" ? 28 : 22 },
  handle: { width: 42, height: 4, alignSelf: "center", borderRadius: 2, backgroundColor: "#D8D1C7", marginBottom: 14 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  headerTextWrap: { flex: 1, paddingRight: 12 },
  title: { color: colors.text, fontSize: 25, fontWeight: "600", letterSpacing: -0.4 },
  subtitle: { marginTop: 4, color: colors.muted, fontSize: 12.5, fontWeight: "400", lineHeight: 17 },
  closeButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  listingCard: { minHeight: 72, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 11, marginBottom: 12 },
  listingImage: { width: 52, height: 52, borderRadius: 12, marginRight: 11 },
  listingPlaceholder: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#F7F2EB", marginRight: 11 },
  listingTextWrap: { flex: 1 },
  listingTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  listingPrice: { marginTop: 4, color: "#7B623C", fontSize: 12.5, fontWeight: "600" },
  errorCard: { minHeight: 38, justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: "#E0B9A6", backgroundColor: "#FFF7F2", paddingHorizontal: 12, marginBottom: 12 },
  errorText: { color: "#8A4B2A", fontSize: 12, fontWeight: "700" },
  label: { color: colors.text, fontSize: 13.5, fontWeight: "700", marginBottom: 7, marginTop: 8 },
  amountBox: { height: 48, flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#D8D1C7", backgroundColor: colors.surface, paddingHorizontal: 14 },
  currency: { color: colors.text, fontSize: 15, fontWeight: "700", marginRight: 7 },
  amountInput: { flex: 1, color: colors.text, fontSize: 15, fontWeight: "700", paddingVertical: 0 },
  messageInput: { minHeight: 96, maxHeight: 126, borderRadius: 13, borderWidth: 1, borderColor: "#D8D1C7", backgroundColor: colors.surface, padding: 12, color: colors.text, fontSize: 13, fontWeight: "400", lineHeight: 18 },
  infoCard: { minHeight: 50, flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", paddingHorizontal: 12, marginTop: 13 },
  infoText: { flex: 1, marginLeft: 9, color: "#5F655F", fontSize: 11.5, fontWeight: "500", lineHeight: 16 },
  actions: { flexDirection: "row", gap: 9, marginTop: 16 },
  secondaryButton: { height: 48, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  secondaryText: { color: colors.text, fontSize: 13, fontWeight: "700" },
  primaryButton: { height: 48, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#171717" },
  disabledButton: { opacity: 0.7 },
  primaryText: { color: colors.surface, fontSize: 13, fontWeight: "700" }
});
