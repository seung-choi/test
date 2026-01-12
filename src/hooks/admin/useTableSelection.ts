import { useState } from 'react';

export const useTableSelection = (onTableSelect?: (tableNumber: string) => void) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTable = (table: string) => {
    setSelectedTable(table);
    setIsDropdownOpen(false);
    if (onTableSelect) {
      onTableSelect(table);
    }
  };

  return {
    isDropdownOpen,
    selectedTable,
    toggleDropdown,
    selectTable,
  };
};
