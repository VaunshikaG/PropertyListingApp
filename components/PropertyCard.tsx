// components/PropertyCard.tsx
// Reusable component to display individual property information in a card format.

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
// Removed 'styled' import
// import { styled } from 'nativewind';
import { FontAwesome } from "@expo/vector-icons";
import { Property } from "../types";
import { Link } from "expo-router"; // Use Link for navigation

// No need for Styled components
// const StyledView = styled(View);
// const StyledText = styled(Text);
// const StyledImage = styled(Image);
// const StyledTouchableOpacity = styled(TouchableOpacity);

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    // Link from expo-router makes the entire card tappable and navigates
    <Link href={`/property/${property.id}`} asChild>
      <TouchableOpacity className="bg-white rounded-xl shadow-md overflow-hidden m-4 mb-2 border border-gray-100 flex-row md:flex-col lg:flex-row">
        {/* Property Image */}
        <Image
          source={{
            uri:
              property.imageUrl ||
              "[https://placehold.co/150x150/e0e0e0/555555?text=Property](https://placehold.co/150x150/e0e0e0/555555?text=Property)",
          }}
          className="w-full h-48 sm:h-56 md:h-64 lg:w-48 lg:h-auto object-cover rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none"
          resizeMode="cover"
        />

        {/* Property Details */}
        <View className="p-4 flex-1">
          <Text className="text-xl font-bold text-gray-800 mb-1 font-inter-bold">
            {property.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-2 font-inter-regular">
            <FontAwesome name="map-marker" size={14} color="#6b7280" />{" "}
            {property.location}
          </Text>
          <View className="flex-row items-center mb-2">
            <FontAwesome name="star" size={16} color="#facc15" />{" "}
            {/* Tailwind yellow-400 */}
            <Text className="text-base text-gray-700 ml-1 font-inter-regular">
              {property.rating.toFixed(1)}
            </Text>
            <Text className="text-lg font-bold text-blue-600 ml-auto font-inter-bold">
              ${property.pricePerNight}
              <Text className="text-sm text-gray-500 font-inter-regular">
                /night
              </Text>
            </Text>
          </View>
          <Text className="text-sm text-gray-700 font-inter-regular leading-snug">
            {property.description.substring(0, 100)}...
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default PropertyCard;
