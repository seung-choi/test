import React from 'react';
import styles from '@/styles/components/common/Table.module.scss';

export interface TableRowData {
  id: string;
  name?: string;
  [key: string]: any;
}

export const renderCheckbox = (
  selectedItems: string[],
  onItemSelect?: (itemId: string, checked: boolean) => void
) => (value: any, row: TableRowData) => {
  const isChecked = selectedItems.includes(row.id);
  return (
    <div
      className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}
      onClick={() => onItemSelect?.(row.id, !isChecked)}
    />
  );
};

export const renderImage = (value: string, row: TableRowData) => (
  <img
    src={value}
    alt={row.name || '이미지'}
    className={styles.menuImage}
  />
);

export const renderTags = (value: string[]) => {
  const getTagClass = (tag: string) => {
    switch (tag) {
      case 'NEW':
        return styles.new;
      case '시그니처':
        return styles.signature;
      default:
        return '';
    }
  };

  return (
    <div className={styles.tagsContainer}>
      {value?.map((tag, index) => (
        <div key={index} className={`${styles.tag} ${getTagClass(tag)}`}>
          <span className={styles.tagText}>{tag}</span>
        </div>
      ))}
    </div>
  );
};

export const renderStatusSelector = (
  onStatusChange?: (itemId: string, status: string) => void
) => (value: string, row: TableRowData) => (
  <button
    className={styles.statusSelector}
    onClick={() => onStatusChange?.(row.id, value)}
  >
    <span className={styles.statusText}>{value}</span>
    <img src="/assets/image/global/arrow.svg" alt="arrow" />
  </button>
);

export const renderChannelTags = (value: string[]) => (
  <div className={styles.channelTags}>
    {value?.map((item, index) => (
      <span key={index} className={styles.channelTag}>{item}</span>
    ))}
  </div>
);

export const renderEditButton = (
  onEdit?: (itemId: string) => void
) => (value: any, row: TableRowData) => (
  <button className={styles.editButton} onClick={() => onEdit?.(row.id)}>
    <img src="/assets/image/global/edit.svg" alt="edit" />
  </button>
);

export const renderPrice = (value: string | number) => (
  <span className={styles.cellText}>
    {typeof value === 'number' ? value.toLocaleString() : value}
  </span>
);

export const renderText = (value: any) => (
  <span className={styles.cellText}>{value}</span>
);
