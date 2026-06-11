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
        <Text style={styles.title} maxFontSizeMultiplier={1}>Give quality gear{"\n"}a second life</Text>
        <Text style={styles.subtitle}>Trusted community.{"\n"}Better choices.</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={10} color={colors.primary} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="pricetag-outline" size={10} color="#A77C3A" />
            <Text style={styles.badgeText}>Fair price</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 132,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#EFE8DD",
    marginTop: 16
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
    width: "50%",
    backgroundColor: "rgba(250,248,243,0.86)"
  },
  content: {
    width: "50%",
    paddingLeft: 17,
    paddingTop: 22,
    paddingBottom: 14
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 18.5,
    fontWeight: "500",
    letterSpacing: -0.25,
    lineHeight: 23
  },
  subtitle: {
    marginTop: 8,
    color: "#5F655F",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 15
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12
  },
  badge: {
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 8
  },
  badgeText: {
    marginLeft: 3,
    color: "#39433E",
    fontSize: 9.5,
    fontWeight: "500"
  }
});
