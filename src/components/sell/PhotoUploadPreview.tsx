import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const mockPhotos = [
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=300&q=80"
];

export function PhotoUploadPreview() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add photos</Text>
      <Text style={styles.tip}>Tip: Add one more close-up photo to sell faster.</Text>

      <View style={styles.photoRow}>
        {mockPhotos.map((photo) => (
          <View key={photo} style={styles.photoTile}>
            <Image source={{ uri: photo }} style={styles.photo} contentFit="cover" transition={160} />
            <View style={styles.removeButton}>
              <Ionicons name="close" size={11} color={colors.text} />
            </View>
          </View>
        ))}

        <View style={styles.addTile}>
          <Ionicons name="add" size={21} color={colors.primary} />
        </View>
      </View>
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
  photoRow: {
    marginTop: 9,
    flexDirection: "row",
    gap: 9
  },
  photoTile: {
    width: 58,
    height: 58,
    overflow: "hidden",
    borderRadius: 11,
    backgroundColor: "#EDF2F0"
  },
  photo: {
    width: "100%",
    height: "100%"
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 17,
    height: 17,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8.5,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  addTile: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C8D2D0",
    backgroundColor: colors.surface
  }
});
