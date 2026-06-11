import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const heroImage = require("../../../assets/images/home/home-hero-gear-collection.PNG");
const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function HomeHeroCard() {
  return (
    <View style={styles.card}>
      <Image source={heroImage} style={styles.image} contentFit="cover" transition={180} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Give quality gear{"\n"}a second life</Text>
        <Text style={styles.subtitle}>Trusted community.{"\n"}Better choices.</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="pricetag-outline" size={12} color="#A77C3A" />
            <Text style={styles.badgeText}>Fair price</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 150,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#EFE8DD",
    marginTop: 18
  },
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "66%",
    height: "100%"
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "54%",
    backgroundColor: "rgba(250,248,243,0.9)"
  },
  content: {
    width: "54%",
    paddingLeft: 20,
    paddingTop: 26,
    paddingBottom: 18
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.3,
    lineHeight: 27
  },
  subtitle: {
    marginTop: 10,
    color: "#5F655F",
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 18
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 17
  },
  badge: {
    height: 27,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 13.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 9
  },
  badgeText: {
    marginLeft: 4,
    color: "#39433E",
    fontSize: 11,
    fontWeight: "500"
  }
});
