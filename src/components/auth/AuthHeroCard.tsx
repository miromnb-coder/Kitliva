import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { AuthTrustRow } from "@/components/auth/AuthTrustRow";
import { colors } from "@/constants/colors";

const authGearIllustration = require("../../../assets/images/auth-gear-illustration.PNG");

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
      <Image source={authGearIllustration} style={styles.illustration} contentFit="contain" transition={180} />

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
    paddingTop: 12,
    paddingBottom: 15,
    marginTop: 18,
    marginBottom: 14
  },
  illustration: {
    width: "100%",
    height: 108,
    marginBottom: 10
  },
  headline: {
    color: colors.primary,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 31
  },
  body: {
    marginTop: 7,
    marginBottom: 11,
    color: "#6F8380",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18
  }
});
