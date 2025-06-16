// hooks/useProperties.ts
// Custom hook for fetching properties using React Query.

import { useQuery } from '@tanstack/react-query';
import { getProperties, getPropertyById } from '../api';
import { Property } from '../types';

export const useProperties = () => {
  return useQuery<Property[], Error>({
    queryKey: ['properties'], // Unique key for this query
    queryFn: getProperties, // Function to fetch the data
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    // cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
  });
};

export const usePropertyById = (id: string) => {
  return useQuery<Property, Error>({
    queryKey: ['property', id], // Unique key for a single property
    queryFn: () => getPropertyById(id),
    enabled: !!id, // Only run query if ID is available
    staleTime: 5 * 60 * 1000,
    // cacheTime: 10 * 60 * 1000,
  });
};