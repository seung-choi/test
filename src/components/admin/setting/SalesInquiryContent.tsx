'use client';

import React, { useMemo } from 'react';
import Table, { TableColumn } from '@/components/common/Table';
import { OrderRecord } from '@/types/admin/setting.types';

interface SalesInquiryContentProps {
  records: OrderRecord[];
  onSort?: (key: string) => void;
}

const SalesInquiryContent: React.FC<SalesInquiryContentProps> = ({ records, onSort }) => {
  const columns: TableColumn[] = useMemo(() => [
    {
      key: 'orderDate',
      label: '주문 일자',
      width: 151,
      sortable: true,
    },
    {
      key: 'teeOff',
      label: '티오프',
      width: 180,
      sortable: true,
    },
    {
      key: 'caddyName',
      label: '캐디명',
      width: 135,
      sortable: true,
    },
    {
      key: 'customers',
      label: '내장객(단체명)',
      width: 273,
      sortable: true,
      render: (value: string[], row: OrderRecord) => (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          width: '100%',
          alignItems: 'center'
        }}>
          <div style={{
            width: 241,
            textAlign: 'center',
            color: '#1F1F1F',
            fontSize: 19,
            fontFamily: 'SUIT',
            fontWeight: 600
          }}>
            {value.join(', ')}
          </div>
          <div style={{
            width: 241,
            textAlign: 'center',
            color: 'black',
            fontSize: 19,
            fontFamily: 'SUIT',
            fontWeight: 400
          }}>
            ({row.groupName})
          </div>
        </div>
      ),
    },
    {
      key: 'totalItems',
      label: '총 메뉴수',
      width: 157,
      sortable: true,
      render: (value: number) => `${value}개`,
    },
    {
      key: 'menuDetails',
      label: '주문 메뉴 내역',
      width: 282,
      sortable: true,
      render: (value: string) => (
        <div style={{
          width: 262,
          textAlign: 'center',
          color: '#1F1F1F',
          fontSize: 19,
          fontFamily: 'SUIT',
          fontWeight: 600
        }}>
          {value}
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: '총 주문금액',
      width: 258,
      sortable: true,
      render: (value: number) => value > 0 ? value.toLocaleString() : '-',
    },
    {
      key: 'status',
      label: '최종 상태',
      width: 157,
      sortable: true,
    },
    {
      key: 'cancelReason',
      label: '취소 사유',
      width: 208,
      sortable: true,
      render: (value: string | undefined) => value || '-',
    },
  ], []);

  return <Table columns={columns} data={records} onSort={onSort} />;
};

export default SalesInquiryContent;
