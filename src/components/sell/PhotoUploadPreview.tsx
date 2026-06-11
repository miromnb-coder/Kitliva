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
              <Ionicons name="close" size={12} color={colors.text} />
            </View>
          </View>
        ))}

        <View style={styles.addTile}>
          <Ionicons name="add" size={22} color={colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  tip: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "500"
  },
  photoRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10
  },
  photoTile: {
    width: 64,
    height: 64,
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#EDF2F0"
  },
  photo: {
    width: "100%",
    height: "100%"
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  addTile: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C8D2D0",
    backgroundColor: colors.surface
  }
});
