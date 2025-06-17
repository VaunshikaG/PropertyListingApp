import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Star, User } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { FeatureList } from "@/components/property/FeatureList";
import { PropertyMap } from "@/components/property/PropertyMap";
import { BookingForm } from "@/components/property/BookingForm";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";

const { width } = Dimensions.get("window");

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = parseInt(id as string, 10);
  const { property, isLoading, error } = usePropertyDetails(propertyId);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return <LoadingIndicator message="Loading property details..." />;
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Failed to load property details"}
        </Text>
      </View>
    );
  }

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              style={styles.styleImg}
              resizeMode="cover"
              onError={(e) => {
                console.error("Image failed to load:", e.nativeEvent);
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
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{property.title}</Text>
        </View>

        <Text style={styles.location}>
          {property.location.city}, {property.location.address}
        </Text>

        <View style={styles.divider} />

        <FeatureList features={property.features} />

        <PropertyMap
          latitude={property.location.coordinates.latitude}
          longitude={property.location.coordinates.longitude}
          address={`${property.location.address}, ${property.location.city}`}
        />

        <BookingForm property={property} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    height: 250,
    width: "100%",
  },
  scrollView: {
    width: "100%",
    height: 250,
  },
  styleImg: {
    width: width,
    height: 250,
    borderRadius: 12,
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
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  reviews: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textLight,
  },
  location: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  hostContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  hostImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  hostedBy: {
    fontSize: 16,
    color: colors.textLight,
  },
  hostName: {
    fontWeight: "600",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
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
});
function setActiveIndex(slide: number) {
  throw new Error("Function not implemented.");
}
