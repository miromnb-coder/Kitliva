import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthHeroCard } from "@/components/auth/AuthHeroCard";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

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

      <Text style={styles.terms}>By continuing, you agree to Kitliva’s{`\n`}<Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.</Text>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  brandArea: {
    marginTop: 0
  },
  brand: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 34,
    fontWeight: "500",
    lineHeight: 38
  },
  subtitle: {
    marginTop: 6,
    maxWidth: 230,
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 18
  },
  actions: {
    marginTop: 14
  },
  buttonGap: {
    height: 9
  },
  continueWrap: {
    marginTop: 12
  },
  terms: {
    marginTop: 12,
    color: "#5F655F",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 15,
    textAlign: "center"
  },
  termsLink: {
    color: colors.text,
    fontWeight: "700"
  }
});
