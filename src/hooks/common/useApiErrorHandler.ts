import { useEffect } from 'react';
import { apiErrorHandler } from '@/utils/api/apiErrorHandler';
import { useToast } from '@/hooks/common/useToast';

/**
 * API 에러를 감지하여 토스트로 표시하는 훅
 * 앱의 최상위 레벨에서 한 번만 호출하면 됩니다.
 */
export const useApiErrorHandler = () => {
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = apiErrorHandler.subscribe((message, variant) => {
      showToast(message, variant);
    });

    return () => {
      unsubscribe();
    };
  }, [showToast]);
};

export default useApiErrorHandler;
