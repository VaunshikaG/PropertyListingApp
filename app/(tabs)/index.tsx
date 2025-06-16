// app/(tabs)/index.tsx
// Home Screen: Displays a list of properties and a search bar.

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ScrollView, RefreshControl } from "react-native";
// Removed 'styled' import
// import { styled } from 'nativewind';
import { useProperties } from "../../hooks/useProperties";
import PropertyCard from "../../components/PropertyCard";
import SearchBar from "../../components/SearchBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAtom } from "jotai";
import { searchTermAtom } from "../../stores/globalAtoms";
import { FontAwesome } from "@expo/vector-icons";
import { useProfileStore } from "../../stores/profileStore"; // To display user info in header

// No need for Styled components
// const StyledView = styled(View);
// const StyledText = styled(Text);
// const StyledScrollView = styled(ScrollView);

export default function HomeScreen() {
  const {
    data: properties,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useProperties();
  const [searchTerm] = useAtom(searchTermAtom);
  const { user } = useProfileStore();

  const filteredProperties =
    properties?.filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) {
    return <LoadingSpinner message="Fetching properties..." />;
  }

  if (isError) {
    return (
      // Directly use View and Text with className
      <View className="flex-1 justify-center items-center p-4 bg-red-50">
        <FontAwesome
          name="exclamation-triangle"
          size={50}
          color="#ef4444"
          className="mb-4"
        />
        <Text className="text-red-600 text-lg font-bold mb-2">
          Error loading properties!
        </Text>
        <Text className="text-red-500 text-sm text-center">
          {error?.message || "An unexpected error occurred."}
        </Text>
        <Text className="text-red-500 text-sm mt-2 text-center">
          Please ensure your JSON server is running on `http://localhost:3000`.
        </Text>
        <Text className="text-red-500 text-sm mt-1 text-center">
          Run: `json-server --watch db.json --port 3000`
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pb-0 bg-white shadow-sm border-b border-gray-100">
        <Text className="text-2xl font-extrabold text-gray-900 font-inter-bold">
          Property Listings
        </Text>
        <View className="flex-row items-center">
          <Text className="text-lg text-gray-700 mr-2 font-inter-regular">
            Hi, {user?.name.split(" ")[0]}!
          </Text>
          <FontAwesome name="user-circle" size={30} color="#3b82f6" />
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar />

      {/* Property List */}
      {filteredProperties.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#3b82f6"
            />
          }
          className="flex-1"
        >
          <FontAwesome
            name="exclamation-circle"
            size={50}
            color="#9ca3af"
            className="mb-4"
          />
          <Text className="text-gray-500 text-lg font-inter-regular">
            No properties found.
          </Text>
          <Text className="text-gray-400 text-sm mt-1 font-inter-regular">
            Try a different search term or pull to refresh.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertyCard property={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#3b82f6"
            />
          }
        />
      )}
    </View>
  );
}
