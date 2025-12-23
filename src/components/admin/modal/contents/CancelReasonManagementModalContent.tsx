'use client';

import React, { useState } from 'react';
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
import styles from '@/styles/components/modal/CancelReasonManagementModal.module.scss';
import { CancelReason } from '@/types/admin/modal.type';

interface CancelReasonManagementModalContentProps {
  initialReasons: CancelReason[];
  onSubmit: (reasons: CancelReason[]) => void;
  onClose: () => void;
}

interface SortableRowProps {
  reason: CancelReason;
  onDelete: (id: string) => void;
}

const SortableRow: React.FC<SortableRowProps> = ({ reason, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: reason.id });

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
        <div className={styles.contentText}>{reason.content}</div>
      </div>
      <div className={styles.actionColumn}>
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(reason.id)}
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
  onClose,
}) => {
  const [reasons, setReasons] = useState<CancelReason[]>(initialReasons);
  const [newReason, setNewReason] = useState('');

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
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAdd = () => {
    if (!newReason.trim()) {
      alert('취소 사유를 입력해주세요.');
      return;
    }

    if (reasons.length >= 10) {
      alert('취소 사유는 최대 10개까지 등록이 가능합니다.');
      return;
    }

    const newReasonItem: CancelReason = {
      id: Date.now().toString(),
      content: newReason.trim(),
      order: reasons.length,
    };

    setReasons([...reasons, newReasonItem]);
    setNewReason('');
  };

  const handleDelete = (id: string) => {
    setReasons(reasons.filter(reason => reason.id !== id));
  };

  const handleSubmit = () => {
    // 순서 재정렬
    const updatedReasons = reasons.map((reason, index) => ({
      ...reason,
      order: index,
    }));
    onSubmit(updatedReasons);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>취소 관리</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="취소 사유를 작성해주세요"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            onKeyPress={handleKeyPress}
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={reasons.map(r => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {reasons.map((reason) => (
                  <SortableRow
                    key={reason.id}
                    reason={reason}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className={styles.notice}>
          취소 사유는 최대 10개까지 등록이 가능합니다.
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.saveButton} onClick={handleSubmit}>
          저장
        </button>
      </div>
    </div>
  );
};

export default CancelReasonManagementModalContent;
