import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";
import { typography } from "@/theme/typography";

type IconName = keyof typeof Ionicons.glyphMap;

type TabIconProps = {
  color: string;
  focused: boolean;
  focusedIcon: IconName;
  outlineIcon: IconName;
  size?: number;
};

function TabIcon({ color, focused, focusedIcon, outlineIcon, size = 24 }: TabIconProps) {
  return <Ionicons name={focused ? focusedIcon : outlineIcon} size={size} color={color} />;
}

function SellTabIcon() {
  return (
    <View style={styles.sellCircle}>
      <Ionicons name="add" size={25} color={colors.buttonPrimaryText} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedStrong,
        tabBarLabelStyle: {
          fontSize: typography.tabLabel,
          fontWeight: "500",
          marginTop: 2
        },
        tabBarItemStyle: {
          paddingTop: 8
        },
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 88,
          paddingTop: 9,
          paddingBottom: 24,
          backgroundColor: colors.background,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "rgba(229, 222, 212, 0.92)",
          elevation: 10,
          shadowColor: "#101614",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.07,
          shadowRadius: 16,
          overflow: "hidden"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} focusedIcon="home" outlineIcon="home-outline" />
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} focusedIcon="compass" outlineIcon="compass-outline" />
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: "Sell",
          tabBarIcon: () => <SellTabIcon />,
          tabBarLabelStyle: {
            fontSize: typography.tabLabel,
            fontWeight: "500",
            marginTop: 4
          }
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} focusedIcon="chatbox" outlineIcon="chatbox-outline" />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} focusedIcon="person" outlineIcon="person-outline" />
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sellCircle: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 9,
    elevation: 6
  }
});
