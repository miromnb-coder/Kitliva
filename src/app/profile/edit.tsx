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
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="chevron-back" size={22} color={colors.text} /></Pressable>
          <Text style={styles.title}>Edit profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.avatarCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{(displayName || "K").charAt(0).toUpperCase()}</Text></View>
          <View style={styles.avatarTextWrap}>
            <Text style={styles.avatarTitle}>Profile basics</Text>
            <Text style={styles.avatarSub}>Avatar editing is coming later. Keep your seller details clear for buyers.</Text>
          </View>
        </View>

        {message ? <View style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></View> : null}

        <Field label="Display name" value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
        <Field label="City" value={city} onChangeText={setCity} placeholder="City" />
        <Field label="Country" value={country} onChangeText={setCountry} placeholder="Country" />
        <Field label="Short bio" value={bio} onChangeText={setBio} placeholder="Tell buyers a little about you." multiline />

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
        placeholderTextColor={colors.muted}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 118 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  roundButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  headerSpacer: { width: 36 },
  avatarCard: { minHeight: 86, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 13, marginBottom: 14 },
  avatar: { width: 54, height: 54, alignItems: "center", justifyContent: "center", borderRadius: 27, backgroundColor: colors.mint, marginRight: 12 },
  avatarText: { color: colors.primary, fontSize: 22, fontWeight: "800" },
  avatarTextWrap: { flex: 1 },
  avatarTitle: { color: colors.text, fontSize: 15, fontWeight: "800" },
  avatarSub: { marginTop: 4, color: colors.muted, fontSize: 12, fontWeight: "500", lineHeight: 17 },
  messageCard: { minHeight: 40, justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12, marginBottom: 14 },
  messageText: { color: colors.primary, fontSize: 12.5, fontWeight: "800" },
  fieldWrap: { marginBottom: 14 },
  label: { color: colors.text, fontSize: 14, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 13, color: colors.text, fontSize: 13.5, fontWeight: "700" },
  multilineInput: { minHeight: 92, paddingTop: 12, fontWeight: "500", lineHeight: 18 },
  saveButton: { height: 46, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.primary, marginTop: 4 },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: colors.surface, fontSize: 14, fontWeight: "800" }
});
