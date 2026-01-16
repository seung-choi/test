import { ERROR_MESSAGES, ERROR_STATUS_MESSAGE_MAP, type ErrorMessageKey } from '@/constants/api/errorMessages';

export const getErrorMessage = (code?: string, status?: number): string => {
  if (code && Object.prototype.hasOwnProperty.call(ERROR_MESSAGES, code)) {
    return ERROR_MESSAGES[code as ErrorMessageKey];
  }

  if (status && ERROR_STATUS_MESSAGE_MAP[status]) {
    return ERROR_MESSAGES[ERROR_STATUS_MESSAGE_MAP[status]];
  }

  return ERROR_MESSAGES.DEFAULT;
};
