import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useBookingStore } from "@/stores/bookingStore";
import { useUserStore } from "@/stores/useStore";
import { BookingCard } from "@/components/booking/BookingCard";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { colors } from "@/constants/colors";
import { Booking, Property } from "@/types";
import { fetchPropertyById } from "@/utils/api";

export default function BookingsScreen() {
  const { user } = useUserStore();
  const { bookings, fetchBookings, isLoading, error } = useBookingStore();
  const [properties, setProperties] = useState<Record<number, Property>>({});
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPropertiesForBookings = useCallback(
    async (currentBookings: Booking[]) => {
      if (currentBookings.length === 0) {
        setProperties({});
        return;
      }

      setLoadingProperties(true);
      const propertyIds = [
        ...new Set(currentBookings.map((booking) => booking.propertyId)),
      ];

      try {
        const propertyPromises = propertyIds.map((id) => fetchPropertyById(id));
        const propertiesData = await Promise.all(propertyPromises);

        const propertiesMap: Record<string, Property> = {};
        propertiesData.forEach((property) => {
          propertiesMap[property.id] = property;
        });

        setProperties(propertiesMap);
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoadingProperties(false);
      }
    },
    []
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        await fetchBookings(user.id);
        const updatedBookings = useBookingStore.getState().bookings;
        await loadPropertiesForBookings(updatedBookings);
      }
    } catch (err) {
      console.error("Error during refresh:", err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, fetchBookings, loadPropertiesForBookings]);

  useEffect(() => {
    if (user?.id && bookings.length === 0 && !isLoading && !error) {
      fetchBookings(user.id);
    }
  }, [user?.id, fetchBookings, bookings.length, isLoading, error]);

  useEffect(() => {
    if (bookings) {
      loadPropertiesForBookings(bookings);
    } else {
      setProperties({});
    }
  }, [bookings, loadPropertiesForBookings]);

  const overallLoading = isLoading || loadingProperties;

  if (!user || !user.id) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.messageText}>
          Please log in to view your bookings.
        </Text>
      </View>
    );
  }

  if (overallLoading && !refreshing && bookings.length === 0) {
    return <LoadingIndicator message="Loading your bookings..." />;
  }

  if (error && !refreshing && bookings.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.messageText}>Please pull down to try again.</Text>
      </View>
    );
  }

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

  if (bookings.length === 0 && !overallLoading) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.emptyText}>No bookings found</Text>
        <Text style={styles.emptySubtext}>
          Your bookings will appear here once you book a property
        </Text>
      </ScrollView>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
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
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  messageText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
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
