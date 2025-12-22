'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '@/styles/components/common/Table.module.scss';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  style?: React.CSSProperties;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  variant?: 'default' | 'menu' | 'sales';
  onSort?: (key: string) => void;
  className?: string;
  isReorderMode?: boolean;
}

interface SortableRowProps {
  row: any;
  columns: TableColumn[];
  isReorderMode?: boolean;
}

const SortableRow: React.FC<SortableRowProps> = ({ row, columns, isReorderMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.tableRow} ${isReorderMode ? styles.reorderMode : ''}`}
      {...attributes}
      {...(isReorderMode ? listeners : {})}
    >
      {columns.map((column) => {
        const cellValue = row[column.key];
        let displayValue: React.ReactNode = cellValue;

        // render 함수가 없을 때 안전하게 값 처리
        if (!column.render) {
          if (Array.isArray(cellValue)) {
            // 배열이면 join으로 문자열 변환
            displayValue = cellValue.join(', ');
          } else if (cellValue === null || cellValue === undefined) {
            // null/undefined면 빈 문자열
            displayValue = '';
          } else if (typeof cellValue === 'object') {
            // 객체면 빈 문자열 (또는 JSON.stringify(cellValue))
            displayValue = '';
          } else {
            // 원시값(string, number, boolean)은 그대로
            displayValue = String(cellValue);
          }
        }

        return (
          <div
            key={column.key}
            className={styles.tableCell}
            style={{ width: column.width, ...column.style }}
          >
            {column.render
              ? column.render(cellValue, row)
              : <span className={styles.cellText}>{displayValue}</span>
            }
          </div>
        );
      })}
    </div>
  );
};

const Table: React.FC<TableProps> = ({
  columns,
  data,
  variant = 'default',
  onSort,
  className,
  isReorderMode = false
}) => {
  const containerClass = variant === 'menu'
    ? styles.menuTableContainer
    : styles.tableContainer;

  return (
    <div className={`${containerClass} ${className || ''}`}>
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

      <div className={styles.tableBody}>
        {data.map((row, index) => (
          <SortableRow
            key={row.id || index}
            row={row}
            columns={columns}
            isReorderMode={isReorderMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
