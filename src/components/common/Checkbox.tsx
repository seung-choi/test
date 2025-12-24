'use client';

import React from 'react';
import styles from '@/styles/components/admin/common/Checkbox.module.scss';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <div className={`${styles.checkboxContainer} ${className}`}>
      <div
        className={`${styles.checkboxWrapper} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}
        onClick={!disabled ? onChange : undefined}
        onKeyDown={handleKeyDown}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <div className={styles.checkboxIcon}>
          {checked ?
              <img src="/assets/image/global/checkbox/checked.svg" alt="checked" /> :
              <img src="/assets/image/global/checkbox/unchecked.svg" alt="unchecked" />
          }
        </div>
      </div>
      {label && (
        <label
          className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''}`}
          onClick={!disabled ? onChange : undefined}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
