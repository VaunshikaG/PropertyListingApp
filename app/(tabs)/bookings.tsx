// app/(tabs)/bookings.tsx
// Bookings Screen: Displays a list of user's booked properties.

import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native"; // Added Image and TouchableOpacity
// Removed 'styled' import
// import { styled } from 'nativewind';
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../api";
import { Booking, Property } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useBookingStore } from "../../stores/bookingStore"; // Use Zustand for immediate updates
import { useProperties } from "../../hooks/useProperties"; // To get property details for bookings
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

// No need for Styled components
// const StyledView = styled(View);
// const StyledText = styled(Text);
// const StyledTouchableOpacity = styled(TouchableOpacity);
// const StyledImage = styled(Image);

interface BookingCardProps {
  booking: Booking;
  property: Property | undefined;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, property }) => {
  if (!property) {
    return (
      // Directly use View and Text with className
      <View className="bg-white rounded-xl shadow-md p-4 m-4 mb-2 border border-gray-100">
        <Text className="text-red-500 font-bold">
          Property details not available for this booking.
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Booking ID: {booking.id}
        </Text>
      </View>
    );
  }

  return (
    <Link href={`/property/${property.id}`} asChild>
      <TouchableOpacity className="bg-white rounded-xl shadow-md overflow-hidden m-4 mb-2 border border-gray-100 flex-row">
        <Image
          source={{
            uri:
              property.imageUrl ||
              "https://placehold.co/100x100/e0e0e0/555555?text=Property",
          }}
          className="w-28 h-28 object-cover rounded-l-xl"
          resizeMode="cover"
        />
        <View className="p-3 flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1 font-inter-bold">
            {property.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-1 font-inter-regular">
            <FontAwesome name="calendar" size={14} color="#6b7280" /> Check-in:{" "}
            {booking.checkInDate}
          </Text>
          <Text className="text-sm text-gray-600 mb-2 font-inter-regular">
            <FontAwesome name="calendar-check-o" size={14} color="#6b7280" />{" "}
            Check-out: {booking.checkOutDate}
          </Text>
          <Text className="text-md font-bold text-blue-600 font-inter-bold">
            Total: ${booking.totalPrice}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default function BookingsScreen() {
  // Fetch all properties to be able to display property details within booking cards
  const { data: allProperties } = useProperties();
  const propertiesMap = new Map(allProperties?.map((p) => [p.id, p]));

  // Fetch bookings using React Query
  const {
    data: apiBookings,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Booking[], Error>({
    queryKey: ["bookings"],
    queryFn: getBookings,
    staleTime: 5 * 60 * 1000,
  });

  // Use Zustand for bookings that are optimistically added or for immediate display
  const { bookings: zustandBookings, setBookings } = useBookingStore();

  useEffect(() => {
    if (apiBookings) {
      // When API data is available, update the Zustand store to reflect the server state
      setBookings(apiBookings);
    }
  }, [apiBookings, setBookings]);

  if (isLoading) {
    return <LoadingSpinner message="Loading your bookings..." />;
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
          Error loading bookings!
        </Text>
        <Text className="text-red-500 text-sm text-center">
          {error?.message || "An unexpected error occurred."}
        </Text>
      </View>
    );
  }

  const combinedBookings = zustandBookings; // For simplicity, rely on Zustand being updated by API fetch

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 bg-white shadow-sm border-b border-gray-100">
        <Text className="text-2xl font-extrabold text-gray-900 font-inter-bold">
          My Bookings
        </Text>
      </View>

      {combinedBookings.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <FontAwesome
            name="bookmark-o"
            size={50}
            color="#9ca3af"
            className="mb-4"
          />
          <Text className="text-gray-500 text-lg font-inter-regular">
            You have no bookings yet.
          </Text>
          <Text className="text-gray-400 text-sm mt-1 font-inter-regular">
            Start exploring properties to book one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={combinedBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              property={propertiesMap.get(item.propertyId)}
            />
          )}
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
