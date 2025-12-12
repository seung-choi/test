import React, { useState } from 'react';
import styles from '../../../../styles/components/lounge/layout/SideTab.module.scss';
import Drawer from '../drawer/Drawer';
import MenuManagement from '../drawer/MenuManagement';

interface OrderCount {
  all: number;
  order: number;
  accept: number;
  complete: number;
  cancel: number;
}

interface SideTabProps {
  orderCounts: OrderCount;
  onFilterChange: (filter: string) => void;
  hasNotification?: boolean;
}

const SideTab: React.FC<SideTabProps> = ({
                                           orderCounts,
                                           onFilterChange,
                                           hasNotification = false
                                         }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

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
            <button onClick={() => setIsMenuDrawerOpen(true)}>
              메뉴 관리
            </button>
          </div>
        </div>

        <div className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <img src="/assets/image/layout/side-bar/setting.svg" alt="logo" />
          </div>
          <div className={styles.menuLabel}>
            <button onClick={() => setIsSettingsDrawerOpen(true)}>
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
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        title="메뉴 관리"
        mode='menu'
      >
        <MenuManagement onClose={() => setIsMenuDrawerOpen(false)} />
      </Drawer>

      <Drawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setIsSettingsDrawerOpen(false)}
        title="설정"
        mode='setting'
      >
        <div>설정 콘텐츠 (미구현)</div>
      </Drawer>

    </div>
  );
};

export default SideTab;