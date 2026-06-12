import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { DetailsStep } from "@/components/sell/DetailsStep";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { getOwnListingById, listingToSellForm, updateOwnListing, updateOwnListingStatus } from "@/services/myListings";
import { Listing } from "@/types/listing";
import { emptySellFormDraft, SellFormDraft } from "@/types/sell";

export default function EditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [form, setForm] = useState<SellFormDraft>(emptySellFormDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadListing() {
        if (!isLoading && !user) {
          router.push("/auth/welcome");
          return;
        }

        if (!user) return;
        if (!id) {
          setListing(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        const nextListing = await getOwnListingById(user.id, id);

        if (isMounted) {
          setListing(nextListing);
          if (nextListing) setForm(listingToSellForm(nextListing));
          setLoading(false);
        }
      }

      loadListing().catch(() => {
        if (isMounted) {
          setListing(null);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [id, isLoading, router, user])
  );

  function updateForm<Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) {
    setMessage(null);
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveChanges() {
    if (!user || !id) return;
    setSaving(true);
    const result = await updateOwnListing(user.id, id, form);
    setSaving(false);
    setMessage(result.success ? "Changes saved" : result.message ?? "Could not save changes.");
  }

  async function changeStatus(nextStatus: "sold" | "archived") {
    if (!user || !id) return;
    setSaving(true);
    const result = await updateOwnListingStatus(user.id, id, nextStatus);
    setSaving(false);
    if (result.success) {
      setMessage(nextStatus === "sold" ? "Listing marked as sold" : "Listing archived");
      router.replace("/my-listings");
    } else {
      setMessage(result.message ?? "Could not update listing.");
    }
  }

  if (isLoading || loading) {
    return <Screen noPadding><View style={styles.centerScreen}><ActivityIndicator color={colors.accent} /><Text style={styles.loadingText}>Loading listing...</Text></View></Screen>;
  }

  if (!listing) {
    return (
      <Screen noPadding>
        <View style={styles.centerScreen}>
          <Text style={styles.notFoundTitle}>Listing unavailable</Text>
          <Text style={styles.notFoundText}>This listing may have been removed or you may not have permission to edit it.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace("/my-listings")}><Text style={styles.primaryButtonText}>Back to my listings</Text></Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.title}>Edit listing</Text>
        <Text style={styles.subtitle}>Update the details buyers see before they message you.</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}><Ionicons name="eye-outline" size={19} color={colors.accent} /></View>
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusTitle}>{listing.status ?? "active"} listing</Text>
            <Text style={styles.statusSub}>Current listing status</Text>
          </View>
        </View>

        <View style={styles.photoCard}>
          <EditListingImage imageUrl={listing.imageUrl} />
          <View style={styles.photoTextWrap}>
            <Text style={styles.photoTitle}>{listing.imageCount ?? 0} photos</Text>
            <Text style={styles.photoSub}>Photo editing coming soon.</Text>
          </View>
        </View>

        {message ? <View style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></View> : null}

        <DetailsStep form={form} onChange={updateForm} />

        <Pressable style={[styles.saveButton, saving && styles.disabledButton]} onPress={saveChanges} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save changes"}</Text>
        </Pressable>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Listing actions</Text>
          <Pressable style={styles.actionRow} onPress={() => changeStatus("sold")}>
            <Ionicons name="checkmark-circle-outline" size={21} color={colors.text} />
            <View style={styles.actionTextWrap}><Text style={styles.actionTitle}>Mark as sold</Text><Text style={styles.actionSub}>Move this item out of active search.</Text></View>
            <Ionicons name="chevron-forward" size={17} color={colors.muted} />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.actionRow} onPress={() => changeStatus("archived")}>
            <Ionicons name="archive-outline" size={21} color={colors.text} />
            <View style={styles.actionTextWrap}><Text style={styles.actionTitle}>Archive listing</Text><Text style={styles.actionSub}>Hide it from buyers without deleting it.</Text></View>
            <Ionicons name="chevron-forward" size={17} color={colors.muted} />
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function EditListingImage({ imageUrl }: { imageUrl: string | null }) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(imageUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  if (shouldShowImage) return <Image source={{ uri: imageUrl as string }} style={styles.photo} contentFit="cover" onError={() => setImageFailed(true)} />;
  return <View style={styles.photoPlaceholder}><Ionicons name="image-outline" size={24} color={colors.primary} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roundButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: colors.mutedStrong, fontSize: 14.5, lineHeight: 21 },
  statusCard: { minHeight: 62, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.softGold, padding: 13, marginTop: 20, marginBottom: 12 },
  statusIcon: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: colors.surface, marginRight: 12 },
  statusTextWrap: { flex: 1 },
  statusTitle: { color: colors.text, fontSize: 14, fontWeight: "700", textTransform: "capitalize" },
  statusSub: { marginTop: 2, color: colors.muted, fontSize: 12, fontWeight: "400" },
  photoCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 13, marginBottom: 14 },
  photo: { width: 58, height: 58, borderRadius: 13, marginRight: 13 },
  photoPlaceholder: { width: 58, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.softGold, marginRight: 13 },
  photoTextWrap: { flex: 1 },
  photoTitle: { color: colors.text, fontSize: 14.5, fontWeight: "700" },
  photoSub: { marginTop: 3, color: colors.muted, fontSize: 12, fontWeight: "400" },
  messageCard: { minHeight: 40, justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.softGold, paddingHorizontal: 12, marginBottom: 14 },
  messageText: { color: colors.link, fontSize: 12.5, fontWeight: "700" },
  saveButton: { height: 50, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.buttonPrimary, marginTop: 4, marginBottom: 16 },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: colors.buttonPrimaryText, fontSize: 15, fontWeight: "700" },
  actionsCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  actionsTitle: { color: colors.text, fontSize: 15.5, fontWeight: "700", marginBottom: 8 },
  actionRow: { flexDirection: "row", alignItems: "center", minHeight: 58 },
  actionTextWrap: { flex: 1, marginLeft: 12 },
  actionTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  actionSub: { marginTop: 2, color: colors.muted, fontSize: 12, fontWeight: "400" },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 3, marginLeft: 33 },
  centerScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  loadingText: { marginTop: 10, color: colors.mutedStrong, fontSize: 13, fontWeight: "600" },
  notFoundTitle: { color: colors.text, fontSize: 21, fontWeight: "700" },
  notFoundText: { marginTop: 8, color: colors.muted, fontSize: 13, fontWeight: "400", textAlign: "center", lineHeight: 18 },
  primaryButton: { height: 44, justifyContent: "center", borderRadius: 22, backgroundColor: colors.buttonPrimary, paddingHorizontal: 18, marginTop: 14 },
  primaryButtonText: { color: colors.buttonPrimaryText, fontSize: 13, fontWeight: "700" }
});
