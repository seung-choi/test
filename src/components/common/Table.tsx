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
