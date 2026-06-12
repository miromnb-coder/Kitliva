import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { SearchSortOption } from "@/types/search";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

type HomeCuratedHeaderProps = {
  sort: SearchSortOption;
  onSortPress: () => void;
};

function getSortLabel(sort: SearchSortOption) {
  if (sort === "newest") return "Newest";
  if (sort === "price_low") return "Price low";
  if (sort === "price_high") return "Price high";
  return "Sort";
}

export function HomeCuratedHeader({ sort, onSortPress }: HomeCuratedHeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Curated gear</Text>
        <Text style={styles.subtitle}>Fresh finds from the Kitliva community</Text>
      </View>
      <Pressable style={styles.sortButton} onPress={onSortPress}>
        <Ionicons name="swap-vertical-outline" size={12.5} color="#A77C3A" />
        <Text style={styles.sortText}>{getSortLabel(sort)}</Text>
        <Ionicons name="chevron-down" size={11} color={colors.muted} style={styles.chevron} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 9
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 21,
    fontWeight: "500",
    letterSpacing: -0.25,
    lineHeight: 26
  },
  subtitle: {
    marginTop: 1,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 14
  },
  sortButton: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 11
  },
  sortText: {
    marginLeft: 5,
    color: "#7B623C",
    fontSize: 11,
    fontWeight: "500"
  },
  chevron: {
    marginLeft: 4
  }
});
