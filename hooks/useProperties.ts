import { useState, useEffect } from 'react';
import { Property } from '@/types';
import { fetchProperties } from '@/utils/api';

export function useProperties(initialSearch = '') {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all properties
  useEffect(() => {
    const getProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    getProperties();
  }, []);

  // Filter properties based on search term
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProperties(properties);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchLower) ||
        property.location.city.toLowerCase().includes(searchLower) ||
        property.location.address.toLowerCase().includes(searchLower)
    );
    setFilteredProperties(filtered);
  }, [search, properties]);

  return {
    properties: filteredProperties,
    isLoading,
    error,
    search,
    setSearch,
  };
}