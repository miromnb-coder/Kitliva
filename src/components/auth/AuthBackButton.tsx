import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export function AuthBackButton() {
  const router = useRouter();

  return (
    <Pressable style={styles.button} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={21} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  }
});
