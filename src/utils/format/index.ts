export const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR');
};

export const formatDate = (value: string): string => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime = (
  value?: string | null,
  options?: { emptyValue?: string }
): string => {
  const emptyValue = options?.emptyValue ?? '-';
  if (!value) return emptyValue;
  const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  return value;
};
