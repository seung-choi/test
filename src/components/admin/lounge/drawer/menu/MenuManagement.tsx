import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import styles from '@/styles/components/admin/lounge/drawer/MenuManagement.module.scss';
import Table from '@/components/common/Table';
import {MenuMockData} from '@/mock/menuMockData';
import {getMenuTableColumns} from "@/constants/columns/MenuTable";
import {drawerState} from '@/lib/recoil';
import useUnifiedModal from '@/hooks/useUnifiedModal';
import {ProductFormData} from '@/lib/recoil/modalAtom';
import {formatDate, formatPrice} from "@/utils";

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
  const { openEditProductModal } = useUnifiedModal();

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
      const newData = menuData.filter(item => !selectedItems.includes(String(item.id)));
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


  const handleEdit = (itemId: string) => {
    const menuItem = menuData.find(item => String(item.id) === itemId);
    if (!menuItem) return;

    const initialData: ProductFormData = {
      status: menuItem.status === '판매중' ? '판매' : menuItem.status === '중지' ? '중지' : '대기',
      channels: menuItem.channels || [],
      types: menuItem.types || [],
      category: menuItem.category || '',
      store: menuItem.store,
      code: menuItem.code || '',
      name: menuItem.name || '',
      price: formatPrice(menuItem.price) + '원',
      cookingTime: menuItem.cookingTime,
      tags: menuItem.tags || [],
      registeredDate: formatDate(menuItem.registerDate),
      // updatedDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    };

    openEditProductModal(
        initialData,
        (data) => {
          console.log('상품 수정:', data);
          // TODO: 실제 상품 수정 API 호출
          setMenuData(prevData => {
            return prevData.map(item => {
              if (String(item.id) === itemId) {
                return {
                  ...item,
                  store: data.store,
                  code: data.code,
                  category: data.category,
                  name: data.name,
                  price: parseInt(data.price.replace(/[^0-9]/g, '')) || 0,
                  tags: data.tags,
                  cookingTime: data.cookingTime,
                  status: data.status === '판매' ? '판매중' : data.status,
                  channels: data.channels,
                  types: data.types,
                };
              }
              return item;
            });
          });
        },
        () => {
          console.log('상품 수정 취소');
        }
    );
  };

  const columns = useMemo(
    () => getMenuTableColumns({
      selectedItems,
      handleItemSelect,
      handleEdit,
      isReorderMode: drawer.isReorderMode
    }),
    [selectedItems, drawer.isReorderMode, menuData]
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
