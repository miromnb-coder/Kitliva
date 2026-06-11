import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthSocialButton } from "@/components/auth/AuthSocialButton";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { colors } from "@/constants/colors";

export default function SignInScreen() {
  const router = useRouter();

  return (
    <AuthScreen>
      <AuthBackButton />

      <View style={styles.headerBlock}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to manage listings, messages{`\n`}and saved gear.</Text>
      </View>

      <View style={styles.formCard}>
        <AuthTextField label="Email address" placeholder="Enter your email" />
        <AuthTextField label="Password" placeholder="Enter your password" secure />
        <Text style={styles.forgotText}>Forgot password?</Text>
      </View>

      <View style={styles.primaryWrap}>
        <AuthButton label="Sign in" onPress={() => undefined} />
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
    marginTop: 42
  },
  title: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 44
  },
  subtitle: {
    marginTop: 8,
    color: "#6F8380",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22
  },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 36,
    marginBottom: 24
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
    marginTop: -7
  },
  primaryWrap: {
    marginBottom: 24
  },
  bottomLink: {
    alignItems: "center",
    marginTop: 20
  },
  bottomText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "500"
  },
  linkText: {
    color: colors.primary,
    fontWeight: "800"
  }
});
