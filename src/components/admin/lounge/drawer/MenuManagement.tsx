import React, { useState, useMemo } from 'react';
import styles from '../../../../styles/components/lounge/drawer/MenuManagement.module.scss';
import Table, { TableColumn } from '@/components/common/Table';
import {
  renderCheckbox,
  renderImage,
  renderTags,
  renderStatusSelector,
  renderChannelTags,
  renderEditButton,
} from '@/utils/tableRenderers';
import { MenuMockData } from '@/mock/menuMockData';

interface MenuManagementProps {
  onClose: () => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSearch = () => {
    console.log('검색:', searchTerm);
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`${action} 실행:`, selectedItems);
  };

  const columns: TableColumn[] = useMemo(() => [
    {
      key: 'select',
      label: '선택',
      width: 81,
      render: renderCheckbox(selectedItems, handleItemSelect),
    },
    {
      key: 'store',
      label: '매장',
      width: 146,
      sortable: true,
    },
    {
      key: 'image',
      label: '이미지',
      width: 174,
      render: renderImage,
    },
    {
      key: 'code',
      label: '코드',
      width: 120,
      sortable: true,
    },
    {
      key: 'category',
      label: '분류',
      width: 120,
      sortable: true,
    },
    {
      key: 'name',
      label: '메뉴명',
      width: 174,
      sortable: true,
    },
    {
      key: 'price',
      label: '금액',
      width: 150,
      sortable: true,
    },
    {
      key: 'tags',
      label: '태그',
      width: 120,
      sortable: true,
      render: renderTags,
    },
    {
      key: 'cookingTime',
      label: '조리시간',
      width: 133,
      sortable: true,
    },
    {
      key: 'status',
      label: '상태',
      width: 141,
      sortable: true,
      render: renderStatusSelector((itemId, status) => console.log('상태 변경:', itemId, status)),
    },
    {
      key: 'channels',
      label: '채널',
      width: 130,
      sortable: true,
      render: renderChannelTags,
    },
    {
      key: 'types',
      label: '유형',
      width: 130,
      sortable: true,
      render: renderChannelTags,
    },
    {
      key: 'registerDate',
      label: '등록일',
      width: 120,
      sortable: true,
    },
    {
      key: 'edit',
      label: '수정',
      width: 50,
      render: renderEditButton((itemId) => console.log('수정:', itemId)),
    },
  ], [selectedItems]);

  return (
    <div className={styles.menuManagement}>
      <div className={styles.contentArea}>
        <div className={styles.itemCount}>총 {MenuMockData.length}개</div>

        <Table
          columns={columns}
          data={MenuMockData}
          variant="menu"
          onSort={(key) => console.log('정렬:', key)}
        />
      </div>

      <div className={styles.scrollbar} />
    </div>
  );
};

export default MenuManagement;
