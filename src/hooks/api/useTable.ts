import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTableList,
  getTableErpList,
  postTableInfo,
  putTableList,
  patchTableOrder,
  deleteTableInfo,
} from '@/api/table';
import type { PostTableRequest, PutTableRequest, PatchTableRequest } from '@/types/table.type';

export const useTableList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['tableList'],
    queryFn: getTableList,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });
};

export const useTableErpList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['tableErpList'],
    queryFn: getTableErpList,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });
};

export const usePostTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostTableRequest) => postTableInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableList'] });
    },
  });
};

export const usePutTableList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PutTableRequest[]) => putTableList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableList'] });
    },
  });
};

export const usePatchTableOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatchTableRequest[]) => patchTableOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableList'] });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId: number) => deleteTableInfo(tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableList'] });
    },
  });
};
