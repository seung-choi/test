import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGoodsList,
  getGoodsErpList,
  postGoodsInfo,
  putGoodsInfo,
  putGoodsErpList,
  patchGoodsStatusInfo,
  patchGoodsOrderList,
  deleteGoodsList,
} from '@/api/goods';
import type { PostGoodsRequest, PutGoodsRequest, GoodsStatus } from '@/types/goods.type';

export const useGoodsList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['goodsList'],
    queryFn: getGoodsList,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });
};

export const useGoodsErpList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['goodsErpList'],
    queryFn: getGoodsErpList,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });
};

export const usePostGoods = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostGoodsRequest) => postGoodsInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsList'] });
    },
  });
};

export const usePutGoods = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goodsId, data }: { goodsId: number; data: PutGoodsRequest }) =>
      putGoodsInfo(goodsId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsList'] });
    },
  });
};

export const usePutGoodsErpList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => putGoodsErpList(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsList'] });
      queryClient.invalidateQueries({ queryKey: ['goodsErpList'] });
    },
  });
};

export const usePatchGoodsStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goodsId, goodsSt }: { goodsId: number; goodsSt: GoodsStatus }) =>
      patchGoodsStatusInfo(goodsId, goodsSt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsList'] });
    },
  });
};

export const usePatchGoodsOrderList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { goodsId: number; goodsOrd: number }[]) =>
      patchGoodsOrderList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsList'] });
    },
  });
};

export const useDeleteGoodsList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goodsIdList: number[]) => deleteGoodsList(goodsIdList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsList'] });
    },
  });
};
