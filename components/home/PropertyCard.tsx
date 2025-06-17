import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { Star } from "lucide-react-native";
import { Property } from "@/types";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  console.log("PropertyCard Image URL:", property.image);

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
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.rating}>{property.rating}</Text>
          </View>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {property.location.city}, {property.location.address}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${property.price}</Text>
          <Text style={styles.night}> / night</Text>
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
    height: 200,
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
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
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  location: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  night: {
    fontSize: 14,
    color: colors.textLight,
  },
});
