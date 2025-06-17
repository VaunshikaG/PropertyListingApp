import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Calendar, Users } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Button } from "@/components/shared/Button";
import { useBookingStore } from "@/stores/bookingStore";
import { useUserStore } from "@/stores/useStore";
import { useRouter } from "expo-router";
import { BookingFormData, Property } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";

interface BookingFormProps {
  property: Property;
  onBookingSuccess?: (data: BookingFormData) => void;
  onBookingError?: (error: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  property,
  onBookingSuccess,
  onBookingError,
}) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { addBooking, isLoading: isBookingLoading } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (errors.submit) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.submit;
        return newErrors;
      });
    }
    setSuccessMessage(null);
  };

  const showCheckInDatePicker = () => {
    setShowCheckInPicker(true);
  };

  const hideCheckInDatePicker = () => {
    setShowCheckInPicker(false);
  };

  const handleCheckInConfirm = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    hideCheckInDatePicker();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setFormData({ ...formData, checkInDate: formattedDate });
    if (errors.checkInDate) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.checkInDate;
        return newErrors;
      });
    }
  };

  const showCheckOutDatePicker = () => {
    setShowCheckOutPicker(true);
  };

  const hideCheckOutDatePicker = () => {
    setShowCheckOutPicker(false);
  };

  const handleCheckOutConfirm = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    hideCheckOutDatePicker();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setFormData({ ...formData, checkOutDate: formattedDate });
    if (errors.checkOutDate) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.checkOutDate;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.checkInDate) {
      newErrors.checkInDate = "Check-in date is required";
    } else if (isNaN(new Date(formData.checkInDate).getTime())) {
      newErrors.checkInDate = "Invalid check-in date format";
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required";
    } else if (isNaN(new Date(formData.checkOutDate).getTime())) {
      newErrors.checkOutDate = "Invalid check-out date format";
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      if (checkIn.getTime() >= checkOut.getTime()) {
        newErrors.checkOutDate = "Check-out date must be after check-in date";
      }
    }

    if (formData.guests <= 0 || isNaN(formData.guests)) {
      newErrors.guests = "Number of guests must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalPrice = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;

    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 0;

    return property.price * diffDays;
  };

  const handleSubmit = async () => {
    setLoading(false);
    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    if (!user || !user.id) {
      setErrors((prev) => ({
        ...prev,
        submit:
          "You must be logged in to book a property. Please log in first.",
      }));
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      setErrors((prev) => ({
        ...prev,
        submit:
          "Booking dates are invalid or total price is zero. Please check your dates.",
      }));
      return;
    }

    setLoading(true);
    // console.log(
    //   "Attempting to submit form for property:",
    //   property.id,
    //   formData
    // );

    try {
      await addBooking({
        propertyId: property.id,
        userId: user.id,
        startDate: formData.checkInDate,
        endDate: formData.checkOutDate,
        totalPrice,
        status: "confirmed",
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccessMessage("Booking request sent successfully!");
      onBookingSuccess?.(formData);

      setTimeout(() => {
        router.push("/bookings");
      }, 1000);

      setFormData({
        checkInDate: "",
        checkOutDate: "",
        guests: 1,
      });
    } catch (err: any) {
      console.error("Booking failed:", err);
      const errorMessage =
        err.message ||
        "An unexpected error occurred during booking. Please try again.";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
      onBookingError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Book this property</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${property.price}</Text>
            <Text style={styles.night}> / night</Text>
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              onPress={showCheckInDatePicker}
              style={styles.inputContainer}
            >
              <Calendar
                size={20}
                color={colors.textLight}
                style={styles.inputIcon}
              />
              <Text style={styles.dateInputText}>
                {formData.checkInDate || "Check-in date (YYYY-MM-DD)"}
              </Text>
            </TouchableOpacity>
            {errors.checkInDate && (
              <Text style={styles.fieldErrorText}>{errors.checkInDate}</Text>
            )}
            {showCheckInPicker && (
              <DateTimePicker
                testID="checkInDatePicker"
                value={new Date(formData.checkInDate || Date.now())}
                mode="date"
                display="default"
                onChange={handleCheckInConfirm}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              onPress={showCheckOutDatePicker}
              style={styles.inputContainer}
            >
              <Calendar
                size={20}
                color={colors.textLight}
                style={styles.inputIcon}
              />
              <Text style={styles.dateInputText}>
                {formData.checkOutDate || "Check-out date (YYYY-MM-DD)"}
              </Text>
            </TouchableOpacity>
            {errors.checkOutDate && (
              <Text style={styles.fieldErrorText}>{errors.checkOutDate}</Text>
            )}
            {showCheckOutPicker && (
              <DateTimePicker
                testID="checkOutDatePicker"
                value={new Date(formData.checkOutDate || Date.now())}
                mode="date"
                display="default"
                onChange={handleCheckOutConfirm}
                minimumDate={
                  new Date(
                    new Date(formData.checkInDate || Date.now()).setDate(
                      new Date(formData.checkInDate || Date.now()).getDate() + 1
                    )
                  )
                }
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.inputContainer}>
              <Users
                size={20}
                color={colors.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Number of guests"
                value={formData.guests.toString()}
                onChangeText={(text) => handleInputChange("guests", text)}
                keyboardType="number-pad"
              />
            </View>
            {errors.guests && (
              <Text style={styles.fieldErrorText}>{errors.guests}</Text>
            )}
          </View>

          {errors.submit && (
            <Text style={styles.generalErrorText}>{errors.submit}</Text>
          )}
          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              ${calculateTotalPrice().toLocaleString()}
            </Text>
          </View>

          <Button
            title="Book Now"
            onPress={handleSubmit}
            loading={loading}
            // loading={loading || isBookingLoading}
            style={styles.bookButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    padding: 16,
  },
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
    fontSize: 20,
    color: colors.textLight,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: colors.text,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
  },
  fieldErrorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  generalErrorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  successText: {
    color: colors.success || "green",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    fontWeight: "600",
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
    padding: 10,
  },
});
