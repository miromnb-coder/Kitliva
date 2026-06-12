import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/services/profiles";

export default function EditProfileScreen() {
  const router = useRouter();
  const { isLoading, profile, user, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [city, setCity] = useState(profile?.location_city ?? "");
  const [country, setCountry] = useState(profile?.location_country ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveProfile() {
    if (!user || saving) return;
    if (!displayName.trim()) {
      setMessage("Display name is required.");
      return;
    }

    setSaving(true);
    setMessage(null);
    const result = await updateProfile({ userId: user.id, displayName, locationCity: city, locationCountry: country, bio });
    setSaving(false);

    if (result.success) {
      await refreshProfile();
      setMessage("Profile updated");
    } else {
      setMessage(result.message ?? "Could not update profile.");
    }
  }

  if (isLoading || !user) {
    return <Screen noPadding><View style={styles.screen} /></Screen>;
  }

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        </View>

        <Text style={styles.title}>Edit profile</Text>
        <Text style={styles.subtitle}>Keep your seller details clear and trustworthy for buyers.</Text>

        <View style={styles.avatarCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{(displayName || "K").charAt(0).toUpperCase()}</Text></View>
          <View style={styles.avatarTextWrap}>
            <Text style={styles.avatarTitle}>Profile basics</Text>
            <Text style={styles.avatarSub}>Avatar editing is coming later. Your name, location and bio are visible to buyers.</Text>
          </View>
        </View>

        {message ? <View style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></View> : null}

        <View style={styles.formCard}>
          <Field label="Display name" value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
          <Field label="City" value={city} onChangeText={setCity} placeholder="City" />
          <Field label="Country" value={country} onChangeText={setCountry} placeholder="Country" />
          <Field label="Short bio" value={bio} onChangeText={setBio} placeholder="Tell buyers a little about you." multiline />
        </View>

        <Pressable style={[styles.saveButton, saving && styles.disabledButton]} onPress={saveProfile} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save profile"}</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
};

function Field({ label, value, placeholder, multiline = false, onChangeText }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0A6A1"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roundButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  avatarCard: { minHeight: 96, flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginTop: 20, marginBottom: 14 },
  avatar: { width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 32, backgroundColor: colors.mint, marginRight: 14 },
  avatarText: { color: colors.primary, fontSize: 25, fontWeight: "700" },
  avatarTextWrap: { flex: 1 },
  avatarTitle: { color: colors.text, fontSize: 15.5, fontWeight: "700" },
  avatarSub: { marginTop: 5, color: colors.muted, fontSize: 12.5, fontWeight: "400", lineHeight: 18 },
  messageCard: { minHeight: 42, justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", paddingHorizontal: 13, marginBottom: 14 },
  messageText: { color: "#7B623C", fontSize: 12.5, fontWeight: "700" },
  formCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 },
  fieldWrap: { marginBottom: 14 },
  label: { color: colors.text, fontSize: 13.5, fontWeight: "700", marginBottom: 7 },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: "#D8D1C7", backgroundColor: colors.surface, paddingHorizontal: 14, color: colors.text, fontSize: 14, fontWeight: "500" },
  multilineInput: { minHeight: 98, paddingTop: 12, fontWeight: "400", lineHeight: 19 },
  saveButton: { height: 50, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#171717", marginTop: 16 },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: colors.surface, fontSize: 15, fontWeight: "700" }
});
