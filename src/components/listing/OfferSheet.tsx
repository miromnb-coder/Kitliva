import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
      <View style={styles.sheet}>
        <View style={styles.header}>
          <View>
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
          <TextInput style={styles.amountInput} value={amount} onChangeText={onChangeAmount} placeholder="0" placeholderTextColor={colors.muted} keyboardType="decimal-pad" />
        </View>

        <Text style={styles.label}>Message to seller</Text>
        <TextInput style={styles.messageInput} value={message} onChangeText={onChangeMessage} placeholder="I can pick it up this week." placeholderTextColor={colors.muted} multiline textAlignVertical="top" />

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
          <Text style={styles.infoText}>No payment is taken yet. The seller can accept or decline your offer.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Cancel</Text></Pressable>
          <Pressable style={[styles.primaryButton, isSending && styles.disabledButton]} onPress={onSend} disabled={isSending}><Text style={styles.primaryText}>{isSending ? "Sending..." : "Send offer"}</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 50, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(16,42,42,0.18)" },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 26 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  subtitle: { marginTop: 2, color: colors.muted, fontSize: 12.5, fontWeight: "500" },
  closeButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  listingCard: { minHeight: 66, flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 10, marginBottom: 12 },
  listingImage: { width: 48, height: 48, borderRadius: 11, marginRight: 10 },
  listingPlaceholder: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 11, backgroundColor: colors.mint, marginRight: 10 },
  listingTextWrap: { flex: 1 },
  listingTitle: { color: colors.text, fontSize: 13.5, fontWeight: "800" },
  listingPrice: { marginTop: 3, color: colors.primary, fontSize: 12.5, fontWeight: "800" },
  errorCard: { minHeight: 38, justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12, marginBottom: 12 },
  errorText: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  label: { color: colors.text, fontSize: 14, fontWeight: "800", marginBottom: 7, marginTop: 8 },
  amountBox: { height: 44, flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 13 },
  currency: { color: colors.text, fontSize: 15, fontWeight: "800", marginRight: 7 },
  amountInput: { flex: 1, color: colors.text, fontSize: 15, fontWeight: "800", paddingVertical: 0 },
  messageInput: { minHeight: 78, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12, color: colors.text, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  infoCard: { minHeight: 48, flexDirection: "row", alignItems: "center", borderRadius: 13, borderWidth: 1, borderColor: "#BFE9DC", backgroundColor: colors.mint, paddingHorizontal: 12, marginTop: 13 },
  infoText: { flex: 1, marginLeft: 9, color: colors.primary, fontSize: 11.5, fontWeight: "700", lineHeight: 16 },
  actions: { flexDirection: "row", gap: 9, marginTop: 16 },
  secondaryButton: { height: 46, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  secondaryText: { color: colors.text, fontSize: 13, fontWeight: "800" },
  primaryButton: { height: 46, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.primary },
  disabledButton: { opacity: 0.7 },
  primaryText: { color: colors.surface, fontSize: 13, fontWeight: "800" }
});
