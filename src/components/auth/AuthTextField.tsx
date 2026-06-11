import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

type AuthTextFieldProps = {
  label: string;
  placeholder?: string;
  secure?: boolean;
};

export function AuthTextField({ label, placeholder, secure = false }: AuthTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A2AFAF"
          secureTextEntry={secure}
          autoCapitalize="none"
        />
        {secure ? <Ionicons name="eye-outline" size={21} color="#6F7E7E" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 21
  },
  label: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "800"
  },
  inputWrap: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#D7E0DD",
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 14,
    fontWeight: "500"
  }
});
