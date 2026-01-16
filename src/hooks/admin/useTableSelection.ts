import { useEffect, useState } from 'react';
import type { TableOption } from '@/types/admin/tableSelection.type';

export const useTableSelection = (initial?: { tableId?: number | null; tableLabel?: string | null }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(initial?.tableLabel ?? null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(initial?.tableId ?? null);

  useEffect(() => {
    if (initial?.tableLabel) {
      setSelectedTable(initial.tableLabel);
    }
    if (typeof initial?.tableId === 'number') {
      setSelectedTableId(initial.tableId);
    }
  }, [initial?.tableId, initial?.tableLabel]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTable = (table: TableOption) => {
    setSelectedTable(table.label);
    setSelectedTableId(table.id);
    setIsDropdownOpen(false);
  };

  const resetSelection = () => {
    setSelectedTable(null);
    setSelectedTableId(null);
  };

  return {
    isDropdownOpen,
    selectedTable,
    selectedTableId,
    toggleDropdown,
    selectTable,
    resetSelection,
  };
};
