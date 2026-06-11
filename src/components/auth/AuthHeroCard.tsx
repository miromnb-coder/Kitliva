import { Ionicons } from "@expo/vector-icons";
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
    icon: "bag-check-outline" as const
  }
];

export function AuthHeroCard() {
  return (
    <View style={styles.card}>
      <View style={styles.illustration}>
        <View style={[styles.gearIcon, styles.cameraIcon]}>
          <Ionicons name="camera-outline" size={34} color={colors.primary} />
        </View>
        <View style={[styles.gearIcon, styles.tentIcon]}>
          <Ionicons name="triangle-outline" size={54} color={colors.primary} />
        </View>
        <View style={[styles.gearIcon, styles.skiIcon]}>
          <Ionicons name="trail-sign-outline" size={34} color={colors.primary} />
        </View>
        <View style={[styles.gearIcon, styles.musicIcon]}>
          <Ionicons name="musical-notes-outline" size={33} color={colors.primary} />
        </View>
        <View style={styles.groundLine} />
      </View>

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
    paddingTop: 16,
    paddingBottom: 18,
    marginTop: 28,
    marginBottom: 24
  },
  illustration: {
    height: 160,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    overflow: "hidden"
  },
  gearIcon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "rgba(221, 244, 236, 0.55)"
  },
  cameraIcon: {
    left: 22,
    bottom: 35,
    width: 62,
    height: 62
  },
  tentIcon: {
    left: 104,
    bottom: 31,
    width: 96,
    height: 82,
    backgroundColor: "rgba(221, 244, 236, 0.35)"
  },
  skiIcon: {
    right: 76,
    top: 28,
    width: 54,
    height: 112,
    borderRadius: 24,
    backgroundColor: "transparent"
  },
  musicIcon: {
    right: 17,
    bottom: 30,
    width: 64,
    height: 82
  },
  groundLine: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 32,
    height: 1,
    backgroundColor: "#CFE2DE"
  },
  headline: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 35
  },
  body: {
    marginTop: 9,
    marginBottom: 18,
    color: "#6F8380",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20
  }
});
