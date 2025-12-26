'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import styles from '@/styles/pages/OrderPage.module.scss';
import CategoryTabs from '@/components/order/order/CategoryTabs';
import MenuGrid from '@/components/order/order/MenuGrid';
import OrderSidebar from '@/components/order/order/OrderSidebar';
import MemoModal from '@/components/order/modal/MemoModal';
import OrderDetailModal from '@/components/order/modal/OrderDetailModal';
import MenuOptionModal from '@/components/order/modal/MenuOptionModal';
import { CategoryType, MenuItem, OrderItem, TableInfo, MenuOption } from '@/types/order/order.type';
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
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
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
    // 옵션이 있는 메뉴면 옵션 선택 모달 열기
    if (item.options && item.options.length > 0) {
      setSelectedMenuItem(item);
      setIsOptionModalOpen(true);
    } else {
      // 옵션이 없는 메뉴는 바로 주문 목록에 추가
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
    }
  }, []);

  const handleAddToOrder = useCallback((menuItem: MenuItem, selectedOptions: { option: MenuOption; quantity: number }[]) => {
    setOrderItems((prev) => {
      // 기존에 동일한 메뉴가 있는지 확인
      const existingItem = prev.find((orderItem) => orderItem.menuItem.id === menuItem.id);

      if (existingItem) {
        return prev.map((orderItem) =>
          orderItem.menuItem.id === menuItem.id
            ? {
                ...orderItem,
                quantity: orderItem.quantity + 1,
                selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined
              }
            : orderItem
        );
      } else {
        return [...prev, {
          menuItem,
          quantity: 1,
          selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined
        }];
      }
    });
  }, []);

  const handleMemoClick = useCallback(() => {
    setIsMemoModalOpen(true);
  }, []);

  const handleMemoSave = useCallback((memo: string) => {
    console.log('메모 저장:', memo);
    // TODO: 메모 저장 API 호출
  }, []);

  const handleOrderClick = useCallback(() => {
    console.log('주문하기:', orderItems);
    // TODO: 주문 API 호출
    alert('주문이 완료되었습니다!');
    setOrderItems([]);
  }, [orderItems]);

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

      <MenuOptionModal
        isOpen={isOptionModalOpen}
        onClose={() => {
          setIsOptionModalOpen(false);
          setSelectedMenuItem(null);
        }}
        menuItem={selectedMenuItem}
        onAddToOrder={handleAddToOrder}
      />
    </div>
  );
};

export default OrderPage;
