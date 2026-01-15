import { atom } from 'recoil';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastState {
  isShow: boolean;
  message: string;
  variant: ToastVariant;
}

export const toastState = atom<ToastState>({
  key: 'toastState',
  default: {
    isShow: false,
    message: '',
    variant: 'success',
  },
});
