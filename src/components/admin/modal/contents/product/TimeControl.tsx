import React from 'react';
import styles from '@/styles/components/admin/modal/ProductModal.module.scss';

interface TimeControlProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

const TimeControl: React.FC<TimeControlProps> = ({ value, onChange, step = 10 }) => {
  const handleIncrease = () => {
    onChange(value + step);
  };

  const handleDecrease = () => {
    if (value > 0) {
      onChange(Math.max(0, value - step));
    }
  };

  return (
    <div className={styles.timeControl}>
      <button
        className={`${styles.timeButton} ${value === 0 ? styles.disabled : ''}`}
        onClick={handleDecrease}
        disabled={value === 0}
      >
        <img src="/assets/image/global/plusminus/minus.svg" alt="minus" />
      </button>
      <div className={styles.timeValue}>{value}</div>
      <button className={styles.timeButton} onClick={handleIncrease}>
        <img src="/assets/image/global/plusminus/plus.svg" alt="plus" />
      </button>
    </div>
  );
};

export default TimeControl;
