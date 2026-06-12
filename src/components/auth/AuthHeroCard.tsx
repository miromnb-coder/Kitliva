import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const authHeroPremiumGear = require("../../../assets/images/auth/auth-hero-premium-gear.PNG");

const trustRows = [
  {
    title: "Verified profiles",
    subtitle: "Real people, real gear.",
    icon: "shield-checkmark-outline" as const
  },
  {
    title: "Secure conversations",
    subtitle: "Chat safely within the app.",
    icon: "chatbubbles-outline" as const
  },
  {
    title: "Safer buying and selling",
    subtitle: "Clear tools for safer deals.",
    icon: "bag-handle-outline" as const
  }
];

export function AuthHeroCard() {
  return (
    <View style={styles.container}>
      <Image source={authHeroPremiumGear} style={styles.heroImage} contentFit="cover" transition={180} />

      <Text style={styles.headline}>Give great gear{`\n`}a second life</Text>
      <Text style={styles.body}>Join a trusted marketplace for used bikes, skis, cameras, instruments and outdoor gear.</Text>

      <View style={styles.trustList}>
        {trustRows.map((row, index) => (
          <View key={row.title} style={[styles.trustRow, index === trustRows.length - 1 && styles.lastTrustRow]}>
            <View style={styles.iconCircle}>
              <Ionicons name={row.icon} size={23} color={colors.primary} />
            </View>
            <View style={styles.trustTextWrap}>
              <Text style={styles.trustTitle}>{row.title}</Text>
              <Text style={styles.trustSubtitle}>{row.subtitle}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28
  },
  heroImage: {
    width: "100%",
    height: 300,
    borderRadius: 18,
    backgroundColor: "#F7F2EB"
  },
  headline: {
    marginTop: 26,
    color: colors.text,
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -1.1,
    lineHeight: 46
  },
  body: {
    marginTop: 12,
    color: "#4F5752",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22
  },
  trustList: {
    marginTop: 16
  },
  trustRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  lastTrustRow: {
    borderBottomWidth: 0
  },
  iconCircle: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  trustTextWrap: {
    flex: 1,
    marginLeft: 16
  },
  trustTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  trustSubtitle: {
    marginTop: 3,
    color: "#5F655F",
    fontSize: 12.5,
    lineHeight: 16
  }
});
