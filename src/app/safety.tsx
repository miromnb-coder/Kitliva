import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

const tips = [
  { icon: "chatbubbles-outline" as const, title: "Keep conversations on Kitliva", body: "Use chat to keep details clear." },
  { icon: "search-outline" as const, title: "Check item condition", body: "Review the item before handoff." },
  { icon: "shield-checkmark-outline" as const, title: "Use clear agreements", body: "Confirm price, pickup and delivery details." },
  { icon: "flag-outline" as const, title: "Report concerns", body: "Tell Kitliva when something feels wrong." }
];

export default function SafetyScreen() {
  const router = useRouter();
  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={styles.title}>Safety center</Text>
        <Text style={styles.subtitle}>Tips and tools for safer buying and selling on Kitliva.</Text>
        <View style={styles.card}>{tips.map((tip) => <View key={tip.title} style={styles.row}><View style={styles.iconCircle}><Ionicons name={tip.icon} size={20} color={colors.primary} /></View><View style={styles.textWrap}><Text style={styles.rowTitle}>{tip.title}</Text><Text style={styles.rowBody}>{tip.body}</Text></View></View>)}</View>
        <View style={styles.noticeCard}><Ionicons name="shield-checkmark-outline" size={21} color={colors.primary} /><Text style={styles.noticeText}>Keep important deal details in Kitliva chat.</Text></View>
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
  card: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 15, marginTop: 20, gap: 10 },
  row: { minHeight: 54, flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: "#F7F2EB", marginRight: 12 },
  textWrap: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 14.5, fontWeight: "700" },
  rowBody: { marginTop: 3, color: colors.muted, fontSize: 12.5, lineHeight: 17 },
  noticeCard: { minHeight: 58, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", paddingHorizontal: 14, marginTop: 14 },
  noticeText: { flex: 1, marginLeft: 10, color: "#5F655F", fontSize: 12.5, lineHeight: 17, fontWeight: "500" }
});
