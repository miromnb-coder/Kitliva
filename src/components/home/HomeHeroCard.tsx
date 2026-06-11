import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const heroImage = require("../../../assets/images/home/home-hero-gear-collection.PNG");
const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function HomeHeroCard() {
  return (
    <View style={styles.card}>
      <View style={styles.leftPane}>
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

      <View style={styles.imagePane}>
        <Image source={heroImage} style={styles.image} contentFit="cover" contentPosition="center" transition={180} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 126,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F4EFE7",
    marginTop: 14
  },
  leftPane: {
    width: "43%",
    height: "100%",
    backgroundColor: "#F4EFE7",
    paddingLeft: 16,
    paddingTop: 18,
    paddingRight: 6,
    paddingBottom: 12
  },
  imagePane: {
    width: "57%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#EFE8DD"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: 21
  },
  subtitle: {
    marginTop: 7,
    color: "#5F655F",
    fontSize: 10.5,
    fontWeight: "400",
    lineHeight: 14
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
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 7
  },
  badgeText: {
    marginLeft: 3,
    color: "#39433E",
    fontSize: 8.8,
    fontWeight: "500"
  }
});
