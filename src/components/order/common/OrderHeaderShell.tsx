import React from 'react';
import styles from '@/styles/components/order/common/orderHeaderShell.module.scss';
import type { OrderHeaderShellProps } from '@/types';

const OrderHeaderShell: React.FC<OrderHeaderShellProps> = ({
  variant = 'main',
  left,
  center,
  right,
}) => {
  return (
    <div className={`${styles.header} ${styles[variant]}`}>
      <div className={styles.left}>{left}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
};

export default OrderHeaderShell;
