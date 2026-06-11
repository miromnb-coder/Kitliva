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
        {secure ? <Ionicons name="eye-outline" size={20} color="#6F7E7E" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  label: {
    marginBottom: 6,
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  inputWrap: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#D7E0DD",
    backgroundColor: colors.surface,
    paddingHorizontal: 13
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "500"
  }
});
