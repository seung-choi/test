import React, { useRef, useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styles from '@/styles/components/admin/drawer/Drawer.module.scss';
import { drawerState } from '@/lib/recoil';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { ProductFormData, ErpProduct } from '@/types';
import { useScrollLock } from '@/hooks/common/useScrollManagement';
import { usePutGoodsErpList } from '@/hooks/api';

type DrawerMode = 'setting' | 'menu';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  hasBackgroundImage?: boolean;
  mode?: DrawerMode;
  onDelete?: () => void;
  onReorderCommit?: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         hasBackgroundImage = true,
                                         mode,
                                         onDelete,
                                         onReorderCommit
                                       }) => {
  const [drawer, setDrawer] = useRecoilState(drawerState);
  const { openCreateProductModal, openCategoryModal, openErpSearchModal, openCancelReasonManagementModal } = useUnifiedModal();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { mutateAsync: updateErpGoods, isPending: isUpdatingErp } = usePutGoodsErpList();
  const [erpToast, setErpToast] = useState<{ type: 'success' | 'empty'; count: number } | null>(null);
  const erpToastTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (erpToastTimerRef.current) {
        window.clearTimeout(erpToastTimerRef.current);
      }
    };
  }, []);

  const handleERPUpdate = async () => {
    if (isUpdatingErp) return;
    const data = await updateErpGoods();
    const count = Array.isArray(data) ? data.length : 0;

    if (erpToastTimerRef.current) {
      window.clearTimeout(erpToastTimerRef.current);
    }

    setErpToast({ type: count > 0 ? 'success' : 'empty', count });
    erpToastTimerRef.current = window.setTimeout(() => {
      setErpToast(null);
    }, 2500);
  };

  const handleRegisterProduct = () => {
    openErpSearchModal(
      (erpProduct: ErpProduct) => {
        const initialData: ProductFormData = {
          goodsSt: 'Y',
          goodsCh: 'BOTH',
          goodsOp: 'BOTH',
          categoryId: 0,
          categoryNm: '미분류',
          goodsNm: erpProduct.goodsNm,
          goodsAmt: Number(erpProduct.goodsAmt),
          goodsCnt: erpProduct.goodsCnt || '1',
          goodsTm: 0,
          goodsTag: '',
          goodsErp: erpProduct.goodsErp,
          createdDt: new Date().toISOString(),
          modifiedDt: new Date().toISOString(),
        };

        openCreateProductModal(undefined, initialData);
      },
      () => {}
    );
  };

  const handleCategorySettings = () => {
    openCategoryModal(() => {});
  };

  const handleCancelReasonManagement = () => {
    openCancelReasonManagementModal(
      [],
      (reasons) => {},
      () => {}
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
              <div className={styles.categoryButton} onClick={handleERPUpdate}>
                <div className={styles.buttonText}>ERP 업데이트</div>
              </div>
              <div className={styles.categoryButton} onClick={handleCategorySettings}>
                <div className={styles.buttonText}>분류 설정</div>
              </div>
              <div className={styles.registerButton} onClick={handleRegisterProduct}>
                <div className={styles.buttonText}>상품 등록</div>
              </div>
              <div
                className={`${styles.orderButton} ${drawer.isReorderMode ? styles.active : ''}`}
                onClick={() => {
                  if (drawer.isReorderMode) {
                    onReorderCommit?.();
                  }
                  setDrawer(prev => ({ ...prev, isReorderMode: !prev.isReorderMode }));
                }}
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
          <img src="/assets/image/global/x/x.svg" alt="닫기" />
        </button>

        <div className={styles.drawerContent}>
          {children}
        </div>
      </div>
      {erpToast && (
        <div className={styles.erpToast}>
          <div
            className={`${styles.erpToastContent} ${
              erpToast.type === 'success' ? styles.erpToastSuccess : styles.erpToastEmpty
            }`}
          >
            <div className={styles.erpToastText}>
              {erpToast.type === 'success'
                ? `${erpToast.count}개의 등록된 상품 정보를 업데이트 하였습니다.`
                : '업데이트 된 ERP 정보가 없습니다.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drawer;
