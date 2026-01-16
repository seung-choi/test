import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBillList,
  postBillInfo,
  postBillOrder,
  getBillListByStatus,
  getBillOrderList,
  putBillErpInfo,
  patchBillInfo,
  patchBillComplete,
  deleteBillInfo,
  deleteBillOrderList,
  getBillErpList,
} from '@/api/bill';
import {
  GetBillParams,
  PostBillRequest,
  PostOrderRequest,
  PutBillRequest,
  DeleteBillRequest,
  DeleteBillListRequest,
} from '@/types/api/bill.type';

export const useInfiniteBillList = (params?: Omit<GetBillParams, 'page'>, options?: {
  enabled?: boolean;
}) => {
  const PAGE_SIZE = 50;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['infiniteBillList', params],
    queryFn: ({ pageParam = 1 }) => getBillList({
      ...params,
      page: pageParam,
      size: PAGE_SIZE,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.billList.length, 0);
      if (totalLoaded >= lastPage.totalCnt) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });

  const billList = data?.pages.flatMap(page => page.billList) ?? [];
  const stats = data?.pages[0] ? {
    totalCnt: data.pages[0].totalCnt,
    doneCnt: data.pages[0].doneCnt,
    cancelCnt: data.pages[0].cancelCnt,
    totalAmt: data.pages[0].totalAmt,
  } : null;

  return {
    billList,
    stats,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
};

export const useBillListByStatus = (orderSt: string, options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['billListByStatus', orderSt],
    queryFn: () => getBillListByStatus(orderSt),
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });

  return {
    billList: data,
    isLoading,
    error,
    refetch,
  };
};

export const useBillOrderList = (billId: number, options?: {
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['billOrderList', billId],
    queryFn: () => getBillOrderList(billId),
    enabled: options?.enabled ?? true,
    retry: 2,
  });

  return {
    orderList: data,
    isLoading,
    error,
    refetch,
  };
};

export const useBillErpList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['billErpList'],
    queryFn: getBillErpList,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
  });

  return {
    erpBookingList: data,
    isLoading,
    error,
    refetch,
  };
};

export const usePostBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostBillRequest) => postBillInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteBillList'] });
      queryClient.invalidateQueries({ queryKey: ['billErpList'] });
    },
  });
};

export const usePostBillOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostOrderRequest) => postBillOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['billOrderList'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteBillList'] });
    },
  });
};

export const usePutBillErp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, tableId, data }: { billId: number; tableId: number; data: PutBillRequest }) =>
      putBillErpInfo(billId, tableId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteBillList'] });
      queryClient.invalidateQueries({ queryKey: ['billErpList'] });
    },
  });
};

export const usePatchBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, tableId }: { billId: number; tableId: number | null }) =>
      patchBillInfo(billId, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteBillList'] });
    },
  });
};

export const usePatchBillComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: number) => patchBillComplete(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteBillList'] });
    },
  });
};

export const useDeleteBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, data }: { billId: number; data: DeleteBillRequest }) =>
      deleteBillInfo(billId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteBillList'] });
      queryClient.invalidateQueries({ queryKey: ['billErpList'] });
    },
  });
};

export const useDeleteBillOrderList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, data }: { billId: number; data: DeleteBillListRequest }) =>
      deleteBillOrderList(billId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['billOrderList'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteBillList'] });
    },
  });
};
