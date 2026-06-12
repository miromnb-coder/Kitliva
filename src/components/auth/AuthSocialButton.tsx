import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type AuthSocialButtonProps = {
  provider: "apple" | "google";
  onPress?: () => void;
};

function GoogleMark() {
  return (
    <View style={styles.googleMark}>
      <Text style={[styles.googleLetter, styles.googleBlue]}>G</Text>
      <Text style={[styles.googleLetter, styles.googleRed]}>G</Text>
      <Text style={[styles.googleLetter, styles.googleYellow]}>G</Text>
      <Text style={[styles.googleLetter, styles.googleGreen]}>G</Text>
      <Text style={styles.googleCenter}>G</Text>
    </View>
  );
}

export function AuthSocialButton({ provider, onPress }: AuthSocialButtonProps) {
  const isApple = provider === "apple";

  function handlePress() {
    if (onPress) {
      onPress();
      return;
    }
    Alert.alert(isApple ? "Apple sign in" : "Google sign in", `${isApple ? "Apple" : "Google"} sign in is coming later.`);
  }

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <View style={styles.iconWrap}>
        {isApple ? <Ionicons name="logo-apple" size={23} color="#000000" /> : <GoogleMark />}
      </View>
      <Text style={styles.text}>Continue with {isApple ? "Apple" : "Google"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: "transparent",
    marginTop: 10
  },
  iconWrap: {
    width: 32,
    alignItems: "center",
    marginRight: 10
  },
  googleMark: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  googleLetter: {
    position: "absolute",
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 24
  },
  googleBlue: {
    color: "#4285F4"
  },
  googleRed: {
    color: "#EA4335",
    transform: [{ rotate: "-32deg" }],
    opacity: 0.92
  },
  googleYellow: {
    color: "#FBBC05",
    transform: [{ rotate: "28deg" }],
    opacity: 0.9
  },
  googleGreen: {
    color: "#34A853",
    transform: [{ rotate: "72deg" }],
    opacity: 0.86
  },
  googleCenter: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 13
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600"
  }
});
