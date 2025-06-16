// app/_layout.tsx
// This file defines the root layout and navigation for your app using Expo Router.
// It sets up the tab navigation at the bottom.

import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootSiblingParent } from "react-native-root-siblings"; // For global toast messages
import { Text, View } from "react-native"; // Added Text and View for inline styling with className

const queryClient = new QueryClient();

export default function AppRootLayout() {
  return (
    // QueryClientProvider wraps the entire app to enable React Query
    <QueryClientProvider client={queryClient}>
      {/* RootSiblingParent for potential global toast messages or modals */}
      <RootSiblingParent>
        {/* StatusBar for controlling the status bar appearance */}
        <StatusBar style="auto" />
        {/* Tabs component from expo-router creates the bottom tab navigation */}
        <Tabs
          screenOptions={{
            headerShown: false, // Hide header on tab screens, individual screens can show their own
            tabBarActiveTintColor: "#3b82f6", // Tailwind blue-500
            tabBarInactiveTintColor: "#6b7280", // Tailwind gray-500
            tabBarStyle: {
              backgroundColor: "#f9fafb", // Tailwind gray-50
              borderTopWidth: 0,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            tabBarLabelStyle: {
              fontFamily: "Inter-Regular", // Use your custom font
              fontSize: 12,
              paddingBottom: 2,
            },
            tabBarIconStyle: {
              marginTop: 4,
            },
          }}
        >
          {/* Home Tab */}
          <Tabs.Screen
            name="(tabs)/index" // Matches the file path app/(tabs)/index.tsx
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="home" size={24} color={color} />
              ),
            }}
          />
          {/* Bookings Tab */}
          <Tabs.Screen
            name="(tabs)/bookings" // Matches the file path app/(tabs)/bookings.tsx
            options={{
              title: "Bookings",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="book" size={24} color={color} />
              ),
            }}
          />
          {/* Profile Tab */}
          <Tabs.Screen
            name="(tabs)/profile" // Matches the file path app/(tabs)/profile.tsx
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="user" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}
