import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const heroImage = require("../../../assets/images/home/home-hero-gear-collection.PNG");
const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function HomeHeroCard() {
  return (
    <View style={styles.card}>
      <Image source={heroImage} style={styles.image} contentFit="cover" contentPosition="72% center" transition={180} />
      <LinearGradient
        colors={["rgba(247,245,239,0.78)", "rgba(247,245,239,0.2)", "rgba(247,245,239,0)"]}
        locations={[0, 0.46, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.title} maxFontSizeMultiplier={1}>Give quality gear{"\n"}a second life</Text>
        <Text style={styles.subtitle}>Trusted community.{"\n"}Better choices.</Text>
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
    backgroundColor: colors.highlight,
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
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
  content: {
    width: "43%",
    height: "100%",
    paddingLeft: 16,
    paddingTop: 20,
    paddingRight: 2,
    paddingBottom: 12
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.18,
    lineHeight: 20,
    textShadowColor: "rgba(247, 245, 239, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8
  },
  subtitle: {
    marginTop: 8,
    color: colors.mutedStrong,
    fontSize: 10.5,
    fontWeight: "400",
    lineHeight: 14,
    textShadowColor: "rgba(247, 245, 239, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8
  }
});
