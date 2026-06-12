import { Ionicons } from "@expo/vector-icons";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function InboxHeader() {
  function handleAddPress() {
    Alert.alert("Start from a listing", "Open a listing and tap Message seller to start a conversation.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Kitliva</Text>
      <Pressable style={styles.addButton} onPress={handleAddPress}>
        <Ionicons name="add" size={22} color="#A77C3A" />
      </Pressable>
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
  logo: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: 28
  },
  addButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  }
});
