import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { Calendar, Users } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Button } from "@/components/shared/Button";
import { BookingFormData, Property } from "@/types";
import { useBookingStore } from "@/stores/bookingStore";
import { useUserStore } from "@/stores/useStore";
import { useRouter } from "expo-router";

interface BookingFormProps {
  property: Property;
}

export const BookingForm: React.FC<BookingFormProps> = ({ property }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { addBooking, isLoading } = useBookingStore();

  const [formData, setFormData] = useState<BookingFormData>({
    startDate: "",
    endDate: "",
    guests: 1,
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError(null);
  };

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return property.price * diffDays;
  };

  const handleBooking = async () => {
    if (!formData.startDate || !formData.endDate) {
      setError("Please select check-in and check-out dates");
      return;
    }

    if (!user) {
      setError("You must be logged in to book a property");
      return;
    }

    const totalPrice = calculateTotalPrice();

    try {
      await addBooking({
        propertyId: property.id,
        userId: user.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice,
        status: "confirmed",
      });

      router.push("/bookings");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book this property</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>${property.price}</Text>
        <Text style={styles.night}> / night</Text>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.inputContainer}>
          <Calendar
            size={20}
            color={colors.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Check-in date (YYYY-MM-DD)"
            value={formData.startDate}
            onChangeText={(text) => handleInputChange("startDate", text)}
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.inputContainer}>
          <Calendar
            size={20}
            color={colors.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Check-out date (YYYY-MM-DD)"
            value={formData.endDate}
            onChangeText={(text) => handleInputChange("endDate", text)}
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.inputContainer}>
          <Users size={20} color={colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Number of guests"
            value={formData.guests.toString()}
            onChangeText={(text) => handleInputChange("guests", text)}
            keyboardType="number-pad"
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalPrice}>${calculateTotalPrice()}</Text>
      </View>

      <Button
        title="Book Now"
        onPress={handleBooking}
        loading={isLoading}
        style={styles.bookButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  night: {
    fontSize: 16,
    color: colors.textLight,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    marginBottom: 12,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  bookButton: {
    marginTop: 16,
  },
});
