import React, {useState} from 'react';
import styles from '@/styles/components/common/Table.module.scss';
import { getTagClass } from '@/constants/admin/tags/menuTags';
import {formatDate, formatPrice} from "@/utils/common/formatDataUtils";

export interface TableRowData {
  id: string;
  name?: string;
  [key: string]: any;
}

export const renderCheckbox = (
  selectedItems: string[],
  onItemSelect?: (itemId: string, checked: boolean) => void
) => (value: any, row: TableRowData) => {
  const isChecked = selectedItems.includes(String(row.id));
  return (
    <div
      className={styles.checkboxContainer}
      onClick={() => onItemSelect?.(String(row.id), !isChecked)}
    >
      {isChecked ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 0 16 0H2ZM13.95 6.796C14.1376 6.60849 14.2431 6.35412 14.2432 6.08885C14.2433 5.82358 14.138 5.56914 13.9505 5.3815C13.763 5.19386 13.5086 5.08839 13.2434 5.0883C12.9781 5.0882 12.7236 5.19349 12.536 5.381L7.586 10.331L5.465 8.21C5.37216 8.11709 5.26192 8.04338 5.14059 7.99307C5.01926 7.94276 4.8892 7.91684 4.75785 7.9168C4.49258 7.9167 4.23814 8.02199 4.0505 8.2095C3.86286 8.39701 3.75739 8.65138 3.7573 8.91665C3.7572 9.18192 3.86249 9.43636 4.05 9.624L6.808 12.382C6.91015 12.4842 7.03144 12.5653 7.16493 12.6206C7.29842 12.6759 7.4415 12.7044 7.586 12.7044C7.7305 12.7044 7.87358 12.6759 8.00707 12.6206C8.14056 12.5653 8.26185 12.4842 8.364 12.382L13.95 6.796Z" fill="black"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 0H1.5C1.10218 0 0.720644 0.158035 0.43934 0.43934C0.158035 0.720644 0 1.10218 0 1.5V16.5C0 16.8978 0.158035 17.2794 0.43934 17.5607C0.720644 17.842 1.10218 18 1.5 18H16.5C16.8978 18 17.2794 17.842 17.5607 17.5607C17.842 17.2794 18 16.8978 18 16.5V1.5C18 1.10218 17.842 0.720644 17.5607 0.43934C17.2794 0.158035 16.8978 0 16.5 0ZM1.5 16.5V1.5H16.5V16.5H1.5Z" fill="#959595"/>
        </svg>
      )}
    </div>
  );
};

export const renderImage = (value: string, row: TableRowData) => {
    const ImageCell = () => {
        const [imageError, setImageError] = useState(false);

        if (!value || imageError) {
            return (
                <div className={styles.menuImage}>
                    <div className={styles.imagePlaceholder}>
                        이미지 준비중
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.menuImage}>
                <img
                    src={value}
                    alt={row.name || '이미지'}
                    onError={() => setImageError(true)}
                />
            </div>
        );
    };

    return <ImageCell />;
};

export const renderTags = (value: string[], row: TableRowData) => {
  return (
    <div className={styles.tagsContainer}>
      {value?.map((tag, index) => (
        <div key={index} className={`${styles.tag} ${styles[getTagClass(tag)]}`}>
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
    onClick={() => onStatusChange?.(String(row.id), value)}
  >
    <span className={styles.statusText}>{value}</span>
    <img src="/assets/image/global/arrow.svg" alt="arrow" />
  </button>
);

export const renderChannelTags = (value: string[], row: TableRowData) => (
  <div className={styles.channelTags}>
    {value?.map((item, index) => (
      <span key={index} className={styles.channelTag}>{item}</span>
    ))}
  </div>
);

export const renderEditButton = (
  onEdit?: (itemId: string) => void
) => (value: any, row: TableRowData) => (
  <button className={styles.editButton} onClick={() => onEdit?.(String(row.id))}>
    <img src="/assets/image/global/edit.svg" alt="edit" />
  </button>
);

export const renderPrice = (value: number, row: TableRowData) => (
  <span className={styles.cellText}>
    {formatPrice(value)}
  </span>
);

export const renderText = (value: any, row: TableRowData) => (
  <span className={styles.cellText}>{value}</span>
);

export const renderDragHandle = () => (value: any, row: TableRowData) => {
  return (
    <div className={styles.dragHandle}>
      <svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.68705 8.72727H25.313C25.7405 8.7274 26.1521 8.8849 26.4645 9.16794C26.777 9.45098 26.9669 9.83847 26.9961 10.2521C27.0252 10.6657 26.8914 11.0747 26.6215 11.3963C26.3517 11.7179 25.966 11.9282 25.5425 11.9847L25.313 12H1.68705C1.25948 11.9999 0.847901 11.8424 0.535474 11.5593C0.223048 11.2763 0.0330704 10.8888 0.00392727 10.4752C-0.0252158 10.0615 0.108649 9.6526 0.378473 9.33098C0.648297 9.00937 1.03396 8.79906 1.45754 8.74255L1.68705 8.72727ZM1.68705 0H25.313C25.7405 0.000127075 26.1521 0.157624 26.4645 0.440667C26.777 0.72371 26.9669 1.1112 26.9961 1.52483C27.0252 1.93846 26.8914 2.3474 26.6215 2.66902C26.3517 2.99063 25.966 3.20094 25.5425 3.25745L25.313 3.27273H1.68705C1.25948 3.2726 0.847901 3.1151 0.535474 2.83206C0.223048 2.54902 0.0330704 2.16153 0.00392727 1.7479C-0.0252158 1.33427 0.108649 0.925326 0.378473 0.603711C0.648297 0.282096 1.03396 0.0717849 1.45754 0.0152727L1.68705 0Z" fill="#7B7B7B"/>
      </svg>
    </div>
  );
};

export const renderDate = (value: string, row: TableRowData) => {
  return (
      <p className={styles.cellText}>{formatDate(value)} </p>
  );
}

export const renderCustomers = (value: any, row: any) => {
  return (
      <>
        <p className={styles.cellText}>{row.customerNames}</p>
        <p className={styles.cellText}>({row.groupName})</p>
      </>
  );
}