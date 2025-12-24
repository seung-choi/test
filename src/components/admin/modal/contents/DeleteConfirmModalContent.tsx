'use client';

import React from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/DeleteConfirmModal.module.scss';
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
  const buttons = (
    <>
      <button className={commonStyles.cancelButton} onClick={onClose}>
        닫기
      </button>
      <button className={commonStyles.deleteButton} onClick={onConfirm}>
        삭제
      </button>
    </>
  );

  return (
    <CommonModalLayout title="상품 삭제" buttons={buttons}>
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
    </CommonModalLayout>
  );
};

export default DeleteConfirmModalContent;
