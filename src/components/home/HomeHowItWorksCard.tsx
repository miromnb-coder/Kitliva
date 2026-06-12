import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const steps = [
  { icon: "search-outline" as const, label: "Find quality used gear" },
  { icon: "chatbubble-ellipses-outline" as const, label: "Message safely" },
  { icon: "hand-left-outline" as const, label: "Agree on pickup or delivery" }
];

export function HomeHowItWorksCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>How Kitliva works</Text>
      <View style={styles.row}>
        {steps.map((step) => (
          <View key={step.label} style={styles.step}>
            <View style={styles.iconCircle}><Ionicons name={step.icon} size={16} color="#A77C3A" /></View>
            <Text style={styles.stepText} numberOfLines={2}>{step.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginTop: 14 },
  title: { color: colors.text, fontSize: 14.5, fontWeight: "700" },
  row: { flexDirection: "row", gap: 8, marginTop: 12 },
  step: { flex: 1, alignItems: "center" },
  iconCircle: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: "#F7F2EB" },
  stepText: { marginTop: 6, color: colors.muted, fontSize: 10.5, fontWeight: "600", lineHeight: 13.5, textAlign: "center" }
});
