import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthSocialButton } from "@/components/auth/AuthSocialButton";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export default function SignUpScreen() {
  const router = useRouter();
  const { isSigningUp, signUp } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSignUp() {
    setError(null);
    setSuccess(null);
    const result = await signUp(displayName, email, password);

    if (!result.success) {
      setError(result.message ?? "Something went wrong. Please try again.");
      return;
    }

    if (result.needsEmailConfirmation) {
      setSuccess(result.message ?? "Check your email to confirm your account.");
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <AuthScreen>
      <View style={styles.topRow}>
        <AuthBackButton />
        <Text style={styles.logo}>Kitliva</Text>
      </View>

      <View style={styles.headerBlock}>
        <Text style={styles.title}>Create{`\n`}your account</Text>
        <Text style={styles.subtitle}>Start buying, selling and saving{`\n`}quality hobby gear.</Text>
      </View>

      <View style={styles.formCard}>
        <AuthTextField label="Display name" value={displayName} onChangeText={setDisplayName} autoCapitalize="words" autoComplete="name" textContentType="name" returnKeyType="next" />
        <AuthTextField label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
        <AuthTextField label="Password" value={password} onChangeText={setPassword} secure autoComplete="new-password" textContentType="newPassword" returnKeyType="done" />
        <Text style={styles.helperText}>Use at least 8 characters.</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}

      <View style={styles.primaryWrap}>
        <AuthButton label="Create account" loadingLabel="Creating account..." loading={isSigningUp} onPress={handleSignUp} />
      </View>

      <AuthDivider />
      <AuthSocialButton provider="apple" />
      <AuthSocialButton provider="google" />

      <Pressable style={styles.bottomLink} onPress={() => router.push("/auth/sign-in")}>
        <Text style={styles.bottomText}>Already have an account? <Text style={styles.linkText}>Sign in</Text></Text>
      </Pressable>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0
  },
  logo: {
    marginLeft: 18,
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 23,
    fontWeight: "500"
  },
  headerBlock: {
    marginTop: 14
  },
  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -1,
    lineHeight: 41
  },
  subtitle: {
    marginTop: 6,
    color: "#4F5752",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 19
  },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 14
  },
  helperText: {
    color: "#5F655F",
    fontSize: 11.5,
    fontWeight: "400",
    marginTop: -4
  },
  errorText: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0B9A6",
    backgroundColor: "#FFF7F2",
    color: "#8A4B2A",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10
  },
  successText: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C6E7DC",
    backgroundColor: colors.mint,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10
  },
  primaryWrap: {
    marginTop: 14
  },
  bottomLink: {
    alignItems: "center",
    marginTop: 16
  },
  bottomText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "400"
  },
  linkText: {
    color: "#7B623C",
    fontWeight: "600"
  }
});
