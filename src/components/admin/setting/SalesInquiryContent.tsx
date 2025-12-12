'use client';

import React, { useMemo } from 'react';
import Table, { TableColumn } from '@/components/common/Table';
import { OrderRecord } from '@/types/admin/setting.types';
import { getSalesTableColumns } from '@/constants/columns/SalesTable';

interface SalesInquiryContentProps {
  records: OrderRecord[];
  onSort?: (key: string) => void;
  handleStatusChange?: (itemId: string, status: string) => void;
}

const SalesInquiryContent: React.FC<SalesInquiryContentProps> = ({
                                                                   records,
                                                                   onSort,
                                                                   handleStatusChange
                                                                 }) => {
  const columns = useMemo(
      () => getSalesTableColumns({ handleStatusChange }),
      [handleStatusChange]
  );

  return <Table columns={columns} data={records} variant="menu" onSort={onSort} />;
};

export default SalesInquiryContent;