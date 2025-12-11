import { atom } from 'recoil';

export interface AlertModalState {
  isShow: boolean;
  desc: string;
  okBtnLabel?: string;
  cancleBtnLabel?: string;
  okCallback?: () => void;
  cancleCallback?: () => void;
  actionUrl?: string;
}

export const alertModalState = atom<AlertModalState>({
  key: 'alertModalState',
  default: {
    isShow: false,
    desc: '',
  },
});

export interface MessageModalState {
  isShow: boolean;
  mode: 'cancel' | 'message';
  title: string;
  desc?: string;
  recipients?: string[];
  onSubmit?: (data?: any) => void;
  onCancel?: () => void;
  okCallback?: () => void;
  cancleCallback?: () => void;
  okBtnLabel?: string;
  cancleBtnLabel?: string;
}

export const messageModalState = atom<MessageModalState>({
  key: 'messageModalState',
  default: {
    isShow: false,
    mode: 'cancel',
    title: '',
  },
});