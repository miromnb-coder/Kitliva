import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function HomeHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title} maxFontSizeMultiplier={1}>Kitliva</Text>
      <View style={styles.actions}>
        <Pressable style={styles.iconButton} onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={21} color={colors.text} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => router.push("/my-listings")}>
          <Ionicons name="bag-handle-outline" size={21} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: 28
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center"
  }
});
