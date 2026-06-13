import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthSocialButton } from "@/components/auth/AuthSocialButton";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { isSigningIn, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    const result = await signIn(email, password);

    if (!result.success) {
      setError(result.message ?? t("common.genericError"));
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <AuthScreen>
      <AuthBackButton />
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{t("auth.welcomeBack")}</Text>
        <Text style={styles.subtitle}>{t("auth.signInSubtitle")}</Text>
      </View>

      <View style={styles.formCard}>
        <AuthTextField label={t("auth.email")} placeholder={t("auth.emailPlaceholder")} value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
        <AuthTextField label={t("auth.password")} placeholder={t("auth.passwordPlaceholder")} value={password} onChangeText={setPassword} secure autoComplete="password" textContentType="password" returnKeyType="done" />
        <Pressable onPress={() => Alert.alert(t("auth.forgotPasswordTitle"), t("auth.forgotPasswordBody"))}>
          <Text style={styles.forgotText}>{t("auth.forgotPassword")}</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.primaryWrap}>
        <AuthButton label={t("auth.signIn")} loadingLabel={t("auth.signingIn")} loading={isSigningIn} onPress={handleSignIn} />
      </View>

      <AuthDivider />
      <AuthSocialButton provider="apple" />
      <AuthSocialButton provider="google" />

      <Pressable style={styles.bottomLink} onPress={() => router.push("/auth/sign-up")}>
        <Text style={styles.bottomText}>{t("auth.newToKitliva")} <Text style={styles.linkText}>{t("auth.createAccount")}</Text></Text>
      </Pressable>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginTop: 34 },
  title: { color: colors.text, fontSize: 42, fontWeight: "700", letterSpacing: -1.1, lineHeight: 47 },
  subtitle: { marginTop: 10, color: colors.mutedStrong, fontSize: 15.5, fontWeight: "400", lineHeight: 22 },
  formCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 20, marginTop: 28 },
  forgotText: { alignSelf: "flex-end", color: colors.link, fontSize: 13.5, fontWeight: "500", marginTop: -4 },
  errorText: { borderRadius: 12, borderWidth: 1, borderColor: colors.dangerBorder, backgroundColor: colors.dangerSurface, color: colors.dangerText, fontSize: 12.5, fontWeight: "700", lineHeight: 17, paddingHorizontal: 12, paddingVertical: 10, marginTop: 12 },
  primaryWrap: { marginTop: 28 },
  bottomLink: { alignItems: "center", marginTop: 24 },
  bottomText: { color: colors.muted, fontSize: 14.5, fontWeight: "400" },
  linkText: { color: colors.link, fontWeight: "600" }
});
