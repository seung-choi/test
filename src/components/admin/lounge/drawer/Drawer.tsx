import React from 'react';
import { useRecoilState } from 'recoil';
import styles from '@/styles/components/admin/lounge/drawer/Drawer.module.scss';
import { drawerState } from '@/lib/recoil';
import useUnifiedModal from '@/hooks/useUnifiedModal';

type DrawerMode = 'setting' | 'menu';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  hasBackgroundImage?: boolean;
  mode?: DrawerMode;
  onDelete?: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         hasBackgroundImage = true,
                                         mode,
                                         onDelete
                                       }) => {
  const [drawer, setDrawer] = useRecoilState(drawerState);
  const { openCreateProductModal } = useUnifiedModal();

  const handleRegisterProduct = () => {
    openCreateProductModal(
      (data) => {
        console.log('상품 등록:', data);
        // 여기서 실제 상품 등록 API 호출
      },
      () => {
        console.log('상품 등록 취소');
      }
    );
  };

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
              <div className={styles.storeName}>{drawer.selectedStore}</div>
              <img src="/assets/image/global/arrow.svg" alt="arrow" />
            </div>
          </div>

          {mode === 'setting' && (
            <div className={styles.settingModeHeader}>
              <div
                className={`${styles.tab} ${drawer.settingActiveTab === 'sales' ? styles.active : ''}`}
                onClick={() => setDrawer(prev => ({ ...prev, settingActiveTab: 'sales' }))}
              >
                <div className={styles.tabText}>매출 조회</div>
              </div>
              <div
                className={`${styles.tab} ${drawer.settingActiveTab === 'layout' ? styles.active : ''}`}
                onClick={() => setDrawer(prev => ({ ...prev, settingActiveTab: 'layout' }))}
              >
                <div className={styles.tabText}>배치도 관리</div>
              </div>
            </div>
          )}

          {mode === 'menu' && (
            <div className={styles.menuModeHeader}>
              <div className={styles.searchSection}>
                  <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="메뉴명 또는 코드를 입력해주세요."
                      value={drawer.menuSearchTerm}
                      onChange={(e) => setDrawer(prev => ({ ...prev, menuSearchTerm: e.target.value }))}
                  />
                <div className={styles.searchButton}>
                  <div className={styles.buttonText}>검색</div>
                </div>
              </div>
              <div className={styles.categoryButton}>
                <div className={styles.buttonText}>분류 설정</div>
              </div>
              <div className={styles.registerButton} onClick={handleRegisterProduct}>
                <div className={styles.buttonText}>상품 등록</div>
              </div>
              <div
                className={`${styles.orderButton} ${drawer.isReorderMode ? styles.active : ''}`}
                onClick={() => setDrawer(prev => ({ ...prev, isReorderMode: !prev.isReorderMode }))}
              >
                <div className={styles.buttonText}>순서 변경</div>
              </div>
              <div className={styles.cancelReasonButton}>
                <div className={styles.buttonText}>취소사유 관리</div>
              </div>
              <div className={styles.deleteButton} onClick={onDelete}>
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