import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEventMsgHisList, postEventMsgSend } from '@/api/event';
import { PostEventMsgRequest } from '@/types/api/event.type';

export const useEventMsgHisList = (options?: { enabled?: boolean; refetchInterval?: number }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['eventMsgHisList'],
    queryFn: getEventMsgHisList,
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    retry: 2,
  });

  return {
    eventMsgHistory: data ?? [],
    isLoading,
    error,
    refetch,
  };
};

export const usePostEventMsgSend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostEventMsgRequest) => postEventMsgSend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventMsgHisList'] });
    },
  });
};
