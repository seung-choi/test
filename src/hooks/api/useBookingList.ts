import { useQuery } from '@tanstack/react-query';
import { getBookingList } from '@/api/gps';
import type { GolferPositionData } from '@/types';
import { transformBookingToGolferPosition } from '@/utils';

export const useBookingList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bookingList'],
    queryFn: getBookingList,
    refetchInterval: options?.refetchInterval ?? 5000,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 3000,
  });

  return {
    bookingList: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGolferPositions = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { bookingList, isLoading, error, refetch } = useBookingList(options);

  const golferPositions: GolferPositionData[] =
    bookingList?.map(transformBookingToGolferPosition) ?? [];

  return {
    golferPositions,
    isLoading,
    error,
    refetch,
  };
};
