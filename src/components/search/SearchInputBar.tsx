import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

type SearchInputBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
};

export function SearchInputBar({ value, onChangeText, onClear }: SearchInputBarProps) {
  return (
    <View style={[styles.searchBar, value ? styles.activeSearchBar : null]}>
      <Ionicons name="search-outline" size={17} color="#6E8080" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search gear, brands or hobbies"
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <Pressable style={styles.clearButton} onPress={onClear}>
          <Ionicons name="close" size={15} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    marginBottom: 14
  },
  activeSearchBar: {
    borderColor: colors.primary
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 13,
    fontWeight: "500"
  },
  clearButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14
  }
});
