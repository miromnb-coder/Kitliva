import { StyleSheet, Text, View } from "react-native";

import { AuthTrustRow } from "@/components/auth/AuthTrustRow";
import { colors } from "@/constants/colors";

const trustRows = [
  {
    title: "Verified profiles",
    subtitle: "Real people, real gear.",
    icon: "shield-checkmark-outline" as const
  },
  {
    title: "Secure conversations",
    subtitle: "Chat safely within the app.",
    icon: "chatbubble-ellipses-outline" as const
  },
  {
    title: "Safer buying and selling",
    subtitle: "Protected every step of the way.",
    icon: "lock-closed-outline" as const
  }
];

export function AuthHeroCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.headline}>Give great gear{`\n`}a second life</Text>
      <Text style={styles.body}>
        Join a trusted marketplace for used bikes, skis, cameras, instruments and outdoor gear.
      </Text>

      {trustRows.map((row, index) => (
        <AuthTrustRow
          key={row.title}
          title={row.title}
          subtitle={row.subtitle}
          icon={row.icon}
          isLast={index === trustRows.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginTop: 22,
    marginBottom: 18
  },
  headline: {
    color: colors.primary,
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 34
  },
  body: {
    marginTop: 8,
    marginBottom: 13,
    color: "#6F8380",
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 19
  }
});
