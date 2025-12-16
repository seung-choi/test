import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import styles from '@/styles/components/admin/lounge/layout/SideTab.module.scss';
import Drawer from '../drawer/Drawer';
import MenuManagement, { MenuManagementRef } from '../drawer/menu/MenuManagement';
import { drawerState } from '@/lib/recoil';
import { OrderCounts } from '@/types';
import SettingManagement from '../drawer/setting/SettingManagement';

interface SideTabProps {
  orderCounts: OrderCounts;
  onFilterChange: (filter: string) => void;
  hasNotification?: boolean;
}

const SideTab: React.FC<SideTabProps> = ({
                                           orderCounts,
                                           onFilterChange,
                                           hasNotification = false
                                         }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [drawer, setDrawer] = useRecoilState(drawerState);
  const menuManagementRef = useRef<MenuManagementRef>(null);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  const filterItems = [
    { key: 'all', label: '전체', count: orderCounts.all },
    { key: 'order', label: '주문', count: orderCounts.order },
    { key: 'accept', label: '수락', count: orderCounts.accept },
    { key: 'complete', label: '완료', count: orderCounts.complete },
    { key: 'cancel', label: '취소', count: orderCounts.cancel },
  ];

  return (
    <div className={styles.sideTab}>
      <div className={styles.loungeSection}>
        <div className={styles.loungeHeader}>
          <img src="/assets/image/layout/side-bar/lounge_logo.svg" alt="logo" />
          <div className={styles.loungeTitle}>라운지</div>
        </div>

        <div className={styles.filtersContainer}>
          {filterItems.map((item) => (
            <div
              key={item.key}
              className={`${styles.filterButton} ${
                activeFilter === item.key ? styles.active : ''
              }`}
              onClick={() => handleFilterClick(item.key)}
            >
              <div className={styles.filterLabel}>{item.label}</div>
              <div className={styles.filterCount}>({item.count})</div>
            </div>
          ))}
          {hasNotification && (
            <div className={styles.notificationDot}></div>
          )}
        </div>
      </div>

      <div className={styles.menuSection}>
        <div className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <img src="/assets/image/layout/side-bar/menu.svg" alt="logo" />
          </div>
          <div className={styles.menuLabel}>
            <button onClick={() => setDrawer(prev => ({ ...prev, openDrawer: prev.openDrawer === 'menu' ? null : 'menu' }))}>
              메뉴 관리
            </button>
          </div>
        </div>

        <div className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <img src="/assets/image/layout/side-bar/setting.svg" alt="logo" />
          </div>
          <div className={styles.menuLabel}>
            <button onClick={() => setDrawer(prev => ({ ...prev, openDrawer: prev.openDrawer === 'setting' ? null : 'setting' }))}>
              설정
            </button>
          </div>
        </div>

        <div className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <img src="/assets/image/layout/side-bar/notification.svg" alt="logo" />
            <div className={styles.notificationBadge}>
              <img src="/assets/image/layout/side-bar/repeat.svg" alt="logo" />
            </div>
          </div>
          <div className={styles.menuLabel}>알림음</div>
        </div>

        <div className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <img src="/assets/image/layout/side-bar/view.svg" alt="logo" />
          </div>
          <div className={styles.menuLabel}>보기설정</div>
        </div>
      </div>

      <Drawer
        isOpen={drawer.openDrawer === 'menu'}
        onClose={() => setDrawer(prev => ({ ...prev, openDrawer: null }))}
        title="메뉴 관리"
        mode='menu'
        onDelete={() => menuManagementRef.current?.handleDelete()}
      >
        <MenuManagement ref={menuManagementRef} onClose={() => setDrawer(prev => ({ ...prev, openDrawer: null }))} />
      </Drawer>

      <Drawer
        isOpen={drawer.openDrawer === 'setting'}
        onClose={() => setDrawer(prev => ({ ...prev, openDrawer: null }))}
        title="설정"
        mode='setting'
      >
        <SettingManagement onClose={() => setDrawer(prev => ({ ...prev, openDrawer: null }))} />
      </Drawer>

    </div>
  );
};

export default SideTab;