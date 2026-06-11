import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthSocialButton } from "@/components/auth/AuthSocialButton";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { colors } from "@/constants/colors";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <AuthScreen>
      <AuthBackButton />

      <View style={styles.headerBlock}>
        <Text style={styles.title}>Create{`\n`}your account</Text>
        <Text style={styles.subtitle}>Start buying, selling and saving{`\n`}quality hobby gear.</Text>
      </View>

      <View style={styles.formCard}>
        <AuthTextField label="Display name" />
        <AuthTextField label="Email address" />
        <AuthTextField label="Password" secure />
        <Text style={styles.helperText}>Use at least 8 characters.</Text>
      </View>

      <View style={styles.primaryWrap}>
        <AuthButton label="Create account" onPress={() => undefined} />
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
    marginBottom: 15
  },
  helperText: {
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: -4
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
