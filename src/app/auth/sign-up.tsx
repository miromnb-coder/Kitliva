import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthSocialButton } from "@/components/auth/AuthSocialButton";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

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
      <AuthBackButton />

      <View style={styles.headerBlock}>
        <Text style={styles.title}>Create{`\n`}your account</Text>
        <Text style={styles.subtitle}>Start buying, selling and saving{`\n`}quality hobby gear.</Text>
      </View>

      <View style={styles.formCard}>
        <AuthTextField
          label="Display name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
        <AuthTextField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <AuthTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secure
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
        />
        <Text style={styles.helperText}>Use at least 8 characters.</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}

      <View style={styles.primaryWrap}>
        <AuthButton
          label="Create account"
          loadingLabel="Creating account..."
          loading={isSigningUp}
          onPress={handleSignUp}
        />
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
  headerBlock: {
    marginTop: 24
  },
  title: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 39
  },
  subtitle: {
    marginTop: 5,
    color: "#6F8380",
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 19
  },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    marginTop: 20,
    marginBottom: 11
  },
  helperText: {
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: -4
  },
  errorText: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1C8C2",
    backgroundColor: "#FFF4F2",
    color: "#9F2E23",
    fontSize: 12.5,
    fontWeight: "700",
    lineHeight: 17,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 11
  },
  successText: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C6E7DC",
    backgroundColor: colors.mint,
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "700",
    lineHeight: 17,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 11
  },
  primaryWrap: {
    marginBottom: 16
  },
  bottomLink: {
    alignItems: "center",
    marginTop: 13
  },
  bottomText: {
    color: colors.muted,
    fontSize: 13.5,
    fontWeight: "500"
  },
  linkText: {
    color: colors.primary,
    fontWeight: "800"
  }
});
