'use client';

import React, { useState, useCallback, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/pages/OrderPage.module.scss';
import CategoryTabs from '@/components/order/order/CategoryTabs';
import MenuGrid from '@/components/order/order/MenuGrid';
import OrderSidebar from '@/components/order/order/OrderSidebar';
import MemoModal from '@/components/order/modal/MemoModal';
import OrderDetailModal from '@/components/order/modal/OrderDetailModal';
import { CategoryType, MenuItem, OrderItem, TableInfo, MenuOption } from '@/types';
import { mockMenuItems, categories } from '@/data/mockMenuData';
import { mockTableInfo, mockOrderItems } from '@/data/mockOrderData';
import { useScrollToTop } from '@/hooks/common/useScrollManagement';

const OrderPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('전체메뉴');
  const [selectedPayer, setSelectedPayer] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>(mockOrderItems);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const menuGridRef = useRef<HTMLDivElement>(null);

  useScrollToTop();

  const tableInfo: TableInfo = useMemo(() => {
    const tableNumber = searchParams.get('tableNumber');
    const groupName = searchParams.get('groupName');
    const membersParam = searchParams.get('members');

    if (tableNumber && groupName && membersParam) {
      return {
        tableNumber: parseInt(tableNumber.replace('T', '')) || mockTableInfo.tableNumber,
        groupName: groupName,
        memberNames: membersParam.split(',').filter(Boolean),
      };
    }

    return mockTableInfo;
  }, [searchParams]);

  const handleCategoryChange = useCallback((category: CategoryType) => {
    setActiveCategory(category);

    if (category === '전체메뉴' || category === categories[1]) {
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
    // TODO: 메모 저장 API 호출
  }, []);

  const handleOrderClick = useCallback(() => {
    // TODO: 주문 API 호출
    alert(`결제자: ${selectedPayer || '미선택'}\n주문이 완료되었습니다!`);
    setOrderItems([]);
  }, [orderItems, selectedPayer]);

  const handleDetailClick = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);

  const handleOrderModify = useCallback(() => {
    // TODO: 주문 수정 로직
    setIsDetailModalOpen(false);
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
        <MenuGrid items={mockMenuItems} onMenuClick={handleMenuClick} ref={menuGridRef} />
        <OrderSidebar
          tableInfo={tableInfo}
          orderItems={orderItems}
          selectedPayer={selectedPayer}
          onPayerSelect={handlePayerSelect}
          onMemoClick={handleMemoClick}
          onOrderClick={handleOrderClick}
          onDetailClick={handleDetailClick}
          onQuantityChange={handleQuantityChange}
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
        onOrderModify={handleOrderModify}
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