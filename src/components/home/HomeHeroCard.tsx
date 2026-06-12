import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const heroImage = require("../../../assets/images/home/home-hero-gear-collection.PNG");
const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function HomeHeroCard() {
  return (
    <View style={styles.card}>
      <Image source={heroImage} style={styles.image} contentFit="cover" contentPosition="right center" transition={180} />
      <View style={styles.content}>
        <Text style={styles.title} maxFontSizeMultiplier={1}>Give quality gear{"\n"}a second life</Text>
        <Text style={styles.subtitle}>Trusted community.{"\n"}Better choices.</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={9} color={colors.primary} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="pricetag-outline" size={9} color="#A77C3A" />
            <Text style={styles.badgeText}>Fair price</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 126,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F4EFE7",
    marginTop: 14
  },
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%"
  },
  content: {
    width: "44%",
    height: "100%",
    paddingLeft: 16,
    paddingTop: 18,
    paddingRight: 4,
    paddingBottom: 12
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: 21,
    textShadowColor: "rgba(250, 248, 243, 0.72)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 9
  },
  subtitle: {
    marginTop: 7,
    color: "#4F5752",
    fontSize: 10.5,
    fontWeight: "400",
    lineHeight: 14,
    textShadowColor: "rgba(250, 248, 243, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8
  },
  badgeRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 10
  },
  badge: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingHorizontal: 7
  },
  badgeText: {
    marginLeft: 3,
    color: "#39433E",
    fontSize: 8.8,
    fontWeight: "500"
  }
});
