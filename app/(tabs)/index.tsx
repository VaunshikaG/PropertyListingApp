import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/home/PropertyCard";
import { SearchBar } from "@/components/home/SearchBar";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { colors } from "@/constants/colors";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { properties, isLoading, error, setSearch } = useProperties();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setSearch(text);
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading properties..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search by city, address or property name..."
      />

      {properties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No properties found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search criteria
          </Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={({ item }) => <PropertyCard property={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
  },
});
