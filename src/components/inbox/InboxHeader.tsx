import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function InboxHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.addButton}>
        <Ionicons name="add" size={25} color={colors.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  title: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.45,
    lineHeight: 34
  },
  addButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.muted
  }
});
