import { useCallback, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { toastState, ToastVariant } from '@/lib/recoil/toastAtom';

const TOAST_DURATION = 2500;

export const useToast = () => {
  const [toast, setToast] = useRecoilState(toastState);
  const timerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setToast({
      isShow: true,
      message,
      variant,
    });

    timerRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, isShow: false }));
    }, TOAST_DURATION);
  }, [setToast]);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setToast((prev) => ({ ...prev, isShow: false }));
  }, [setToast]);

  return {
    toast,
    showToast,
    hideToast,
  };
};

export default useToast;
