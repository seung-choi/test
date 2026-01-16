'use client';

import React, { useState } from 'react';
import BaseModal from './BaseModal';
import styles from '@/styles/components/order/modal/MenuOptionModal.module.scss';
import { MenuItem, MenuOption } from '@/types';
import QuantityControl from '@/components/order/common/QuantityControl';
import type { MenuOptionModalProps } from '@/types';

const MenuOptionModal: React.FC<MenuOptionModalProps> = ({
  isOpen,
  onClose,
  menuItem,
  onAddToOrder,
}) => {
  const [optionQuantities, setOptionQuantities] = useState<Record<string, number>>({});

  if (!menuItem) return null;

  const handleQuantityChange = (optionId: string, delta: number) => {
    setOptionQuantities((prev) => {
      const currentQty = prev[optionId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [optionId]: newQty };
    });
  };

  const handleAddToOrder = () => {
    const selectedOptions = menuItem.options
      ?.filter((option) => (optionQuantities[option.id] || 0) > 0)
      .map((option) => ({
        option,
        quantity: optionQuantities[option.id],
      })) || [];

    onAddToOrder(menuItem, selectedOptions);
    setOptionQuantities({});
    onClose();
  };

  const totalOptionsCount = Object.values(optionQuantities).reduce((sum, qty) => sum + qty, 0);
  const totalOptionsPrice = menuItem.options?.reduce((sum, option) => {
    const qty = optionQuantities[option.id] || 0;
    return sum + (option.price * qty);
  }, 0) || 0;

  const footer = (
    <div className={styles.footer}>
      <button className={styles.addButton} onClick={handleAddToOrder}>
        주문에 추가
      </button>
      <div className={styles.totalInfo}>
        {totalOptionsCount > 0 && (
          <>
            <span className={styles.optionCount}>옵션 {totalOptionsCount}개</span>
            <span className={styles.optionPrice}>
              {totalOptionsPrice.toLocaleString('ko-KR')} 원
            </span>
          </>
        )}
      </div>
    </div>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={menuItem.name} footer={footer}>
      <div className={styles.optionContent}>
        <div className={styles.topGradient} />
        <div className={styles.optionsGrid}>
          {menuItem.options?.map((option) => {
            const quantity = optionQuantities[option.id] || 0;
            return (
              <div key={option.id} className={styles.optionCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={option.imageUrl}
                    alt={option.name}
                    className={styles.optionImage}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/image/order/fallback.svg';
                    }}
                  />
                  <div className={styles.gradientOverlay} />
                </div>
                <div className={styles.optionInfo}>
                  <div className={styles.optionName}>{option.name}</div>
                  <div className={styles.optionOrderInfo}>
                    <div className={styles.optionPrice}>
                      ₩{option.price.toLocaleString('ko-KR')}
                    </div>
                    <QuantityControl
                      quantity={quantity}
                      onIncrease={() => handleQuantityChange(option.id, 1)}
                      onDecrease={() => handleQuantityChange(option.id, -1)}
                      minQuantity={0}
                      variant="modal"
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.bottomGradient} />
      </div>
    </BaseModal>
  );
};

export default MenuOptionModal;
