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
              <Ionicons name={row.icon} size={19} color={colors.primary} />
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
    marginTop: 12
  },
  heroImage: {
    width: "100%",
    height: 164,
    borderRadius: 18,
    backgroundColor: "#F7F2EB"
  },
  headline: {
    marginTop: 12,
    color: colors.text,
    fontSize: 31,
    fontWeight: "700",
    letterSpacing: -0.8,
    lineHeight: 34
  },
  body: {
    marginTop: 5,
    color: "#4F5752",
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 16
  },
  trustList: {
    marginTop: 7
  },
  trustRow: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  lastTrustRow: {
    borderBottomWidth: 0
  },
  iconCircle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  trustTextWrap: {
    flex: 1,
    marginLeft: 12
  },
  trustTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700"
  },
  trustSubtitle: {
    marginTop: 1,
    color: "#5F655F",
    fontSize: 11,
    lineHeight: 13
  }
});
