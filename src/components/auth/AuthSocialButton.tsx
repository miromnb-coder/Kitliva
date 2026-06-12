import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type AuthSocialButtonProps = {
  provider: "apple" | "google";
  onPress?: () => void;
};

const googleMarkSource = { uri: "https://developers.google.com/identity/images/g-logo.png" };

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
        {isApple ? <Ionicons name="logo-apple" size={22} color="#000000" /> : <Image source={googleMarkSource} style={styles.googleImage} contentFit="contain" />}
      </View>
      <Text style={styles.text}>Continue with {isApple ? "Apple" : "Google"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: "transparent",
    marginTop: 8
  },
  iconWrap: {
    width: 30,
    alignItems: "center",
    marginRight: 8
  },
  googleImage: {
    width: 21,
    height: 21
  },
  text: {
    color: colors.text,
    fontSize: 15.5,
    fontWeight: "600"
  }
});
