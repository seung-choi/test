'use client';

import React from 'react';
import styles from '@/styles/components/modal/DeleteConfirmModal.module.scss';
import { DeleteItem } from '@/types/admin/modal.type';

interface DeleteConfirmModalContentProps {
  items: DeleteItem[];
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmModalContent: React.FC<DeleteConfirmModalContentProps> = ({
  items,
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>상품 삭제</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.content}>
        <div className={styles.message}>아래 상품을 정말 삭제하시겠습니까?</div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.codeColumn}>
              <div className={styles.headerText}>코드</div>
            </div>
            <div className={styles.categoryColumn}>
              <div className={styles.headerText}>분류</div>
            </div>
            <div className={styles.nameColumn}>
              <div className={styles.headerText}>메뉴명</div>
            </div>
            <div className={styles.priceColumn}>
              <div className={styles.headerText}>금액</div>
            </div>
          </div>

          <div className={styles.tableBody}>
            {items.map((item, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.codeColumn}>
                  <div className={styles.cellText}>{item.code}</div>
                </div>
                <div className={styles.categoryColumn}>
                  <div className={styles.cellText}>{item.category}</div>
                </div>
                <div className={styles.nameColumn}>
                  <div className={styles.cellText}>{item.name}</div>
                </div>
                <div className={styles.priceColumn}>
                  <div className={styles.cellText}>{item.price.toLocaleString('ko-KR')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.cancelButton} onClick={onClose}>
          닫기
        </button>
        <button className={styles.confirmButton} onClick={onConfirm}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmModalContent;
