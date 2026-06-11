import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type AuthSocialButtonProps = {
  provider: "apple" | "google";
  onPress?: () => void;
};

export function AuthSocialButton({ provider, onPress }: AuthSocialButtonProps) {
  const isApple = provider === "apple";

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <View style={styles.iconWrap}>
        {isApple ? (
          <Ionicons name="logo-apple" size={20} color="#000000" />
        ) : (
          <Text style={styles.googleIcon}>G</Text>
        )}
      </View>
      <Text style={styles.text}>Continue with {isApple ? "Apple" : "Google"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    marginBottom: 8
  },
  iconWrap: {
    width: 28,
    alignItems: "center",
    marginRight: 9
  },
  googleIcon: {
    color: "#4285F4",
    fontSize: 20,
    fontWeight: "900"
  },
  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  }
});
