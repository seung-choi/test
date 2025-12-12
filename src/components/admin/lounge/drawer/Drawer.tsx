import React, { useState } from 'react';
import styles from '../../../../styles/components/lounge/drawer/Drawer.module.scss';

type DrawerMode = 'setting' | 'menu';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  hasBackgroundImage?: boolean;
  mode?: DrawerMode;
}

const Drawer: React.FC<DrawerProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         hasBackgroundImage = true,
                                         mode
                                       }) => {
  const [selectedStore, setSelectedStore] = useState('스타트 하우스');
  const [activeTab, setActiveTab] = useState<'sales' | 'layout'>('sales');

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.drawerOverlay} ${hasBackgroundImage ? styles.backgroundImage : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.drawerContainer}>
        <div className={styles.drawerHeader}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>{title}</div>
            <div className={styles.storeSelector}>
              <div className={styles.storeName}>{selectedStore}</div>
              <img src="/assets/image/global/arrow.svg" alt="arrow" />
            </div>
          </div>

          {mode === 'setting' && (
            <div className={styles.settingModeHeader}>
              <div
                className={`${styles.tab} ${activeTab === 'sales' ? styles.active : ''}`}
                onClick={() => setActiveTab('sales')}
              >
                <div className={styles.tabText}>매출 조회</div>
              </div>
              <div
                className={`${styles.tab} ${activeTab === 'layout' ? styles.active : ''}`}
                onClick={() => setActiveTab('layout')}
              >
                <div className={styles.tabText}>배치도 관리</div>
              </div>
            </div>
          )}

          {mode === 'menu' && (
            <div className={styles.menuModeHeader}>
              <div className={styles.searchSection}>
                <div className={styles.searchInput}>
                  <div className={styles.searchPlaceholder}>메뉴명 또는 코드를 입력해주세요.</div>
                </div>
                <div className={styles.searchButton}>
                  <div className={styles.buttonText}>검색</div>
                </div>
              </div>
              <div className={styles.categoryButton}>
                <div className={styles.buttonText}>분류 설정</div>
              </div>
              <div className={styles.registerButton}>
                <div className={styles.buttonText}>상품 등록</div>
              </div>
              <div className={styles.orderButton}>
                <div className={styles.buttonText}>순서 변경</div>
              </div>
              <div className={styles.cancelReasonButton}>
                <div className={styles.buttonText}>취소사유 관리</div>
              </div>
              <div className={styles.deleteButton}>
                <div className={styles.buttonText}>삭제</div>
              </div>
            </div>
          )}
        </div>


        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="닫기"
        >
          <img src="/assets/image/global/x.svg" alt="닫기" />
        </button>

        <div className={styles.drawerContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;