import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useBookingStore } from "@/stores/bookingStore";
import { useUserStore } from "@/stores/useStore";
import { BookingCard } from "@/components/booking/BookingCard";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { colors } from "@/constants/colors";
import { Property } from "@/types";
import { fetchPropertyById } from "@/utils/api";

export default function BookingsScreen() {
  const { user } = useUserStore();
  const { bookings, fetchBookings, isLoading, error } = useBookingStore();
  const [properties, setProperties] = useState<Record<number, Property>>({});
  const [loadingProperties, setLoadingProperties] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings(user.id);
    }
  }, [user]);

  useEffect(() => {
    const loadProperties = async () => {
      if (bookings.length === 0) return;

      setLoadingProperties(true);
      const propertyIds = [
        ...new Set(bookings.map((booking) => booking.propertyId)),
      ];

      try {
        const propertyPromises = propertyIds.map((id) => fetchPropertyById(id));
        const propertiesData = await Promise.all(propertyPromises);

        const propertiesMap: Record<number, Property> = {};
        propertiesData.forEach((property) => {
          propertiesMap[property.id] = property;
        });

        setProperties(propertiesMap);
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoadingProperties(false);
      }
    };

    loadProperties();
  }, [bookings]);

  if (isLoading || loadingProperties) {
    return <LoadingIndicator message="Loading your bookings..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookings found</Text>
        <Text style={styles.emptySubtext}>
          Your bookings will appear here once you book a property
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={({ item }) => (
          <BookingCard booking={item} property={properties[item.propertyId]} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
  },
});
