'use client';

import React from 'react';
import styles from '@/styles/components/order/order/MenuCard.module.scss';
import { MenuItem } from '@/types/order/order.type';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  const handleClick = () => {
    onSelect(item);
  };

  return (
    <div className={styles.menuCard} onClick={handleClick}>
      <div className={styles.imageWrapper}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className={styles.menuImage}
        />
        <div className={styles.gradientOverlay} />
      </div>
      <div className={styles.menuInfo}>
        <div className={styles.menuName}>{item.name}</div>
        <div className={styles.menuPrice}>
          ₩{item.price.toLocaleString('ko-KR')}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
