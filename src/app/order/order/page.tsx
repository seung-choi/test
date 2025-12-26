'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import styles from '@/styles/pages/OrderPage.module.scss';
import CategoryTabs from '@/components/order/CategoryTabs';
import MenuGrid from '@/components/order/MenuGrid';
import OrderSidebar from '@/components/order/OrderSidebar';
import { CategoryType, MenuItem, OrderItem, TableInfo } from '@/types/order/order.type';
import { mockMenuItems } from '@/data/mockMenuData';
import { useScrollToTop } from '@/hooks/common/useScrollManagement';

const OrderPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('전체메뉴');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { menuItem: mockMenuItems.find(item => item.id === 'meal-2')!, quantity: 2 }, // 치즈돈까스 2개
    { menuItem: mockMenuItems.find(item => item.id === 'drink-3')!, quantity: 3 }, // 카스 3개
    { menuItem: mockMenuItems.find(item => item.id === 'drink-1')!, quantity: 2 }, // 참이슬 2개
    { menuItem: mockMenuItems.find(item => item.id === 'snack-1')!, quantity: 1 }, // 치킨 1개
    { menuItem: mockMenuItems.find(item => item.id === 'snack-3')!, quantity: 1 }, // 감자튀김 1개
    { menuItem: mockMenuItems.find(item => item.id === 'side-4')!, quantity: 1 }, // 떡볶이 1개
  ]);
  const menuGridRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 시 스크롤 최상단으로 이동
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
    // 카테고리 변경 시 메뉴 그리드 스크롤 최상단으로
    if (menuGridRef.current) {
      menuGridRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    console.log('메모 버튼 클릭');
    // TODO: 메모 모달 열기
  }, []);

  const handleOrderClick = useCallback(() => {
    console.log('주문하기:', orderItems);
    // TODO: 주문 API 호출
    alert('주문이 완료되었습니다!');
    setOrderItems([]);
  }, [orderItems]);

  const handleDetailClick = useCallback(() => {
    console.log('상세 내역 클릭');
    // TODO: 상세 내역 페이지로 이동
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
          onMemoClick={handleMemoClick}
          onOrderClick={handleOrderClick}
          onDetailClick={handleDetailClick}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </div>
  );
};

export default OrderPage;
