// components/LoadingSpinner.tsx
// A simple loading spinner component.

import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
// Removed 'styled' import as it's not used directly anymore
// import { styled } from 'nativewind';

// No need for StyledView and StyledText definitions
// const StyledView = styled(View);
// const StyledText = styled(Text);

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => {
  return (
    // Directly use View and Text with className
    <View className="flex-1 justify-center items-center p-4">
      <ActivityIndicator size="large" color="#3b82f6" />{" "}
      {/* Tailwind blue-500 */}
      <Text className="text-gray-600 mt-2 text-base font-semibold">
        {message}
      </Text>
    </View>
  );
};

export default LoadingSpinner;
