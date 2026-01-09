import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategoryList,
  getCategoryErpList,
  postCategoryList,
  CategoryType,
  PostCategoryRequest,
} from '@/api/category';

export const useCategoryList = (
  categoryType: CategoryType,
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
    mutationFn: ({ categoryType, data }: { categoryType: CategoryType; data: PostCategoryRequest[] }) =>
      postCategoryList(categoryType, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categoryList', variables.categoryType] });
    },
  });
};
