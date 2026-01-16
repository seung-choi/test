import { useCallback, useMemo } from 'react';
import type { UseToggleSelectionParams } from '@/types';

export const useToggleSelection = <T extends string, B extends string>({
  value,
  onChange,
  options,
  bothValue,
}: UseToggleSelectionParams<T, B>) => {
  const getSelectedItems = useCallback((): T[] => {
    if (value === bothValue) return [...options];
    return options.includes(value as T) ? [value as T] : [...options];
  }, [value, bothValue, options]);

  const getCombinedValue = useCallback((items: T[]): T | B => {
    if (items.length === options.length) return bothValue;
    if (items.length === 0) return bothValue;
    return items[0];
  }, [options, bothValue]);

  const handleToggle = useCallback((item: T) => {
    const selected = getSelectedItems();
    const nextSelected = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];

    if (nextSelected.length === 0) return;
    onChange(getCombinedValue(nextSelected));
  }, [getSelectedItems, getCombinedValue, onChange]);

  const selectedItems = useMemo(() => getSelectedItems(), [getSelectedItems]);

  return {
    selectedItems,
    handleToggle,
  };
};
