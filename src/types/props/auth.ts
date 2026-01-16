import type { FormErrors, LoginFormData } from '@/utils/validation';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  errors?: FormErrors;
  isLoading?: boolean;
}
