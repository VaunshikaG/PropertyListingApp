import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Calendar, MapPin } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Booking, Property } from "@/types";
import { useRouter } from "expo-router";

interface BookingCardProps {
  booking: Booking;
  property: Property;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  property,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return colors.success;
      case "pending":
        return colors.secondary;
      case "cancelled":
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {property && property.image && property.image.length > 0 ? (
          property.image.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={styles.image}
              resizeMode="cover"
            />
          ))
        ) : (
          <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) },
          ]}
        >
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.location.city}, {property.location.address}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={colors.textLight} />
          <Text style={styles.dateText}>
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.price}>${booking.totalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  imageContainer: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textLight,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textLight,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
});
