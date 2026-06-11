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

function TabIcon({ color, focused, focusedIcon, outlineIcon, size = 25 }: TabIconProps) {
  return <Ionicons name={focused ? focusedIcon : outlineIcon} size={size} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: typography.tabLabel,
          fontWeight: "600"
        },
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 22,
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} focusedIcon="home" outlineIcon="home-outline" />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} focusedIcon="search" outlineIcon="search-outline" />
          )
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: "Sell",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} focusedIcon="add-circle" outlineIcon="add-circle-outline" size={28} />
          )
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} focusedIcon="chatbubble" outlineIcon="chatbubble-outline" />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} focusedIcon="person" outlineIcon="person-outline" />
          )
        }}
      />
    </Tabs>
  );
}
