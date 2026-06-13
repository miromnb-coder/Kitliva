import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { SearchSortOption } from "@/types/search";

type ExploreResultsHeaderProps = {
  count: number;
  sort: SearchSortOption;
  onSortPress: () => void;
};

function getSortLabelKey(sort: SearchSortOption) {
  if (sort === "newest") return "explore.results.newest";
  if (sort === "price_low") return "explore.results.priceLow";
  if (sort === "price_high") return "explore.results.priceHigh";
  return "explore.results.recommended";
}

export function ExploreResultsHeader({ count, sort, onSortPress }: ExploreResultsHeaderProps) {
  const { t } = useI18n();
  const sortLabel = t(getSortLabelKey(sort));

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{t("explore.results.title")}</Text>
        <Text style={styles.count}>{t("explore.results.count", { count })}</Text>
      </View>

      <Pressable style={styles.sortButton} onPress={onSortPress}>
        <Ionicons name="swap-vertical-outline" size={13} color={colors.accent} style={styles.sortIcon} />
        <Text style={styles.sortText}>{t("explore.results.sort", { label: sortLabel })}</Text>
        <Ionicons name="chevron-down" size={12} color={colors.muted} style={styles.chevron} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 19
  },
  count: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 14
  },
  sortButton: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  sortIcon: {
    marginRight: 5
  },
  sortText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "500"
  },
  chevron: {
    marginLeft: 5
  }
});
