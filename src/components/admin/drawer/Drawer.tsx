import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styles from '@/styles/components/admin/drawer/Drawer.module.scss';
import { drawerState } from '@/lib/recoil';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { Category, ProductFormData, CancelReason } from '@/types/admin/modal.type';
import { ErpProduct } from '@/types/erp.type';
import { useScrollLock } from '@/hooks/common/useScrollManagement';

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
  const { openCreateProductModal, openCategoryModal, openErpSearchModal, openCancelReasonManagementModal } = useUnifiedModal();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useScrollLock(isVisible);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  const handleRegisterProduct = () => {
    openErpSearchModal(
      (erpProduct: ErpProduct) => {
        const initialData: ProductFormData = {
          status: '판매',
          channels: [],
          types: [],
          category: erpProduct.category,
          store: '스타트 하우스',
          code: erpProduct.code,
          name: erpProduct.name,
          price: erpProduct.price.toLocaleString('ko-KR') + '원',
          cookingTime: 0,
          tags: [],
          registeredDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
          updatedDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        };

        openCreateProductModal(
          (data) => {
            console.log('상품 등록:', data);
          },
          initialData,
          () => {
            console.log('상품 등록 취소');
          }
        );
      },
      () => {
        console.log('ERP 검색 취소');
      }
    );
  };

  const handleCategorySettings = () => {
    // TODO: 실제 분류 데이터를 가져와야 함
    const initialCategories: Category[] = [
      { id: '1', name: '분식', order: 0 },
      { id: '2', name: '주류', order: 1 },
      { id: '3', name: '양식', order: 2 },
      { id: '4', name: '한식', order: 3 },
    ];

    openCategoryModal(
      initialCategories,
      (categories) => {
        console.log('분류 저장:', categories);
      },
      () => {
        console.log('분류 설정 취소');
      }
    );
  };

  const handleCancelReasonManagement = () => {
    // TODO: 실제 취소 사유 데이터를 가져와야 함
    const initialReasons: CancelReason[] = [
      { id: '1', content: '매진', order: 0 },
      { id: '2', content: '품절', order: 1 },
      { id: '3', content: '고객요청', order: 2 },
      { id: '4', content: '재료 소진', order: 3 },
      { id: '5', content: '판매지', order: 4 },
      { id: '6', content: '주문 대기 시간 초과', order: 5 },
      { id: '7', content: '경기팀 요청', order: 6 },
      { id: '8', content: '기상이변', order: 7 },
      { id: '9', content: '기타', order: 8 },
    ];

    openCancelReasonManagementModal(
      initialReasons,
      (reasons) => {
        console.log('취소 사유 저장:', reasons);
        // 여기서 실제 취소 사유 저장 API 호출
      },
      () => {
        console.log('취소 사유 관리 취소');
      }
    );
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.drawerOverlay} ${hasBackgroundImage ? styles.backgroundImage : ''} ${isClosing ? styles.closing : ''}`}
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
              <img className={styles.arrow} src="/assets/image/global/arrow/arrow.svg" alt="arrow" />
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
              <div className={styles.categoryButton} onClick={handleCategorySettings}>
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
              <div className={styles.cancelReasonButton} onClick={handleCancelReasonManagement}>
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