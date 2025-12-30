'use client';

import React, { useState } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/CategoryModal.module.scss';
import { Category } from '@/types';

interface CategoryModalContentProps {
  initialCategories: Category[];
  onSubmit: (categories: Category[]) => void;
  onClose: () => void;
}

const CategoryModalContent: React.FC<CategoryModalContentProps> = ({
  initialCategories,
  onSubmit,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('분류명을 입력하세요.');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      order: categories.length,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleSubmit = () => {
    onSubmit(categories);
  };

  const buttons = (
    <>
      <button className={commonStyles.cancelButton} onClick={onClose}>
        닫기
      </button>
      <button className={commonStyles.confirmButton} onClick={handleSubmit}>
        저장
      </button>
    </>
  );

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

        <div className={styles.tableBody}>
          {categories.map((category) => (
            <div key={category.id} className={styles.tableRow}>
              <div className={styles.orderColumn}>
                <div className={styles.dragHandle}>
                  <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H18V2H0V0Z" fill="#7B7B7B"/>
                    <path d="M0 6H18V8H0V6Z" fill="#7B7B7B"/>
                  </svg>
                </div>
              </div>
              <div className={styles.contentColumn}>
                <div className={styles.categoryName}>{category.name}</div>
              </div>
              <div className={styles.manageColumn}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H10V2H0V0Z" fill="#DC0000"/>
                  </svg>
                  <div className={styles.deleteText}>삭제</div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CommonModalLayout>
  );
};

export default CategoryModalContent;
