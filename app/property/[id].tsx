// app/property/[id].tsx
// Property Detail Screen: Displays details of a single property.

import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
// Removed 'styled' import
// import { styled } from 'nativewind';
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { usePropertyById } from "../../hooks/useProperties";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FontAwesome } from "@expo/vector-icons";
import { useBookProperty } from "../../hooks/useBookProperty";
import { useProfileStore } from "../../stores/profileStore"; // Get current user for booking

// No need for Styled components
// const StyledView = styled(View);
// const StyledText = styled(Text);
// const StyledImage = styled(Image);
// const StyledScrollView = styled(ScrollView);
// const StyledTouchableOpacity = styled(TouchableOpacity);

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    data: property,
    isLoading,
    isError,
    error,
  } = usePropertyById(id || "");
  const bookPropertyMutation = useBookProperty();
  const { user } = useProfileStore(); // Get the current user for booking

  const handleBookNow = () => {
    if (!property || !user?.id) {
      // Using a simple alert for now, as per original code.
      // In a real app, replace with a custom modal/toast.
      alert("Property or user data missing. Cannot book.");
      return;
    }

    // Basic booking details for demonstration
    const checkInDate = new Date();
    const checkOutDate = new Date();
    checkOutDate.setDate(checkInDate.getDate() + 3); // Book for 3 nights

    const newBooking = {
      propertyId: property.id,
      userId: user.id, // Use the user's ID from the profile store
      checkInDate: checkInDate.toISOString().split("T")[0],
      checkOutDate: checkOutDate.toISOString().split("T")[0],
      totalPrice: property.pricePerNight * 3, // Example: 3 nights
      bookingDate: new Date().toISOString().split("T")[0],
    };

    bookPropertyMutation.mutate(newBooking);
  };

  const handleOpenMap = (location: string) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = "0,0"; // Placeholder coordinates, ideally from property data
    const label = encodeURIComponent(location);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("An error occurred opening map:", err)
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading property details..." />;
  }

  if (isError || !property) {
    return (
      // Directly use View, Text, TouchableOpacity with className
      <View className="flex-1 justify-center items-center p-4 bg-red-50">
        <Stack.Screen options={{ title: "Property Not Found" }} />
        <FontAwesome
          name="frown-o"
          size={50}
          color="#ef4444"
          className="mb-4"
        />
        <Text className="text-red-600 text-lg font-bold mb-2">
          Property not found!
        </Text>
        <Text className="text-red-500 text-sm text-center">
          {error?.message ||
            "The property you are looking for does not exist or an error occurred."}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: property.name,
          headerShown: true, // Show header for this screen
          headerBackTitleVisible: false, // Hide back button text on iOS
          headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 18 },
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#3b82f6", // Back button color
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Property Image */}
        <Image
          source={{
            uri:
              property.imageUrl ||
              "[https://placehold.co/400x250/e0e0e0/555555?text=Property](https://placehold.co/400x250/e0e0e0/555555?text=Property)",
          }}
          className="w-full h-64 md:h-80 object-cover"
          resizeMode="cover"
        />
        {/* Details Section */}
        <View className="p-4 bg-white rounded-t-2xl -mt-4 shadow-lg mx-2">
          <Text className="text-3xl font-extrabold text-gray-900 mb-2 font-inter-bold">
            {property.name}
          </Text>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="map-marker" size={18} color="#6b7280" />
            <Text className="text-lg text-gray-700 ml-2 font-inter-regular">
              {property.location}
            </Text>
            <Text className="text-xl font-bold text-blue-600 ml-auto font-inter-bold">
              ${property.pricePerNight}
              <Text className="text-base text-gray-500 font-inter-regular">
                /night
              </Text>
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <FontAwesome name="star" size={20} color="#facc15" />
            <Text className="text-lg text-gray-700 ml-1 font-inter-regular">
              {property.rating.toFixed(1)} Rating
            </Text>
          </View>

          <Text className="text-base text-gray-800 leading-relaxed mb-6 font-inter-regular">
            {property.description}
          </Text>

          {/* Features Section */}
          {property.features && property.features.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-3 font-inter-bold">
                Features
              </Text>
              <View className="flex-row flex-wrap">
                {property.features.map((feature, index) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-blue-100 rounded-full px-4 py-2 mr-2 mb-2"
                  >
                    <FontAwesome
                      name="check-circle"
                      size={16}
                      color="#3b82f6"
                    />
                    <Text className="text-blue-700 text-sm ml-2 font-inter-regular">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Map Placeholder */}
          <View className="mb-6 p-4 bg-gray-100 rounded-lg">
            <Text className="text-xl font-bold text-gray-900 mb-3 font-inter-bold">
              Location on Map
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenMap(property.location)}
              className="w-full h-40 bg-gray-200 rounded-lg justify-center items-center overflow-hidden"
            >
              <FontAwesome name="map" size={50} color="#a1a1aa" />
              <Text className="text-gray-500 mt-2 font-inter-regular">
                Tap to open in Maps
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600 mt-2 font-inter-regular text-center">
              (Interactive map would be here with API integration)
            </Text>
          </View>

          {/* Book Now Button */}
          <TouchableOpacity
            onPress={handleBookNow}
            className={`bg-blue-600 py-4 rounded-xl items-center justify-center shadow-lg active:bg-blue-700 ${
              bookPropertyMutation.isPending ? "opacity-70" : ""
            }`}
            disabled={bookPropertyMutation.isPending}
          >
            {bookPropertyMutation.isPending ? (
              <LoadingSpinner message="Booking..." />
            ) : (
              <Text className="text-white text-xl font-extrabold font-inter-bold">
                Book Now
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="pb-10 bg-gray-50"></View>{" "}
        {/* Padding for bottom tab nav */}
      </ScrollView>
    </View>
  );
}
