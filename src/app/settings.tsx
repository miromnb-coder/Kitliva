import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { AppLanguagePreference, useI18n } from "@/i18n";

const options: { value: AppLanguagePreference; labelKey: string }[] = [
  { value: "system", labelKey: "language.system" },
  { value: "en", labelKey: "language.english" },
  { value: "fi", labelKey: "language.finnish" }
];

export default function SettingsScreen() {
  const router = useRouter();
  const { languagePreference, setLanguagePreference, t } = useI18n();

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>{t("settings.title")}</Text>
        <Text style={styles.subtitle}>{t("settings.subtitle")}</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="language-outline" size={19} color={colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.cardTitle}>{t("settings.languageTitle")}</Text>
              <Text style={styles.cardSubtitle}>{t("settings.languageSubtitle")}</Text>
            </View>
          </View>

          <View style={styles.optionCard}>
            {options.map((option, index) => {
              const selected = languagePreference === option.value;
              return (
                <View key={option.value}>
                  <Pressable style={styles.optionRow} onPress={() => setLanguagePreference(option.value)}>
                    <Text style={styles.optionText}>{t(option.labelKey)}</Text>
                    {selected ? <Text style={styles.currentText}>{t("language.current")}</Text> : null}
                    <Ionicons name={selected ? "checkmark-circle" : "ellipse-outline"} size={21} color={selected ? colors.primary : colors.muted} />
                  </Pressable>
                  {index < options.length - 1 ? <View style={styles.separator} /> : null}
                </View>
              );
            })}
          </View>

          <Text style={styles.helper}>{t("language.description")}</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  backButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: colors.mutedStrong, fontSize: 14.5, lineHeight: 21 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginTop: 18 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: colors.softGreen, marginRight: 12 },
  headerText: { flex: 1 },
  cardTitle: { color: colors.text, fontSize: 15.5, fontWeight: "800", lineHeight: 20 },
  cardSubtitle: { marginTop: 3, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 17 },
  optionCard: { overflow: "hidden", borderRadius: 15, borderWidth: 1, borderColor: colors.border, marginTop: 16 },
  optionRow: { minHeight: 54, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.surface },
  optionText: { flex: 1, color: colors.text, fontSize: 14, fontWeight: "700" },
  currentText: { color: colors.primary, fontSize: 11.5, fontWeight: "800", marginRight: 10 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 14 },
  helper: { marginTop: 12, color: colors.muted, fontSize: 12.5, fontWeight: "500", lineHeight: 17 }
});
