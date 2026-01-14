import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from '@/types/bill.type';

export const useBillList = (params?: GetBillParams, options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['billList', params],
    queryFn: () => getBillList(params),
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });

  return {
    billData: data,
    isLoading,
    error,
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
    },
  });
};

export const usePatchBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, tableId }: { billId: number; tableId: number }) =>
      patchBillInfo(billId, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billList'] });
      queryClient.invalidateQueries({ queryKey: ['billListByStatus'] });
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
    },
  });
};
