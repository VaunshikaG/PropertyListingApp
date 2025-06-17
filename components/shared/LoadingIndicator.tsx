import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";

interface LoadingIndicatorProps {
  message?: string;
  size?: "small" | "large";
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
  size = "large",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 10,
    color: colors.textLight,
    fontSize: 16,
  },
});
