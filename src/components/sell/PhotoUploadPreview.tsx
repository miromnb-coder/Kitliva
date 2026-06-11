import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { SellPhoto } from "@/types/sell";

type PhotoUploadPreviewProps = {
  photos: SellPhoto[];
  error?: string | null;
  onAddPhotos: (photos: SellPhoto[]) => void;
  onRemovePhoto: (photoId: string) => void;
};

export function PhotoUploadPreview({ photos, error, onAddPhotos, onRemovePhoto }: PhotoUploadPreviewProps) {
  async function pickPhotos() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, 6 - photos.length),
      quality: 0.85
    });

    if (result.canceled) {
      return;
    }

    const nextPhotos = result.assets.slice(0, Math.max(0, 6 - photos.length)).map((asset, index) => ({
      id: `${Date.now()}-${index}-${asset.uri}`,
      uri: asset.uri,
      fileName: asset.fileName,
      mimeType: asset.mimeType
    }));

    onAddPhotos(nextPhotos);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add photos</Text>
      <Text style={styles.tip}>Recommended: 3-6 photos from a few angles.</Text>

      {error ? (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {photos.length === 0 ? (
        <Pressable style={styles.emptyCard} onPress={pickPhotos}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Add photos</Text>
          <Text style={styles.emptyText}>Show the real condition before publishing.</Text>
        </Pressable>
      ) : (
        <View style={styles.photoRow}>
          {photos.map((photo, index) => (
            <View key={photo.id} style={styles.photoTile}>
              <Image source={{ uri: photo.uri }} style={styles.photo} contentFit="cover" transition={160} />
              {index === 0 ? (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverText}>Cover</Text>
                </View>
              ) : null}
              <Pressable style={styles.removeButton} onPress={() => onRemovePhoto(photo.id)}>
                <Ionicons name="close" size={11} color={colors.text} />
              </Pressable>
            </View>
          ))}

          {photos.length < 6 ? (
            <Pressable style={styles.addTile} onPress={pickPhotos}>
              <Ionicons name="add" size={21} color={colors.primary} />
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  tip: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10.5,
    fontWeight: "500"
  },
  errorCard: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 11,
    marginTop: 9
  },
  errorText: {
    flex: 1,
    marginLeft: 7,
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "600"
  },
  emptyCard: {
    minHeight: 156,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    marginTop: 9
  },
  emptyIconCircle: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: colors.mint,
    marginBottom: 10
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  emptyText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center"
  },
  photoRow: {
    marginTop: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  photoTile: {
    width: 72,
    height: 72,
    overflow: "hidden",
    borderRadius: 11,
    backgroundColor: "#EDF2F0"
  },
  photo: {
    width: "100%",
    height: "100%"
  },
  coverBadge: {
    position: "absolute",
    left: 5,
    top: 5,
    height: 18,
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: colors.mint,
    paddingHorizontal: 6
  },
  coverText: {
    color: colors.primary,
    fontSize: 9.5,
    fontWeight: "800"
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  addTile: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C8D2D0",
    backgroundColor: colors.surface
  },
  addText: {
    marginTop: 2,
    color: colors.primary,
    fontSize: 10.5,
    fontWeight: "800"
  }
});
