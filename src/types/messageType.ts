export interface MessageModalData {
  isShow: boolean;
  mode: 'cancel' | 'message';
  title: string;
  recipients?: string[];
  onSubmit?: (data: MessageFormData) => void;
  onCancel?: () => void;
}

export interface MessageFormData {
  recipient: string;
  content: string;
  image?: File;
}