import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { SellPhoto } from "@/types/sell";

type PhotoUploadPreviewProps = { photos: SellPhoto[]; error?: string | null; onAddPhotos: (photos: SellPhoto[]) => void; onRemovePhoto: (photoId: string) => void };

export function PhotoUploadPreview({ photos, error, onAddPhotos, onRemovePhoto }: PhotoUploadPreviewProps) {
  async function pickPhotos() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, selectionLimit: Math.max(1, 6 - photos.length), quality: 0.85 });
    if (result.canceled) return;
    onAddPhotos(result.assets.slice(0, Math.max(0, 6 - photos.length)).map((asset, index) => ({ id: `${Date.now()}-${index}-${asset.uri}`, uri: asset.uri, fileName: asset.fileName, mimeType: asset.mimeType })));
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add photos</Text>
      <Text style={styles.tip}>Good light and clear angles help sell faster.</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.tile}>
            <Image source={{ uri: photo.uri }} style={styles.photo} contentFit="cover" transition={160} />
            <Pressable style={styles.xButton} onPress={() => onRemovePhoto(photo.id)}><Ionicons name="close" size={14} color={colors.text} /></Pressable>
          </View>
        ))}
        {photos.length < 6 ? <Pressable style={styles.addTile} onPress={pickPhotos}><Ionicons name="add" size={30} color={colors.text} /><Text style={styles.addText}>Add photo</Text></Pressable> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 22, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 },
  title: { color: colors.text, fontSize: 16, fontWeight: "600", lineHeight: 20 },
  tip: { marginTop: 6, color: "#5F655F", fontSize: 12, fontWeight: "400", lineHeight: 16 },
  errorText: { marginTop: 8, color: colors.danger, fontSize: 11.5, fontWeight: "600" },
  row: { flexDirection: "row", gap: 8, paddingTop: 16, paddingRight: 2 },
  tile: { width: 86, height: 122, overflow: "hidden", borderRadius: 10, backgroundColor: "#F7F2EB" },
  photo: { width: "100%", height: "100%" },
  xButton: { position: "absolute", top: 6, right: 6, width: 22, height: 22, alignItems: "center", justifyContent: "center", borderRadius: 11, backgroundColor: "rgba(255,255,255,0.92)" },
  addTile: { width: 86, height: 122, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderStyle: "dashed", borderColor: "#CFC7BC", backgroundColor: colors.surface },
  addText: { marginTop: 8, color: "#5F655F", fontSize: 11, fontWeight: "500" }
});
