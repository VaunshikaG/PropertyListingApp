import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { Calendar, MapPin, Users, XCircle } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Booking, Property } from "@/types";
import { useRouter } from "expo-router";
import { useBookingStore } from "@/stores/bookingStore";
import { useUserStore } from "@/stores/useStore";

const { width } = Dimensions.get("window");

interface BookingCardProps {
  booking: Booking;
  property: Property;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  property,
}) => {
  const router = useRouter();
  const { user } = useUserStore();

  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Property details not available for this booking.
        </Text>
      </View>
    );
  }

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

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <View>
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {(property.images.length > 0
            ? property.images
            : ["https://reactnative.dev/img/tiny_logo.png"]
          ).map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={[styles.styleImg, { width }]}
              resizeMode="cover"
              onError={(e) => {
                console.error(
                  "Image failed to load:",
                  img,
                  e.nativeEvent.error
                );
                e.currentTarget.setNativeProps({
                  source: [
                    {
                      uri: "https://placehold.co/150x150/CCCCCC/666666?text=Image+Error",
                    },
                  ],
                });
              }}
            />
          ))}
        </ScrollView>
        <View style={styles.dotsContainer}>
          {(property.images.length > 0
            ? property.images
            : ["https://reactnative.dev/img/tiny_logo.png"]
          ).map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                activeIndex === idx ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) },
          ]}
        >
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.9}
      >
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
            <Text style={styles.price}>
              ${booking.totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
  styleImg: {
    width: width,
    height: "100%",
    borderRadius: 12,
    marginRight: 8,
  },
  scrollView: {
    width: "100%",
    height: 250,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#007bff",
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  imageContainer: {
    height: 150,
    width: "100%",
    position: "relative",
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
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.textLight,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.textLight,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 1,
    fontWeight: "500",
  },
});
