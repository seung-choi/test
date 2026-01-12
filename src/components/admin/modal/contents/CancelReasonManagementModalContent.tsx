'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/CancelReasonManagementModal.module.scss';
import { CancelReason } from '@/types';
import { useCategoryList, usePostCategoryList } from '@/hooks/api';
import type { PostCategoryRequest } from '@/api/category';

interface CancelReasonManagementModalContentProps {
  initialReasons?: CancelReason[];
  onSubmit: (reasons: CancelReason[]) => void;
  onClose: () => void;
}

interface SortableRowProps {
  reason: CancelReasonRow;
  onDelete: (rowId: string) => void;
}

interface CancelReasonRow {
  rowId: string;
  categoryId: number | null;
  categoryNm: string;
  categoryOrd: number;
  categoryErp: string;
}

const SortableRow: React.FC<SortableRowProps> = ({ reason, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: reason.rowId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.tableRow}
    >
      <div className={styles.orderColumn}>
        <div
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
        >
          <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="18" height="2" fill="#7B7B7B"/>
            <rect y="6" width="18" height="2" fill="#7B7B7B"/>
          </svg>
        </div>
      </div>
      <div className={styles.contentColumn}>
        <div className={styles.contentText}>{reason.categoryNm}</div>
      </div>
      <div className={styles.actionColumn}>
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(reason.rowId)}
        >
          <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="10" height="2" fill="#DC0000"/>
          </svg>
          <span className={styles.deleteText}>삭제</span>
        </button>
      </div>
    </div>
  );
};

const CancelReasonManagementModalContent: React.FC<CancelReasonManagementModalContentProps> = ({
  initialReasons,
  onSubmit,
}) => {
  const [reasons, setReasons] = useState<CancelReasonRow[]>([]);
  const [newReason, setNewReason] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const { data: categoryReasons = [] } = useCategoryList('REASON');
  const { mutateAsync: saveReasons } = usePostCategoryList();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setReasons((items) => {
        const oldIndex = items.findIndex((item) => item.rowId === active.id);
        const newIndex = items.findIndex((item) => item.rowId === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const mappedInitialReasons = useMemo<CancelReasonRow[]>(() => {
    const base = initialReasons && initialReasons.length > 0 ? initialReasons : categoryReasons;
    return base.map((reason, index) => ({
      rowId: reason.categoryId ? String(reason.categoryId) : `temp-${index}`,
      categoryId: reason.categoryId ?? null,
      categoryNm: reason.categoryNm,
      categoryOrd: reason.categoryOrd,
      categoryErp: reason.categoryErp || '',
    }));
  }, [categoryReasons, initialReasons]);

  useEffect(() => {
    if (!hasInitialized && mappedInitialReasons.length > 0) {
      setReasons(mappedInitialReasons);
      setHasInitialized(true);
    }
  }, [mappedInitialReasons, hasInitialized]);

  const handleAdd = () => {
    if (!newReason.trim()) {
      alert('취소 사유를 입력해주세요.');
      return;
    }

    if (reasons.length >= 10) {
      alert('취소 사유는 최대 10개까지 등록이 가능합니다.');
      return;
    }

    const newReasonItem: CancelReasonRow = {
      rowId: `temp-${Date.now()}`,
      categoryId: null,
      categoryNm: newReason.trim(),
      categoryOrd: reasons.length + 1,
      categoryErp: '',
    };

    setReasons([...reasons, newReasonItem]);
    setNewReason('');
  };

  const handleDelete = (rowId: string) => {
    setReasons(reasons.filter(reason => reason.rowId !== rowId));
  };

  const handleSubmit = async () => {
    const payload: PostCategoryRequest[] = reasons.map((reason, index) => ({
      categoryId: reason.categoryId ?? null,
      categoryNm: reason.categoryNm,
      categoryOrd: index + 1,
      categoryErp: reason.categoryErp || '',
    }));

    await saveReasons({ categoryType: 'REASON', data: payload });

    const updatedReasons: CancelReason[] = payload.map((reason) => ({
      categoryId: reason.categoryId ?? null,
      categoryNm: reason.categoryNm,
      categoryOrd: reason.categoryOrd,
      categoryErp: reason.categoryErp || '',
    }));

    onSubmit(updatedReasons);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const buttons = (
    <button className={commonStyles.confirmButton} onClick={handleSubmit}>
      저장
    </button>
  );

  return (
    <CommonModalLayout title="취소 관리" buttons={buttons}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          className={styles.input}
          placeholder="취소 사유를 작성해주세요"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className={styles.addButton} onClick={handleAdd}>
          추가
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
          <div className={styles.actionColumn}>
            <div className={styles.headerText}>관리</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {reasons.length === 0 ? (
            <div className={styles.emptyState}>취소사유가 없습니다</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={reasons.map(r => r.rowId)}
                strategy={verticalListSortingStrategy}
              >
                {reasons.map((reason) => (
                  <SortableRow
                    key={reason.rowId}
                    reason={reason}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <div className={styles.notice}>
        취소 사유는 최대 10개까지 등록이 가능합니다.
      </div>
    </CommonModalLayout>
  );
};

export default CancelReasonManagementModalContent;
