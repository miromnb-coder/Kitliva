import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#A77C3A",
        tabBarInactiveTintColor: "#4F5752",
        tabBarLabelStyle: {
          fontSize: typography.tabLabel,
          fontWeight: "500"
        },
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 82,
          paddingTop: 8,
          paddingBottom: 22,
          backgroundColor: "rgba(255,255,255,0.98)",
          borderTopColor: colors.border
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
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={28} color={color} />
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
