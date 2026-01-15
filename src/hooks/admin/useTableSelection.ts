import { useState } from 'react';

export interface TableOption {
  id: number;
  label: string;
}

export const useTableSelection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

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
