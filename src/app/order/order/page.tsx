'use client';

import React, { useState, useCallback, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/pages/OrderPage.module.scss';
import CategoryTabs from '@/components/order/order/CategoryTabs';
import MenuGrid from '@/components/order/order/MenuGrid';
import OrderSidebar from '@/components/order/order/OrderSidebar';
import MemoModal from '@/components/order/modal/MemoModal';
import OrderDetailModal from '@/components/order/modal/OrderDetailModal';
import { CategoryType, MenuItem, OrderItem, TableInfo } from '@/types';
import { useScrollToTop } from '@/hooks/common/useScrollManagement';
import { useToast } from '@/hooks/common/useToast';
import { useGoodsList, useCategoryList, usePostBillOrder } from '@/hooks/api';

const OrderPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('전체메뉴');
  const [selectedPayer, setSelectedPayer] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [memoText, setMemoText] = useState('');
  const menuGridRef = useRef<HTMLDivElement>(null);
  const { mutate: postBillOrder } = usePostBillOrder();

  const { data: goodsList = [], isLoading: isGoodsLoading } = useGoodsList();
  const { data: categoryList = [], isLoading: isCategoryLoading } = useCategoryList('CATEGORY');

  useScrollToTop();

  const categories = useMemo<CategoryType[]>(() => {
    const apiCategories = categoryList
      .sort((a, b) => a.categoryOrd - b.categoryOrd)
      .map(cat => cat.categoryNm);
    return ['전체메뉴', ...apiCategories];
  }, [categoryList]);

  const menuItems = useMemo<MenuItem[]>(() => {
    return goodsList
      .filter(goods => goods.goodsSt !== 'N')
      .sort((a, b) => a.goodsOrd - b.goodsOrd)
      .map(goods => ({
        id: String(goods.goodsId),
        name: goods.goodsNm,
        price: goods.goodsAmt,
        imageUrl: goods.goodsImg || '/assets/image/order/fallback.svg',
        category: goods.categoryNm,
        goodsSt: goods.goodsSt,
      }));
  }, [goodsList]);

  const tableInfo: TableInfo = useMemo(() => {
    const tableNumberParam = searchParams.get('tableNumber');
    const groupName = searchParams.get('groupName') || '';
    const membersParam = searchParams.get('members');
    const isManual = searchParams.get('manual') === '1';

    const numericTableNumber = tableNumberParam
      ? Number(tableNumberParam.replace('T', ''))
      : 0;

    return {
      tableNumber: Number.isFinite(numericTableNumber) ? numericTableNumber : 0,
      groupName,
      memberNames: isManual ? [] : (membersParam ?? '').split(',').filter(Boolean),
    };
  }, [searchParams]);

  const handleCategoryChange = useCallback((category: CategoryType) => {
    setActiveCategory(category);

    if (category === '전체메뉴') {
      if (menuGridRef.current) {
        menuGridRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const categoryElement = document.getElementById(`category-${category}`);
      if (categoryElement && menuGridRef.current) {
        const containerTop = menuGridRef.current.getBoundingClientRect().top;
        const elementTop = categoryElement.getBoundingClientRect().top;
        const scrollOffset = elementTop - containerTop + menuGridRef.current.scrollTop - 30;

        menuGridRef.current.scrollTo({ top: scrollOffset, behavior: 'smooth' });
      }
    }
  }, []);

  const handlePayerSelect = useCallback((payerName: string) => {
    setSelectedPayer(payerName);
  }, []);

  const handleMenuClick = useCallback((item: MenuItem) => {
      setOrderItems((prev) => {
        const existingItem = prev.find((orderItem) => orderItem.menuItem.id === item.id);

        if (existingItem) {
          return prev.map((orderItem) =>
            orderItem.menuItem.id === item.id
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          );
        } else {
          return [...prev, { menuItem: item, quantity: 1 }];
        }
      });
  }, []);

  const handleMemoClick = useCallback(() => {
    setIsMemoModalOpen(true);
  }, []);

  const handleMemoSave = useCallback((memo: string) => {
    setMemoText(memo);
  }, []);

  const handleOrderClick = useCallback(() => {
    if (orderItems.length === 0) {
      showToast('주문할 메뉴가 없습니다.', 'error');
      return;
    }

    const billIdParam = searchParams.get('billId');
    const billId = billIdParam ? Number(billIdParam) : undefined;
    const payerName = selectedPayer || tableInfo.groupName || '-';
    const orderAmt = orderItems.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    const orderHisList = orderItems
      .map((item, index) => {
        const goodsId = Number(item.menuItem.id);
        if (!Number.isFinite(goodsId)) return null;
        return {
          goodsId,
          orderOrd: index + 1,
          orderCnt: item.quantity,
          orderAmt: item.menuItem.price,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    postBillOrder(
      {
        billId: Number.isFinite(billId) ? billId : undefined,
        playerNm: payerName,
        playerErp: payerName,
        orderAmt,
        orderReq: memoText || undefined,
        orderHisList,
      },
      {
        onSuccess: () => {
          showToast(`결제자: ${payerName} - 주문이 완료되었습니다!`, 'success');
          setOrderItems([]);
        },
      }
    );
  }, [orderItems, selectedPayer, showToast, postBillOrder, searchParams, tableInfo.groupName, memoText]);

  const handleDetailClick = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);

  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems((prev) => prev.filter((item) => item.menuItem.id !== itemId));
    } else {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.menuItem.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  }, []);

  const handleBackClick = useCallback(() => {
    router.push('/order/main');
  }, [router]);

  const isLoading = isGoodsLoading || isCategoryLoading;

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <p>메뉴를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={handleBackClick} style={{ cursor: 'pointer' }}>
          <img src='/assets/image/global/arrow/arrow-back.svg' alt={'뒤로가기'}/>
        </div>
        <div className={styles.menuSection}>
          <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
          />
        </div>
      </header>

      <div className={styles.mainContent}>
        <MenuGrid
          items={menuItems}
          categories={categories}
          onMenuClick={handleMenuClick}
          ref={menuGridRef}
        />
        <OrderSidebar
          tableInfo={tableInfo}
          orderItems={orderItems}
          selectedPayer={selectedPayer}
          onPayerSelect={handlePayerSelect}
          onMemoClick={handleMemoClick}
          onOrderClick={handleOrderClick}
          onDetailClick={handleDetailClick}
          onQuantityChange={handleQuantityChange}
          hidePayerSection={searchParams.get('manual') === '1'}
          hideMemberNames={searchParams.get('manual') === '1'}
        />
      </div>

      <MemoModal
        isOpen={isMemoModalOpen}
        onClose={() => setIsMemoModalOpen(false)}
        onSave={handleMemoSave}
      />

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        orderItems={orderItems}
        onQuantityChange={handleQuantityChange}
      />
    </div>
  );
};

const OrderPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPageContent />
    </Suspense>
  );
};

export default OrderPage;
