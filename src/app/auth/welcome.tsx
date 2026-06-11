import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthHeroCard } from "@/components/auth/AuthHeroCard";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { colors } from "@/constants/colors";

export default function AuthWelcomeScreen() {
  const router = useRouter();

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
        By continuing, you agree to Kitliva’s{`\n`}
        <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  brandArea: {
    marginTop: 2
  },
  brand: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 44
  },
  subtitle: {
    marginTop: 4,
    color: "#6F8380",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20
  },
  actions: {
    marginBottom: 12
  },
  buttonGap: {
    height: 10
  },
  continueWrap: {
    marginTop: 14
  },
  terms: {
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "500",
    lineHeight: 16,
    textAlign: "center"
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "700"
  }
});
