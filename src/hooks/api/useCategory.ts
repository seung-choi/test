import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoryList, getCategoryErpList, postCategoryList } from '@/api/category';
import type { CategoryApiType, PostCategoryRequest } from '@/types/api/category.type';

export const useCategoryList = (
  categoryType: CategoryApiType,
  options?: {
    refetchInterval?: number;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['categoryList', categoryType],
    queryFn: () => getCategoryList(categoryType),
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });
};

export const useCategoryErpList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['categoryErpList'],
    queryFn: getCategoryErpList,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 30000,
  });
};

export const usePostCategoryList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryType, data }: { categoryType: CategoryApiType; data: PostCategoryRequest[] }) =>
      postCategoryList(categoryType, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categoryList', variables.categoryType] });
      queryClient.invalidateQueries({ queryKey: ['categoryErpList'] });
      // 카테고리 변경 시 관련 상품 목록도 갱신
      if (variables.categoryType === 'CATEGORY') {
        queryClient.invalidateQueries({ queryKey: ['goodsList'] });
      }
    },
  });
};
