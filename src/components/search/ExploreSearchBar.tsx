import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

type ExploreSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  isAIEnabled?: boolean;
  isAILoading?: boolean;
  onToggleAI?: () => void;
  onCloseAI?: () => void;
};

export function ExploreSearchBar({ value, onChangeText, onSubmit, isAIEnabled = false, isAILoading = false, onToggleAI, onCloseAI }: ExploreSearchBarProps) {
  const iconName = isAIEnabled ? "sparkles-outline" : "search-outline";
  const placeholder = isAIEnabled ? "Tell Kitliva what you need..." : "Search gear, brands or activities...";

  return (
    <View style={[styles.container, isAIEnabled && styles.aiContainer]}>
      <Ionicons name={iconName} size={20} color={isAIEnabled ? colors.primary : colors.mutedStrong} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      <View style={styles.actionWrap}>
        {isAILoading ? (
          <View style={styles.actionButton}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isAIEnabled ? (
          <Pressable style={[styles.actionButton, styles.closeButton]} onPress={onCloseAI} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.mutedStrong} />
          </Pressable>
        ) : (
          <Pressable style={[styles.actionButton, styles.aiButton]} onPress={onToggleAI} hitSlop={8}>
            <Ionicons name="sparkles-outline" size={17} color={colors.primary} />
            <View style={styles.aiDot} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingLeft: 14,
    paddingRight: 8
  },
  aiContainer: {
    borderColor: colors.primary,
    backgroundColor: colors.softGreen
  },
  icon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 0
  },
  actionWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6
  },
  actionButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17
  },
  aiButton: {
    backgroundColor: colors.softGreen
  },
  closeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  aiDot: {
    position: "absolute",
    top: 6,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.surface,
    backgroundColor: colors.accent
  }
});
