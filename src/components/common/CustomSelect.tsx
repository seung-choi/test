'use client';

import React, { useState, useRef } from 'react';
import styles from '@/styles/components/common/CustomSelect.module.scss';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import type { CustomSelectProps } from '@/types';

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '선택해주세요',
  className,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside(selectRef, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.customSelect} ${className || ''}`} style={style} ref={selectRef}>
      <div className={styles.selectTrigger} onClick={() => setIsOpen(!isOpen)}>
        <span className={value ? styles.selectedText : styles.placeholder}>
          {selectedOption?.label || placeholder}
        </span>
        <img
          src="/assets/image/global/arrow/arrow.svg"
          alt="arrow"
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
