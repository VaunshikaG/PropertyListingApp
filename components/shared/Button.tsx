import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { colors } from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };

    // Variant styles
    if (variant === "primary") {
      buttonStyle = { ...buttonStyle, ...styles.primaryButton };
    } else if (variant === "secondary") {
      buttonStyle = { ...buttonStyle, ...styles.secondaryButton };
    } else if (variant === "outline") {
      buttonStyle = { ...buttonStyle, ...styles.outlineButton };
    }

    // Size styles
    if (size === "small") {
      buttonStyle = { ...buttonStyle, ...styles.smallButton };
    } else if (size === "large") {
      buttonStyle = { ...buttonStyle, ...styles.largeButton };
    }

    // Disabled style
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleObj: TextStyle = { ...styles.buttonText };

    if (variant === "outline") {
      textStyleObj = { ...textStyleObj, ...styles.outlineButtonText };
    }

    if (size === "small") {
      textStyleObj = { ...textStyleObj, ...styles.smallButtonText };
    } else if (size === "large") {
      textStyleObj = { ...textStyleObj, ...styles.largeButtonText };
    }

    if (disabled) {
      textStyleObj = { ...textStyleObj, ...styles.disabledButtonText };
    }

    return textStyleObj;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.primary : "white"}
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledButton: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    color: colors.textLight,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
});
