'use client';

import React, { useEffect, useState } from 'react';
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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/CategoryModal.module.scss';
import { useCategoryList, usePostCategoryList } from '@/hooks/api/useCategory';
import { GetCategoryResponse, PostCategoryRequest } from '@/api/category';

interface CategoryModalContentProps {
  onClose: () => void;
}

interface CategoryItem extends GetCategoryResponse {
  isNew?: boolean;
  isDeleted?: boolean;
}

const CategoryModalContent: React.FC<CategoryModalContentProps> = ({ onClose }) => {
  const { data: categoryList = [], isLoading } = useCategoryList('CATEGORY');
  const postCategoryMutation = usePostCategoryList();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (categoryList.length > 0) {
      setCategories(categoryList);
    }
  }, [categoryList]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.categoryId === active.id);
        const newIndex = items.findIndex((item) => item.categoryId === over.id);

        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        // Update categoryOrd for all items
        return reorderedItems.map((item, index) => ({
          ...item,
          categoryOrd: index + 1,
        }));
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('분류명을 입력하세요.');
      return;
    }

    const newCategory: CategoryItem = {
      categoryId: Date.now(), // Temporary ID for new items
      categoryNm: newCategoryName.trim(),
      categoryOrd: categories.length + 1,
      categoryErp: '',
      isNew: true,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);

    if (category?.isNew) {
      // If it's a new category, just remove it from the list
      setCategories(categories.filter((cat) => cat.categoryId !== categoryId));
    } else {
      // If it's an existing category, mark it as deleted
      setCategories(
        categories.map((cat) =>
          cat.categoryId === categoryId ? { ...cat, isDeleted: true } : cat
        )
      );
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for API
      const requestData: PostCategoryRequest[] = categories
        .filter((cat) => !cat.isDeleted)
        .map((cat) => ({
          categoryId: cat.isNew ? undefined : cat.categoryId,
          categoryNm: cat.categoryNm,
          categoryOrd: cat.categoryOrd,
          categoryErp: cat.categoryErp,
        }));

      await postCategoryMutation.mutateAsync({
        categoryType: 'CATEGORY',
        data: requestData,
      });

      alert('저장되었습니다.');
      onClose();
    } catch (error) {
      console.error('Failed to save categories:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const buttons = (
    <>
      <button className={commonStyles.cancelButton} onClick={onClose}>
        닫기
      </button>
      <button
        className={commonStyles.confirmButton}
        onClick={handleSubmit}
        disabled={postCategoryMutation.isPending}
      >
        {postCategoryMutation.isPending ? '저장 중...' : '저장'}
      </button>
    </>
  );

  const visibleCategories = categories.filter((cat) => !cat.isDeleted);

  if (isLoading) {
    return (
      <CommonModalLayout title="분류 설정" buttons={buttons}>
        <div className={styles.loading}>로딩 중...</div>
      </CommonModalLayout>
    );
  }

  return (
    <CommonModalLayout title="분류 설정" buttons={buttons}>
      <div className={styles.inputSection}>
        <input
          type="text"
          className={styles.input}
          placeholder="분류명을 입력하세요"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddCategory();
            }
          }}
        />
        <button className={styles.addButton} onClick={handleAddCategory}>
          <div className={styles.buttonText}>추가</div>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.orderColumn}>
            <div className={styles.headerText}>순서</div>
          </div>
          <div className={styles.contentColumn}>
            <div className={styles.headerText}>내용</div>
          </div>
          <div className={styles.manageColumn}>
            <div className={styles.headerText}>관리</div>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleCategories.map((cat) => cat.categoryId)} strategy={verticalListSortingStrategy}>
            <div className={styles.tableBody}>
              {visibleCategories.length > 0 ? (
                visibleCategories.map((category) => (
                  <SortableCategoryRow
                    key={category.categoryId}
                    category={category}
                    onDelete={handleDeleteCategory}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>분류가 없습니다</div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </CommonModalLayout>
  );
};

interface SortableCategoryRowProps {
  category: CategoryItem;
  onDelete: (categoryId: number) => void;
}

const SortableCategoryRow: React.FC<SortableCategoryRowProps> = ({ category, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.categoryId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.tableRow}>
      <div className={styles.orderColumn}>
        <div className={styles.dragHandle} {...attributes} {...listeners}>
          <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H18V2H0V0Z" fill="#7B7B7B" />
            <path d="M0 6H18V8H0V6Z" fill="#7B7B7B" />
          </svg>
        </div>
      </div>
      <div className={styles.contentColumn}>
        <div className={styles.categoryName}>{category.categoryNm}</div>
      </div>
      <div className={styles.manageColumn}>
        <button className={styles.deleteButton} onClick={() => onDelete(category.categoryId)}>
          <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H10V2H0V0Z" fill="#DC0000" />
          </svg>
          <div className={styles.deleteText}>삭제</div>
        </button>
      </div>
    </div>
  );
};

export default CategoryModalContent;
