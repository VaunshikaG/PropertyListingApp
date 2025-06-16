// App.tsx (This file is typically minimal with Expo Router)
// You might only need this if you have global providers or setup outside of Expo Router's _layout.tsx
// However, for this setup, most global providers will go into app/_layout.tsx

import { SplashScreen } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { RootSiblingParent } from "react-native-root-siblings"; // For potential toast messages

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed, e.g., Inter
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    // Add other fonts like FontAwesome if needed for icons
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Wraps the entire app with QueryClientProvider and RootSiblingParent
  // RootSiblingParent is useful for global toasts/modals outside of navigation context
  return (
    <RootSiblingParent>
      <QueryClientProvider client={queryClient}>
        {/* The actual App content will be handled by expo-router in app/_layout.tsx */}
        {/* We just need to make sure our global providers are here or accessible to expo-router */}
        {/* Expo Router's Root Layout will automatically be rendered here */}
      </QueryClientProvider>
    </RootSiblingParent>
  );
}
