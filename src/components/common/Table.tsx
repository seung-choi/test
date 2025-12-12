'use client';

import React from 'react';
import styles from '@/styles/components/common/Table.module.scss';

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  variant?: 'default' | 'menu';
  onSort?: (key: string) => void;
  className?: string;
}

/**
 * 통합 테이블 컴포넌트
 * - variant='default': Settings 페이지용 (기본 스타일)
 * - variant='menu': Menu Management 페이지용 (확장된 스타일)
 */
const Table: React.FC<TableProps> = ({
  columns,
  data,
  variant = 'default',
  onSort,
  className
}) => {
  const containerClass = variant === 'menu'
    ? styles.menuTableContainer
    : styles.tableContainer;

  return (
    <div className={`${containerClass} ${className || ''}`}>
      {/* 테이블 헤더 */}
      <div className={styles.tableHeader}>
        {columns.map((column) => (
          <div
            key={column.key}
            className={styles.headerCell}
            style={{ width: column.width }}
            onClick={() => column.sortable && onSort?.(column.key)}
          >
            <span className={styles.headerText}>{column.label}</span>
            {column.sortable && (
              <img
                src="/assets/image/global/triangle.svg"
                alt="sort"
                className={styles.sortIcon}
              />
            )}
          </div>
        ))}
      </div>

      {/* 테이블 바디 */}
      <div className={styles.tableBody}>
        {data.map((row, index) => (
          <div key={row.id || index} className={styles.tableRow}>
            {columns.map((column) => (
              <div
                key={column.key}
                className={styles.tableCell}
                style={{ width: column.width }}
              >
                {column.render
                  ? column.render(row[column.key], row)
                  : <span className={styles.cellText}>{row[column.key]}</span>
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
