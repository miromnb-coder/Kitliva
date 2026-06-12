import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { SellPhoto } from "@/types/sell";

type PhotoUploadPreviewProps = { photos: SellPhoto[]; error?: string | null; onAddPhotos: (photos: SellPhoto[]) => void; onRemovePhoto: (photoId: string) => void };

export function PhotoUploadPreview({ photos, error, onAddPhotos, onRemovePhoto }: PhotoUploadPreviewProps) {
  const [failedPhotoIds, setFailedPhotoIds] = useState<string[]>([]);

  async function pickPhotos() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, selectionLimit: Math.max(1, 6 - photos.length), quality: 0.85 });
    if (result.canceled) return;
    onAddPhotos(result.assets.slice(0, Math.max(0, 6 - photos.length)).map((asset, index) => ({ id: `${Date.now()}-${index}-${asset.uri}`, uri: asset.uri, fileName: asset.fileName, mimeType: asset.mimeType })));
  }

  function markPhotoFailed(photoId: string) {
    setFailedPhotoIds((currentIds) => currentIds.includes(photoId) ? currentIds : [...currentIds, photoId]);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add photos</Text>
      <Text style={styles.tip}>Start with clear photos. The first photo becomes your cover.</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {photos.map((photo) => {
          const failed = failedPhotoIds.includes(photo.id);
          return (
            <View key={photo.id} style={styles.tile}>
              {failed ? (
                <View style={styles.photoFallback}>
                  <Ionicons name="image-outline" size={24} color={colors.primary} />
                </View>
              ) : (
                <Image source={{ uri: photo.uri }} style={styles.photo} contentFit="cover" transition={160} onError={() => markPhotoFailed(photo.id)} />
              )}
              <Pressable style={styles.xButton} onPress={() => onRemovePhoto(photo.id)}><Ionicons name="close" size={14} color={colors.text} /></Pressable>
            </View>
          );
        })}
        {photos.length < 6 ? <Pressable style={styles.addTile} onPress={pickPhotos}><Ionicons name="add" size={30} color={colors.text} /><Text style={styles.addText}>Add photo</Text></Pressable> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 18, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700", lineHeight: 23 },
  tip: { marginTop: 6, color: colors.mutedStrong, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  errorText: { marginTop: 8, color: colors.danger, fontSize: 12, fontWeight: "700", lineHeight: 16 },
  row: { flexDirection: "row", gap: 10, paddingTop: 16, paddingRight: 2 },
  tile: { width: 92, height: 124, overflow: "hidden", borderRadius: 12, backgroundColor: colors.softGold },
  photo: { width: "100%", height: "100%" },
  photoFallback: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: colors.softGreen },
  xButton: { position: "absolute", top: 7, right: 7, width: 23, height: 23, alignItems: "center", justifyContent: "center", borderRadius: 11.5, backgroundColor: colors.surface },
  addTile: { width: 92, height: 124, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.sheetHandle, backgroundColor: colors.surface },
  addText: { marginTop: 8, color: colors.mutedStrong, fontSize: 11.5, fontWeight: "600" }
});
