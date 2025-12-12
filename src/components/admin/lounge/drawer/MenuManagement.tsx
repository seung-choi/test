import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import styles from '@/styles/components/admin/lounge/drawer/MenuManagement.module.scss';
import Table from '@/components/common/Table';
import { MenuMockData } from '@/mock/menuMockData';
import { getMenuTableColumns } from "@/constants/columns/MenuTable";
import { drawerState } from '@/lib/recoil';

interface MenuManagementProps {
  onClose: () => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ onClose }) => {
  const drawer = useRecoilValue(drawerState);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSearch = () => {
    console.log('검색:', drawer.menuSearchTerm);
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`${action} 실행:`, selectedItems);
  };

  const columns = useMemo(
    () => getMenuTableColumns({ selectedItems, handleItemSelect }),
    [selectedItems]
  );

  const filteredData = useMemo(() => {
    if (!drawer.menuSearchTerm) return MenuMockData;

    const searchTerm = drawer.menuSearchTerm.toLowerCase();
    return MenuMockData.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm) ||
        item.code?.toLowerCase().includes(searchTerm)
    );
  }, [drawer.menuSearchTerm]);

  return (
    <div className={styles.menuManagement}>
      <div className={styles.contentArea}>
        <div className={styles.itemCount}>총 {filteredData.length}개</div>

        <Table
          columns={columns}
          data={filteredData}
          variant="menu"
          onSort={(key) => console.log('정렬:', key)}
        />
      </div>

      <div className={styles.scrollbar} />
    </div>
  );
};

export default MenuManagement;
