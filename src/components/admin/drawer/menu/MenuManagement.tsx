import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from '@/styles/components/admin/drawer/MenuManagement.module.scss';
import Table from '@/components/admin/common/Table';
import { getMenuTableColumns } from '@/constants/admin/columns/MenuTable';
import { drawerState } from '@/lib/recoil';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { MenuTableRow, ProductFormData } from '@/types';
import type { GoodsStatus } from '@/types/api/goods.type';
import { useGoodsList, usePatchGoodsOrderList, useDeleteGoodsList, usePatchGoodsStatus } from '@/hooks/api';
import { useToast } from '@/hooks/common/useToast';
import type { MenuManagementProps } from '@/types';

export interface MenuManagementRef {
  handleDelete: () => void;
  handleCommitReorder: () => void;
}

const MenuManagement = forwardRef<MenuManagementRef, MenuManagementProps>(({ onClose, onDelete, onSelectionChange }, ref) => {
  const drawer = useRecoilValue(drawerState);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [menuData, setMenuData] = useState<MenuTableRow[]>([]);
  const { openEditProductModal, openDeleteConfirmModal } = useUnifiedModal();
  const { data: goodsList = [] } = useGoodsList();
  const { mutateAsync: patchGoodsOrderList } = usePatchGoodsOrderList();
  const { mutateAsync: deleteGoodsList } = useDeleteGoodsList();
  const { mutateAsync: patchGoodsStatus } = usePatchGoodsStatus();
  const { showToast } = useToast();

  useEffect(() => {
    setMenuData(goodsList.map((goods) => ({ ...goods, id: goods.goodsId })));
  }, [goodsList]);

  useEffect(() => {
    onSelectionChange?.(selectedItems.length > 0);
  }, [selectedItems, onSelectionChange]);

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

  const handleSearch = () => {};

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      showToast('삭제할 항목을 선택해주세요.', 'error');
      return;
    }

    const itemsToDelete = menuData
      .filter(item => selectedItems.includes(String(item.id)))
      .map(item => ({
        code: item.goodsErp || '',
        category: item.categoryNm || '',
        name: item.goodsNm || '',
        price: item.goodsAmt
      }));

    openDeleteConfirmModal(
      itemsToDelete,
      async () => {
        try {
          const goodsIdList = selectedItems.map(id => Number(id));
          await deleteGoodsList(goodsIdList);

          const newData = menuData.filter(item => !selectedItems.includes(String(item.id)));
          setMenuData(newData);
          setSelectedItems([]);
          onDelete?.(selectedItems);

          showToast('삭제되었습니다.', 'success');
        } catch (error) {
          console.error('Failed to delete goods:', error);
          showToast('삭제에 실패했습니다.', 'error');
        }
      }
    );
  };

  useImperativeHandle(ref, () => ({
    handleDelete,
    handleCommitReorder: async () => {
      if (menuData.length === 0) return;
      const orderData = menuData.map((item, index) => ({
        goodsId: item.goodsId,
        goodsOrd: index + 1
      }));
      await patchGoodsOrderList(orderData);
    },
  }));


  const handleEdit = (itemId: string) => {
    const menuItem = menuData.find(item => String(item.id) === itemId);
    if (!menuItem) return;

    const initialData: ProductFormData = {
      goodsId: menuItem.goodsId,
      categoryId: menuItem.categoryId ?? 0,
      categoryNm: menuItem.categoryNm || '',
      goodsNm: menuItem.goodsNm || '',
      goodsAmt: menuItem.goodsAmt ?? 0,
      goodsCnt: menuItem.goodsCnt,
      goodsCh: menuItem.goodsCh,
      goodsOp: menuItem.goodsOp,
      goodsTm: menuItem.goodsTm ?? 0,
      goodsImg: menuItem.goodsImg || '',
      goodsTag: menuItem.goodsTag || '',
      goodsSt: menuItem.goodsSt,
      goodsErp: menuItem.goodsErp || '',
      createdDt: menuItem?.createdDt || '',
    };

    openEditProductModal(initialData);
  };

  const handleStatusChange = async (itemId: string, status: GoodsStatus) => {
    try {
      const goodsId = Number(itemId);

      await patchGoodsStatus({ goodsId, goodsSt: status });

      setMenuData(prevData => {
        return prevData.map(item => {
          if (String(item.id) === itemId) {
            return {
              ...item,
              goodsSt: status
            };
          }
          return item;
        });
      });
    } catch (error) {
      showToast('상태 변경에 실패했습니다.', 'error');
    }
  };

  const columns = useMemo(
    () => getMenuTableColumns({
      selectedItems,
      handleItemSelect,
      handleStatusChange,
      handleEdit,
      isReorderMode: drawer.isReorderMode
    }),
    [selectedItems, menuData, drawer.isReorderMode]
  );

  const filteredData = useMemo(() => {
    if (!drawer.menuSearchTerm) return menuData;

    const searchTerm = drawer.menuSearchTerm.toLowerCase();
    return menuData.filter(
      (item) =>
        item.goodsNm?.toLowerCase().includes(searchTerm) ||
        item.goodsErp?.toLowerCase().includes(searchTerm)
    );
  }, [drawer.menuSearchTerm, menuData]);

  const tableContent = filteredData.length > 0 ? (
    <Table
      columns={columns}
      data={filteredData}
      variant="menu"
      onSort={() => {}}
      isReorderMode={drawer.isReorderMode}
    />
  ) : (
    <div className={styles.emptyState}>등록된 메뉴가 없습니다</div>
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
    </div>
  );
});

MenuManagement.displayName = 'MenuManagement';

export default MenuManagement;
