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

export default function SignInScreen() {
  const router = useRouter();
  const { isSigningIn, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    const result = await signIn(email, password);

    if (!result.success) {
      setError(result.message ?? "Something went wrong. Please try again.");
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <AuthScreen>
      <AuthBackButton />

      <View style={styles.headerBlock}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to manage listings, messages{`\n`}and saved gear.</Text>
      </View>

      <View style={styles.formCard}>
        <AuthTextField
          label="Email address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <AuthTextField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secure
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
        />
        <Text style={styles.forgotText}>Forgot password?</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.primaryWrap}>
        <AuthButton
          label="Sign in"
          loadingLabel="Signing in..."
          loading={isSigningIn}
          onPress={handleSignIn}
        />
      </View>

      <AuthDivider />
      <AuthSocialButton provider="apple" />
      <AuthSocialButton provider="google" />

      <Pressable style={styles.bottomLink} onPress={() => router.push("/auth/sign-up")}>
        <Text style={styles.bottomText}>
          New to Kitliva? <Text style={styles.linkText}>Create account</Text>
        </Text>
      </Pressable>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: 28
  },
  title: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 40
  },
  subtitle: {
    marginTop: 6,
    color: "#6F8380",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20
  },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    marginTop: 24,
    marginBottom: 12
  },
  forgotText: {
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "700",
    textAlign: "right",
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
    marginBottom: 12
  },
  primaryWrap: {
    marginBottom: 18
  },
  bottomLink: {
    alignItems: "center",
    marginTop: 14
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
