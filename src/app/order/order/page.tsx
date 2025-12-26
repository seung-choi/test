'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import styles from '@/styles/pages/OrderPage.module.scss';
import CategoryTabs from '@/components/order/order/CategoryTabs';
import MenuGrid from '@/components/order/order/MenuGrid';
import OrderSidebar from '@/components/order/order/OrderSidebar';
import MemoModal from '@/components/order/modal/MemoModal';
import OrderDetailModal from '@/components/order/modal/OrderDetailModal';
// import MenuOptionModal from '@/components/order/modal/MenuOptionModal'; // 옵션 모달 보류
import { CategoryType, MenuItem, OrderItem, TableInfo, MenuOption } from '@/types/order/order.type';
import { mockMenuItems } from '@/data/mockMenuData';
import { useScrollToTop } from '@/hooks/common/useScrollManagement';

const OrderPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('전체메뉴');
  const [selectedPayer, setSelectedPayer] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { menuItem: mockMenuItems.find(item => item.id === 'meal-2')!, quantity: 2 },
    { menuItem: mockMenuItems.find(item => item.id === 'drink-3')!, quantity: 3 },
    { menuItem: mockMenuItems.find(item => item.id === 'drink-1')!, quantity: 2 },
    { menuItem: mockMenuItems.find(item => item.id === 'snack-1')!, quantity: 1 },
    { menuItem: mockMenuItems.find(item => item.id === 'snack-3')!, quantity: 1 },
    { menuItem: mockMenuItems.find(item => item.id === 'side-4')!, quantity: 1 },
  ]);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // const [isOptionModalOpen, setIsOptionModalOpen] = useState(false); // 옵션 모달 보류
  // const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null); // 옵션 모달 보류
  const menuGridRef = useRef<HTMLDivElement>(null);

  useScrollToTop();

  const categories: CategoryType[] = ['전체메뉴', '식사', '주류', '안주', '사이드'];

  const tableInfo: TableInfo = {
    tableNumber: 5,
    groupName: '개발팀 회식',
    memberNames: ['홍길동', '김철수', '이영희', '박민수'],
  };

  const filteredMenuItems = useMemo(() => {
    if (activeCategory === '전체메뉴') {
      return mockMenuItems;
    }
    return mockMenuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = useCallback((category: CategoryType) => {
    setActiveCategory(category);
    if (menuGridRef.current) {
      menuGridRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handlePayerSelect = useCallback((payerName: string) => {
    setSelectedPayer(payerName);
    console.log('선택된 결제자:', payerName);
  }, []);

  const handleMenuClick = useCallback((item: MenuItem) => {
    // 옵션 기능 보류
    // if (item.options && item.options.length > 0) {
    //   setSelectedMenuItem(item);
    //   setIsOptionModalOpen(true);
    // } else {
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
    // }
  }, []);

  // 옵션 모달 보류
  // const handleAddToOrder = useCallback((menuItem: MenuItem, selectedOptions: { option: MenuOption; quantity: number }[]) => {
  //   setOrderItems((prev) => {
  //     const existingItem = prev.find((orderItem) => orderItem.menuItem.id === menuItem.id);

  //     if (existingItem) {
  //       return prev.map((orderItem) =>
  //         orderItem.menuItem.id === menuItem.id
  //           ? {
  //               ...orderItem,
  //               quantity: orderItem.quantity + 1,
  //               selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined
  //             }
  //           : orderItem
  //       );
  //     } else {
  //       return [...prev, {
  //         menuItem,
  //         quantity: 1,
  //         selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined
  //       }];
  //     }
  //   });
  // }, []);

  const handleMemoClick = useCallback(() => {
    setIsMemoModalOpen(true);
  }, []);

  const handleMemoSave = useCallback((memo: string) => {
    console.log('메모 저장:', memo);
    // TODO: 메모 저장 API 호출
  }, []);

  const handleOrderClick = useCallback(() => {
    console.log('주문하기:', orderItems);
    console.log('선택된 결제자:', selectedPayer);
    // TODO: 주문 API 호출
    alert(`결제자: ${selectedPayer || '미선택'}\n주문이 완료되었습니다!`);
    setOrderItems([]);
  }, [orderItems, selectedPayer]);

  const handleDetailClick = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);

  const handleOrderModify = useCallback(() => {
    console.log('주문 수정');
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

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
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
        <MenuGrid items={filteredMenuItems} onMenuClick={handleMenuClick} ref={menuGridRef} />
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

      {/* 옵션 모달 보류 */}
      {/* <MenuOptionModal
        isOpen={isOptionModalOpen}
        onClose={() => {
          setIsOptionModalOpen(false);
          setSelectedMenuItem(null);
        }}
        menuItem={selectedMenuItem}
        onAddToOrder={handleAddToOrder}
      /> */}
    </div>
  );
};

export default OrderPage;