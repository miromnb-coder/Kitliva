import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { createReport } from "@/services/safety";

const reasons = ["Wrong details", "Wrong category", "Duplicate", "Not allowed", "Other"];

export default function ListingFeedbackScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, user } = useAuth();
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!user || !id || sending) return;
    setSending(true);
    const result = await createReport({ reporterId: user.id, type: "listing", listingId: id, reason, details });
    setSending(false);
    setMessage(result.success ? "Sent. Thank you for helping Kitliva." : result.message ?? "Could not send this.");
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={styles.title}>Listing feedback</Text>
        <Text style={styles.subtitle}>Tell us what does not look right.</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Reason</Text>
          <View style={styles.chips}>{reasons.map((item) => <Pressable key={item} style={[styles.chip, reason === item && styles.selectedChip]} onPress={() => setReason(item)}><Text style={[styles.chipText, reason === item && styles.selectedChipText]}>{item}</Text></Pressable>)}</View>
          <Text style={styles.label}>Details</Text>
          <TextInput style={styles.input} value={details} onChangeText={setDetails} placeholder="Add helpful context." placeholderTextColor="#A0A6A1" multiline textAlignVertical="top" />
        </View>
        {message ? <View style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></View> : null}
        <Pressable style={[styles.primaryButton, sending && styles.disabled]} onPress={submit} disabled={sending}><Text style={styles.primaryText}>{sending ? "Sending..." : "Send"}</Text></Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  backButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginTop: 20 },
  label: { color: colors.text, fontSize: 14, fontWeight: "700", marginBottom: 9, marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { height: 34, justifyContent: "center", borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  selectedChip: { backgroundColor: "#171717", borderColor: "#171717" },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  selectedChipText: { color: colors.surface },
  input: { minHeight: 110, borderRadius: 13, borderWidth: 1, borderColor: "#D8D1C7", backgroundColor: colors.surface, padding: 12, color: colors.text, fontSize: 13.5, lineHeight: 19 },
  messageCard: { minHeight: 44, justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", paddingHorizontal: 12, marginTop: 14 },
  messageText: { color: "#7B623C", fontSize: 12.5, fontWeight: "700" },
  primaryButton: { height: 52, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: "#171717", marginTop: 16 },
  disabled: { opacity: 0.7 },
  primaryText: { color: colors.surface, fontSize: 15, fontWeight: "700" }
});
