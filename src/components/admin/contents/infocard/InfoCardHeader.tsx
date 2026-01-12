import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';

interface InfoCardHeaderProps {
  tableNumber: string;
  orderLocation: string;
  selectedTable: string | null;
  isDropdownOpen: boolean;
  isDisabledStatus: boolean;
  availableTables: string[];
  onToggleDropdown: () => void;
  onSelectTable: (table: string) => void;
}

const InfoCardHeader: React.FC<InfoCardHeaderProps> = ({
  tableNumber,
  orderLocation,
  selectedTable,
  isDropdownOpen,
  isDisabledStatus,
  availableTables,
  onToggleDropdown,
  onSelectTable,
}) => {
  const getTableTagStyles = () => {
    if (isDisabledStatus) {
      return {
        background: '#D9D9D9',
        border: 'none',
        color: '#666',
      };
    } else if (selectedTable) {
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
    if (selectedTable || isDisabledStatus) {
      return <img src={'/assets/image/admin/info-card/arrow-dark.svg'} alt="arrow" />;
    }
    return <img src={'/assets/image/admin/info-card/arrow-red.svg'} alt="arrow" />;
  };

  return (
    <div className={styles.header}>
      <div className={styles.tableSelectContainer}>
        <div
          className={`${styles.tableTag} ${styles.clickableTableTag}`}
          style={getTableTagStyles()}
          onClick={onToggleDropdown}
        >
          <span className={`${styles.tableText} ${selectedTable}`}>
            {tableNumber || (selectedTable || '테이블')}
          </span>
          {getArrowIcon()}
        </div>
        {isDropdownOpen && !isDisabledStatus && (
          <div className={styles.tableDropdown}>
            {availableTables.map((table, index) => (
              <div
                key={index}
                className={`${styles.tableOption} ${selectedTable === table ? styles.selectedOption : ''}`}
                onClick={() => onSelectTable(table)}
              >
                {table}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.tableInfo}>
        <img src="/assets/image/admin/info-card/location.svg" alt="위치" />
        <span className={styles.tableNumber}>{orderLocation}</span>
      </div>
    </div>
  );
};

export default InfoCardHeader;
