import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";

export function MessageLoadingRows() {
  return (
    <View style={styles.wrap}>
      <View style={styles.bigCard} />
      <View style={styles.row}><View style={styles.avatar} /><View style={styles.text}><View style={styles.large} /><View style={styles.small} /></View><View style={styles.time} /></View>
      <View style={styles.row}><View style={styles.avatar} /><View style={styles.text}><View style={styles.large} /><View style={styles.small} /></View><View style={styles.time} /></View>
      <View style={styles.row}><View style={styles.avatar} /><View style={styles.text}><View style={styles.large} /><View style={styles.small} /></View><View style={styles.time} /></View>
      <View style={styles.row}><View style={styles.avatar} /><View style={styles.text}><View style={styles.large} /><View style={styles.small} /></View><View style={styles.time} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  bigCard: { height: 190, borderRadius: 16, backgroundColor: "#F1ECE4" },
  row: { height: 72, flexDirection: "row", alignItems: "center", marginTop: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#F1ECE4" },
  text: { flex: 1, marginLeft: 14 },
  large: { width: "64%", height: 12, borderRadius: 6, backgroundColor: colors.border },
  small: { width: "82%", height: 10, borderRadius: 5, backgroundColor: colors.border, marginTop: 8 },
  time: { width: 36, height: 10, borderRadius: 5, backgroundColor: colors.border }
});
