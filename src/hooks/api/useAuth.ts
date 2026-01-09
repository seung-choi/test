import { useMutation, useQuery } from '@tanstack/react-query';
import { postLogin, patchLogin, getMenuHisList, LoginFormAPI } from '@/api/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormAPI) => postLogin(data),
  });
};

export const useMenuHisList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['menuHisList'],
    queryFn: getMenuHisList,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => patchLogin(),
  });
};
