type ApiErrorListener = (message: string, variant: 'error' | 'info') => void;

interface ApiErrorEvent {
  message: string;
  variant: 'error' | 'info';
}

class ApiErrorHandler {
  private listeners: Set<ApiErrorListener> = new Set();
  private pendingErrors: ApiErrorEvent[] = [];

  subscribe(listener: ApiErrorListener) {
    this.listeners.add(listener);

    this.pendingErrors.forEach(error => {
      listener(error.message, error.variant);
    });
    this.pendingErrors = [];

    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(message: string, variant: 'error' | 'info' = 'error') {
    if (this.listeners.size === 0) {
      this.pendingErrors.push({ message, variant });
      return;
    }

    this.listeners.forEach(listener => {
      listener(message, variant);
    });
  }
}

export const apiErrorHandler = new ApiErrorHandler();
