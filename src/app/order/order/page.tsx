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
import type { OrderTake } from '@/types';
import { useScrollToTop } from '@/hooks/common/useScrollManagement';
import { useToast } from '@/hooks/common/useToast';
import { useGoodsList, useCategoryList, usePostBillOrder } from '@/hooks/api';

const DEFAULT_ORDER_TAKE: OrderTake = 'N';

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
  const isManual = useMemo(() => searchParams.get('manual') === '1', [searchParams]);

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
      .sort((a, b) => a.goodsOrd - b.goodsOrd);
  }, [goodsList]);

  const tableInfo: TableInfo = useMemo(() => {
    const tableNumberParam = searchParams.get('tableNumber');
    const bookingNm = searchParams.get('bookingNm') || '';
    const bookingsNm = searchParams.get('bookingsNm') || '';
    const membersParam = searchParams.get('playerList');

    return {
      tableNumber: tableNumberParam || '-',
      bookingNm,
      bookingsNm,
      playerList: isManual ? [] : (membersParam ?? '').split(',').filter(Boolean),
    };
  }, [isManual, searchParams]);

  const billId = useMemo(() => {
    const billIdParam = searchParams.get('billId');
    if (!billIdParam) return null;
    const parsed = Number(billIdParam);
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const handleCategoryChange = useCallback((category: CategoryType) => {
    setActiveCategory(category);

    const container = menuGridRef.current;
    if (!container) return;

    if (category === '전체메뉴') {
      container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const categoryElement = document.getElementById(`category-${category}`);
    if (categoryElement) {
      const containerTop = container.getBoundingClientRect().top;
      const elementTop = categoryElement.getBoundingClientRect().top;
      const scrollOffset = elementTop - containerTop + container.scrollTop - 30;

      container.scrollTo({ top: scrollOffset, behavior: 'smooth' });
    }
  }, []);

  const handlePayerSelect = useCallback((payerName: string) => {
    setSelectedPayer(payerName);
  }, []);

  const handleMenuClick = useCallback((item: MenuItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((orderItem) => orderItem.goodsId === item.goodsId);

      if (existingItem) {
        return prev.map((orderItem) =>
          orderItem.goodsId === item.goodsId
            ? { ...orderItem, orderCnt: orderItem.orderCnt + 1 }
            : orderItem
        );
      }

      return [
        ...prev,
        {
          goods: item,
          goodsId: item.goodsId,
          orderCnt: 1,
          orderAmt: item.goodsAmt,
          orderOrd: 0,
          orderTake: DEFAULT_ORDER_TAKE,
        },
      ];
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

    const billIdValue = billId ?? undefined;
    const payerName = selectedPayer || tableInfo.bookingsNm || '-';
    const orderAmt = orderItems.reduce(
      (sum, item) => sum + item.orderAmt * item.orderCnt,
      0
    );
    const orderHisList = orderItems.map((item, index) => ({
      goodsId: item.goodsId,
      orderOrd: index + 1,
      orderCnt: item.orderCnt,
      orderAmt: item.orderAmt,
      orderTake: item.orderTake,
    }));

    postBillOrder(
      {
        billId: billIdValue,
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
  }, [orderItems, selectedPayer, showToast, postBillOrder, tableInfo.bookingsNm, memoText, billId]);

  const handleDetailClick = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);

  const handleQuantityChange = useCallback((itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems((prev) => prev.filter((item) => item.goodsId !== itemId));
    } else {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.goodsId === itemId
            ? { ...item, orderCnt: newQuantity }
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
          hidePayerSection={isManual}
          hideMemberNames={isManual}
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
        billId={billId}
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
