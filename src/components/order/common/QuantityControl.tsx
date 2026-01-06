'use client';

import React from 'react';
import styles from '@/styles/components/order/common/QuantityControl.module.scss';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  minQuantity?: number;
  className?: string;
  variant?: 'default' | 'modal' | 'sidebar';
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
  minQuantity = 1,
  className = '',
  variant = 'default',
}) => {
  const isDecreaseDisabled = disabled || quantity <= minQuantity;

  return (
    <div className={`${styles.quantityControl} ${styles[variant]} ${className}`}>
      <button
        className={styles.decreaseButton}
        onClick={onDecrease}
        disabled={isDecreaseDisabled}
      >
        -
      </button>
      <div className={styles.quantityDisplay}>{quantity}</div>
      <button
        className={styles.increaseButton}
        onClick={onIncrease}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
