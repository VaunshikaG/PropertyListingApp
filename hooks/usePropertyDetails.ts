import { useState, useEffect } from 'react';
import { Property } from '@/types';
import { fetchPropertyById } from '@/utils/api';

export function usePropertyDetails(id: number) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPropertyDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getPropertyDetails();
    }
  }, [id]);

  return {
    property,
    isLoading,
    error,
  };
}