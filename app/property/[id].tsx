import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Star, User } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { FeatureList } from "@/components/property/FeatureList";
import { PropertyMap } from "@/components/property/PropertyMap";
import { BookingForm } from "@/components/property/BookingForm";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = parseInt(id as string, 10);
  const { property, isLoading, error } = usePropertyDetails(propertyId);

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

  console.log("property:", property.images.length);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        {property && property?.images?.length > 0 ? (
          property.images.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={styles.image}
              resizeMode="cover"
              alt={`Property Image ${idx + 1}`}
              className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
              onError={(e) => {
                console.error("Image failed to load:", e.currentTarget);
                // Optionally replace with a generic error image
                e.currentTarget.blur;
              }}
            />
          ))
        ) : (
          <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.rating}>{property.rating}</Text>
            <Text style={styles.reviews}>({property.reviews} reviews)</Text>
          </View>
        </View>

        <Text style={styles.location}>
          {property.location.city}, {property.location.address}
        </Text>

        <View style={styles.hostContainer}>
          <Image
            source={{ uri: property.host.image }}
            style={styles.hostImage}
          />
          <Text style={styles.hostedBy}>
            Hosted by <Text style={styles.hostName}>{property.host.name}</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.description}>{property.description}</Text>

        <FeatureList features={property.features} />

        <PropertyMap
          latitude={property.location.latitude}
          longitude={property.location.longitude}
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
  image: {
    width: "100%",
    height: "100%",
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
