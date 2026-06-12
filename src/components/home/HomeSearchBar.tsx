import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

type HomeSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function HomeSearchBar({ value, onChangeText }: HomeSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={17} color={colors.inputPlaceholder} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by hobby, brand or item"
        placeholderTextColor={colors.inputPlaceholder}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.text,
    fontSize: 12.2,
    fontWeight: "400",
    paddingVertical: 0
  }
});
