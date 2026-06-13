import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AiPriceEstimateCard } from "@/components/listing/AiPriceEstimateCard";
import { DeliveryPickupCard } from "@/components/listing/DeliveryPickupCard";
import { ListingActionButtons } from "@/components/listing/ListingActionButtons";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingInfo } from "@/components/listing/ListingInfo";
import { OfferSheet } from "@/components/listing/OfferSheet";
import { SellerRow } from "@/components/listing/SellerRow";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { getOrCreateConversation } from "@/services/conversations";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { getListingById } from "@/services/listings";
import { createOffer } from "@/services/offers";
import { addRecentlyViewedListing } from "@/services/recentlyViewed";
import { Listing } from "@/types/listing";

export default function ListingDetailScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerError, setOfferError] = useState<string | null>(null);
  const [isSendingOffer, setIsSendingOffer] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadListing() {
      if (!id) {
        setListing(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setActionMessage(null);
      const favoriteIds = user ? await getFavoriteListingIds(user.id) : [];
      const nextListing = await getListingById(id, favoriteIds);
      if (nextListing) addRecentlyViewedListing(nextListing.id).catch(() => undefined);
      if (isMounted) {
        setListing(nextListing);
        setIsLoading(false);
      }
    }

    loadListing().catch(() => {
      if (isMounted) {
        setListing(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  function requireAuth() {
    if (!user) {
      router.push("/auth/welcome");
      return false;
    }
    return true;
  }

  async function toggleFavorite() {
    if (!listing || !requireAuth() || !user || isFavoriteLoading) return;
    const nextFavoriteState = !listing.isFavorite;
    setListing({ ...listing, isFavorite: nextFavoriteState });
    setIsFavoriteLoading(true);
    const result = await setListingFavorite({ userId: user.id, listingId: listing.id, shouldFavorite: nextFavoriteState });
    setIsFavoriteLoading(false);
    if (!result.success) setListing({ ...listing, isFavorite: listing.isFavorite });
  }

  async function messageSeller() {
    if (!listing || !requireAuth() || !user) return;
    if (!listing.sellerId) {
      setActionMessage(t("listing.chatOpenError"));
      return;
    }
    const result = await getOrCreateConversation({ listingId: listing.id, buyerId: user.id, sellerId: listing.sellerId });
    if (result.ownListing) {
      setActionMessage(t("listing.ownListingShort"));
      return;
    }
    if (!result.success || !result.conversationId) {
      setActionMessage(t("listing.chatError"));
      return;
    }
    router.push(`/conversation/${result.conversationId}`);
  }

  function openOfferSheet() {
    if (!listing || !requireAuth() || !user) return;
    if (listing.sellerId === user.id) {
      setActionMessage(t("listing.ownListingOffer"));
      return;
    }
    setOfferError(null);
    setIsOfferOpen(true);
  }

  async function sendOffer() {
    if (!listing || !user || isSendingOffer) return;
    if (!offerAmount.trim()) {
      setOfferError(t("listing.offerAmountRequired"));
      return;
    }
    setIsSendingOffer(true);
    setOfferError(null);
    const result = await createOffer({ listingId: listing.id, buyerId: user.id, sellerId: listing.sellerId ?? "", amountLabel: offerAmount, message: offerMessage });
    setIsSendingOffer(false);
    if (!result.success) {
      setOfferError(result.message ?? t("listing.offerSendError"));
      return;
    }
    setIsOfferOpen(false);
    setOfferAmount("");
    setOfferMessage("");
    if (result.conversationId) router.push(`/conversation/${result.conversationId}`);
  }

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingText}>{t("listing.loading")}</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.notFoundScreen}>
        <Text style={styles.notFoundTitle}>{t("listing.notFoundTitle")}</Text>
        <Text style={styles.notFoundSubtitle}>{t("listing.notFoundBody")}</Text>
        <Pressable style={styles.notFoundButton} onPress={() => router.back()}>
          <Text style={styles.notFoundButtonText}>{t("common.goBack")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ListingHero listing={listing} onFavoritePress={toggleFavorite} isFavoriteLoading={isFavoriteLoading} />
        <View style={styles.contentCard}>
          <ListingInfo listing={listing} />
          <SellerRow listing={listing} />
          <ListingDetails listing={listing} />
          <AiPriceEstimateCard listing={listing} />
          {actionMessage ? <View style={styles.actionMessageCard}><Text style={styles.actionMessageText}>{actionMessage}</Text></View> : null}
          <ListingActionButtons onMessage={messageSeller} onOffer={openOfferSheet} />
          <DeliveryPickupCard listing={listing} />
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      <OfferSheet visible={isOfferOpen} listing={listing} amount={offerAmount} message={offerMessage} error={offerError} isSending={isSendingOffer} onChangeAmount={setOfferAmount} onChangeMessage={setOfferMessage} onSend={sendOffer} onClose={() => setIsOfferOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  loadingText: { marginTop: 10, color: colors.mutedStrong, fontSize: 13, fontWeight: "600" },
  contentCard: { marginTop: -24, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 34 },
  actionMessageCard: { borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12, marginTop: 14 },
  actionMessageText: { color: colors.primary, fontSize: 12.5, fontWeight: "700" },
  bottomSpacer: { height: 10 },
  notFoundScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  notFoundTitle: { color: colors.text, fontSize: 22, fontWeight: "800" },
  notFoundSubtitle: { marginTop: 8, color: colors.muted, fontSize: 14, fontWeight: "500", textAlign: "center", lineHeight: 20 },
  notFoundButton: { height: 46, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: colors.buttonPrimary, paddingHorizontal: 22, marginTop: 18 },
  notFoundButtonText: { color: colors.buttonPrimaryText, fontSize: 14, fontWeight: "700" }
});
