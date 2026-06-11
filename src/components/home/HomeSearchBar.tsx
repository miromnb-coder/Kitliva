import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function HomeSearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={16} color={colors.muted} />
      <Text style={styles.placeholder}>Search gear, brands or hobbies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13
  },
  placeholder: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500"
  }
});
