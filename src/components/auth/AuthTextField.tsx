import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "@/constants/colors";

type AuthTextFieldProps = {
  label: string;
  placeholder?: string;
  secure?: boolean;
  value: string;
  onChangeText: (value: string) => void;
} & Pick<TextInputProps, "keyboardType" | "autoCapitalize" | "autoComplete" | "textContentType" | "returnKeyType">;

export function AuthTextField({ label, placeholder, secure = false, value, onChangeText, keyboardType, autoCapitalize = "none", autoComplete, textContentType, returnKeyType }: AuthTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A6A1"
          secureTextEntry={secure}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
        />
        {secure ? <Ionicons name="eye-outline" size={22} color="#4F5752" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18
  },
  label: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600"
  },
  inputWrap: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D8D1C7",
    backgroundColor: colors.surface,
    paddingHorizontal: 18
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 15,
    fontWeight: "400"
  }
});
