// app/(tabs)/profile.tsx
// Profile Screen: Displays user profile information (placeholder).

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
// Removed 'styled' import
// import { styled } from 'nativewind';
import { FontAwesome } from "@expo/vector-icons";
import { useProfileStore } from "../../stores/profileStore";

// No need for Styled components
// const StyledView = styled(View);
// const StyledText = styled(Text);
// const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ProfileScreen() {
  const { user, clearUser } = useProfileStore();

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens, etc.
    clearUser();
    // Redirect to login screen if one existed
    // Using a simple alert for now, as per original code.
    // In a real app, replace with a custom modal/toast.
    alert("Logged out (functionality not fully implemented)");
  };

  return (
    // Directly use View, Text, TouchableOpacity with className
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 bg-white shadow-sm border-b border-gray-100">
        <Text className="text-2xl font-extrabold text-gray-900 font-inter-bold">
          Profile
        </Text>
      </View>

      <View className="flex-1 items-center p-6 mt-8">
        <View className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md items-center border border-gray-100">
          <FontAwesome
            name="user-circle"
            size={80}
            color="#3b82f6"
            className="mb-4"
          />
          {user ? (
            <>
              <Text className="text-2xl font-bold text-gray-900 mb-2 font-inter-bold">
                {user.name}
              </Text>
              <Text className="text-md text-gray-600 mb-6 font-inter-regular">
                {user.email}
              </Text>
              {/* Add more profile fields here */}
              <View className="w-full border-t border-gray-200 pt-4 mt-4">
                <TouchableOpacity
                  onPress={() =>
                    alert("Edit Profile functionality not implemented")
                  }
                  className="flex-row items-center justify-center bg-gray-100 py-3 rounded-lg mb-3"
                >
                  <FontAwesome name="edit" size={20} color="#4b5563" />
                  <Text className="text-gray-800 ml-3 text-lg font-inter-semibold">
                    Edit Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center justify-center bg-red-100 py-3 rounded-lg"
                >
                  <FontAwesome name="sign-out" size={20} color="#dc2626" />
                  <Text className="text-red-700 ml-3 text-lg font-inter-semibold">
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              <Text className="text-lg text-gray-600 font-inter-regular mb-4">
                You are not logged in.
              </Text>
              <TouchableOpacity
                onPress={() => alert("Login functionality not implemented")}
                className="bg-blue-600 py-3 px-6 rounded-lg shadow-md"
              >
                <Text className="text-white text-lg font-inter-bold">
                  Login / Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
