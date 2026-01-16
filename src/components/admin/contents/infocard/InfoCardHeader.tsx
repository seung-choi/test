import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import type { InfoCardHeaderProps } from '@/types';

const InfoCardHeader: React.FC<InfoCardHeaderProps> = ({
  tableNumber,
  realTimeLocation,
  selectedTable,
  isDropdownOpen,
  isDisabledStatus,
  availableTables,
  onToggleDropdown,
  onSelectTable,
}) => {
  const hasTableOptions = availableTables.length > 0;
  const hasTableValue = Boolean(tableNumber || selectedTable);

  const getTableTagStyles = () => {
    if (isDisabledStatus) {
      return {
        background: '#D9D9D9',
        border: 'none',
        color: '#666',
      };
    } else if (hasTableValue) {
      return {
        background: '#E6E9F1',
        border: 'none',
        color: '#313246',
      };
    } else {
      return {
        background: 'rgba(219.94, 0, 0, 0.10)',
        border: '1px solid #DC0000',
        color: '#DC0000',
      };
    }
  };

  const getArrowIcon = () => {
    if (!hasTableOptions) {
      return null;
    }
    if (hasTableValue || isDisabledStatus) {
      return <img src={'/assets/image/admin/info-card/arrow-dark.svg'} alt="arrow" />;
    }
    return <img src={'/assets/image/admin/info-card/arrow-red.svg'} alt="arrow" />;
  };

  const handleToggle = () => {
    if (!hasTableOptions || isDisabledStatus) return;
    onToggleDropdown();
  };

  return (
    <div className={styles.header}>
      {hasTableOptions || hasTableValue ? (
        <div className={styles.tableSelectContainer}>
          <div
            className={`${styles.tableTag} ${hasTableOptions ? styles.clickableTableTag : ''}`}
            style={getTableTagStyles()}
            onClick={handleToggle}
          >
            <span className={`${styles.tableText} ${selectedTable}`}>
              {tableNumber || selectedTable || '테이블'}
            </span>
            {getArrowIcon()}
          </div>
          {hasTableOptions && isDropdownOpen && !isDisabledStatus && (
            <div className={styles.tableDropdown}>
              {availableTables.map((table, index) => (
                <div
                  key={index}
                  className={`${styles.tableOption} ${selectedTable === table.label ? styles.selectedOption : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTable(table);
                  }}
                >
                  {table.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className={styles.tableInfo}>
        <img src="/assets/image/admin/info-card/location.svg" alt="위치" />
        <span className={styles.tableNumber}>{realTimeLocation}</span>
      </div>
    </div>
  );
};

export default InfoCardHeader;
