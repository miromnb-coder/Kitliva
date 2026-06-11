import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthHeroCard } from "@/components/auth/AuthHeroCard";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

export default function AuthWelcomeScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/(tabs)");
    }
  }, [isLoading, router, user]);

  return (
    <AuthScreen>
      <View style={styles.brandArea}>
        <Text style={styles.brand}>Kitliva</Text>
        <Text style={styles.subtitle}>Buy and sell hobby gear{`\n`}with confidence.</Text>
      </View>

      <AuthHeroCard />

      <View style={styles.actions}>
        <AuthButton label="Create account" onPress={() => router.push("/auth/sign-up")} />
        <View style={styles.buttonGap} />
        <AuthButton label="Sign in" variant="secondary" onPress={() => router.push("/auth/sign-in")} />
        <View style={styles.continueWrap}>
          <AuthButton label="Continue to app  ›" variant="tertiary" onPress={() => router.replace("/(tabs)")} />
        </View>
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to Kitliva terms{`\n`}
        <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  brandArea: {
    marginTop: 0
  },
  brand: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 39
  },
  subtitle: {
    marginTop: 3,
    color: "#6F8380",
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 19
  },
  actions: {
    marginBottom: 9
  },
  buttonGap: {
    height: 8
  },
  continueWrap: {
    marginTop: 10
  },
  terms: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 15,
    textAlign: "center"
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "700"
  }
});
