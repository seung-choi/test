import React from 'react';
import styles from '@/styles/components/common/Table.module.scss';

/**
 * 통합 테이블 렌더러 유틸리티
 * Menu Management 및 Settings 페이지에서 공통으로 사용
 */

// 통합 데이터 타입
export interface TableRowData {
  id: string;
  name?: string;
  [key: string]: any;
}

/**
 * 체크박스 렌더러
 */
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

/**
 * 이미지 렌더러
 */
export const renderImage = (value: string, row: TableRowData) => (
  <img
    src={value}
    alt={row.name || '이미지'}
    className={styles.menuImage}
  />
);

/**
 * 태그 렌더러
 */
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

/**
 * 상태 선택기 렌더러
 */
export const renderStatusSelector = (
  onStatusChange?: (itemId: string, status: string) => void
) => (value: string, row: TableRowData) => (
  <button
    className={styles.statusSelector}
    onClick={() => onStatusChange?.(row.id, value)}
  >
    <span className={styles.statusText}>{value}</span>
    <div className={styles.dropdownArrow} />
  </button>
);

/**
 * 채널/유형 태그 렌더러
 */
export const renderChannelTags = (value: string[]) => (
  <div className={styles.channelTags}>
    {value?.map((item, index) => (
      <span key={index} className={styles.channelTag}>{item}</span>
    ))}
  </div>
);

/**
 * 수정 버튼 렌더러
 */
export const renderEditButton = (
  onEdit?: (itemId: string) => void
) => (value: any, row: TableRowData) => (
  <button className={styles.editButton} onClick={() => onEdit?.(row.id)}>
    <img src="/assets/image/global/edit.svg" alt="edit" />
  </button>
);

/**
 * 가격 포맷 렌더러
 */
export const renderPrice = (value: string | number) => (
  <span className={styles.cellText}>
    {typeof value === 'number' ? value.toLocaleString() : value}
  </span>
);

/**
 * 기본 텍스트 렌더러
 */
export const renderText = (value: any) => (
  <span className={styles.cellText}>{value}</span>
);
