import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function HomeSearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color="#8C908A" />
      <Text style={styles.placeholder}>Search by hobby, brand or item</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16
  },
  placeholder: {
    color: "#8C908A",
    fontSize: 13.5,
    fontWeight: "400"
  }
});
