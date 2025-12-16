import React, { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useRecoilValue } from 'recoil';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styles from '@/styles/components/admin/lounge/drawer/MenuManagement.module.scss';
import Table from '@/components/common/Table';
import { MenuMockData } from '@/mock/menuMockData';
import { getMenuTableColumns } from "@/constants/columns/MenuTable";
import { drawerState } from '@/lib/recoil';

interface MenuManagementProps {
  onClose: () => void;
  onDelete?: (selectedItems: string[]) => void;
}

export interface MenuManagementRef {
  handleDelete: () => void;
}

const MenuManagement = forwardRef<MenuManagementRef, MenuManagementProps>(({ onClose, onDelete }, ref) => {
  const drawer = useRecoilValue(drawerState);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [menuData, setMenuData] = useState(MenuMockData);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenuData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (confirm(`선택한 ${selectedItems.length}개의 항목을 삭제하시겠습니까?`)) {
      const newData = menuData.filter(item => !selectedItems.includes(item.id));
      setMenuData(newData);
      setSelectedItems([]);
      onDelete?.(selectedItems);
    }
  };

  useImperativeHandle(ref, () => ({
    handleDelete
  }));

  const handleBulkAction = (action: string) => {
    console.log(`${action} 실행:`, selectedItems);
  };

  const columns = useMemo(
    () => getMenuTableColumns({
      selectedItems,
      handleItemSelect,
      isReorderMode: drawer.isReorderMode
    }),
    [selectedItems, drawer.isReorderMode]
  );

  const filteredData = useMemo(() => {
    if (!drawer.menuSearchTerm) return menuData;

    const searchTerm = drawer.menuSearchTerm.toLowerCase();
    return menuData.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm) ||
        item.code?.toLowerCase().includes(searchTerm)
    );
  }, [drawer.menuSearchTerm, menuData]);

  const tableContent = (
    <Table
      columns={columns}
      data={filteredData}
      variant="menu"
      onSort={(key) => console.log('정렬:', key)}
      isReorderMode={drawer.isReorderMode}
    />
  );

  return (
    <div className={styles.menuManagement}>
      <div className={styles.contentArea}>
        <div className={styles.itemCount}>총 {filteredData.length}개</div>

        {drawer.isReorderMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredData.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {tableContent}
            </SortableContext>
          </DndContext>
        ) : (
          tableContent
        )}
      </div>

      <div className={styles.scrollbar} />
    </div>
  );
});

MenuManagement.displayName = 'MenuManagement';

export default MenuManagement;
