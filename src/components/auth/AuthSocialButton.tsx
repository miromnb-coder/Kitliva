import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type AuthSocialButtonProps = {
  provider: "apple" | "google";
  onPress?: () => void;
};

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
        {isApple ? <Ionicons name="logo-apple" size={25} color="#000000" /> : <Text style={styles.googleIcon}>G</Text>}
      </View>
      <Text style={styles.text}>Continue with {isApple ? "Apple" : "Google"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: "transparent",
    marginTop: 14
  },
  iconWrap: {
    width: 34,
    alignItems: "center",
    marginRight: 10
  },
  googleIcon: {
    color: "#4285F4",
    fontSize: 25,
    fontWeight: "900"
  },
  text: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600"
  }
});
