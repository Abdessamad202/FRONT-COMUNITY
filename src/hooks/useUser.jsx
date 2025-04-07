import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/apiCalls';

const useUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'], // Using the same key for the cache
    queryFn: getUser,
    staleTime: 5 * 60 * 1000, // Cache valid for 5 minutes
    retry: 2,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useUser;
