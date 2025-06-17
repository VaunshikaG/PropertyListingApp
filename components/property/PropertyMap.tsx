import React from "react";
import { View, Text, StyleSheet, Platform, Image } from "react-native";
import { MapPin } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  address,
}) => {
  // For web, we'd use a different approach since react-native-maps isn't fully compatible
  // This is a simplified placeholder that shows a static map image
  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=600x300&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`;

  // For demo purposes, we'll use a placeholder image
  const placeholderMapUrl =
    "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: placeholderMapUrl }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.pinContainer}>
          <MapPin size={32} color={colors.primary} />
        </View>
      </View>
      <View style={styles.addressContainer}>
        <MapPin size={16} color={colors.primary} />
        <Text style={styles.addressText}>{address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -16,
    marginTop: -32,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  addressText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textLight,
  },
});
