import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface FeatureListProps {
  features: string[];
}

export const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  const renderFeature = ({ item }: { item: string }) => (
    <View style={styles.featureItem}>
      <View style={styles.checkContainer}>
        <Check size={16} color={colors.primary} />
      </View>
      <Text style={styles.featureText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Property Features</Text>
      <FlatList
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item, index) => `feature-${index}`}
        numColumns={2}
        scrollEnabled={false}
      />
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
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 12,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(74, 111, 165, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
});
