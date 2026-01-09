import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import Drawer from '@/components/admin/drawer/Drawer';
import MenuManagement, { MenuManagementRef } from '@/components/admin/drawer/menu/MenuManagement';
import { drawerState } from '@/lib/recoil';
import { OrderCounts } from '@/types';
import SettingManagement from '@/components/admin/drawer/setting/SettingManagement';

type NotificationOption = 'none' | 'one-time' | 'three-times' | 'repeat';

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
  const [notificationOption, setNotificationOption] = useState<NotificationOption>('repeat');
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const menuManagementRef = useRef<MenuManagementRef>(null);
  const notificationButtonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  const handleNotificationClick = () => {
    setShowNotificationPopover(!showNotificationPopover);
  };

  const handleNotificationOptionClick = (option: NotificationOption) => {
    setNotificationOption(option);
    setShowNotificationPopover(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotificationPopover(false);
      }
    };

    if (showNotificationPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationPopover]);

  const notificationOptions = [
    { key: 'one-time' as NotificationOption, label: '알림 1번', icon: 'one-time.svg' },
    { key: 'three-times' as NotificationOption, label: '알림 3번', icon: 'three-times.svg' },
    { key: 'repeat' as NotificationOption, label: '계속 알림', icon: 'repeat.svg' },
    { key: 'none' as NotificationOption, label: '알림끄기', icon: 'none.svg' },
  ];

  const filterItems = [
    { key: 'all', label: '전체', count: orderCounts.all },
    { key: 'order', label: '주문', count: orderCounts.order },
    { key: 'accept', label: '수락', count: orderCounts.accept },
    { key: 'complete', label: '완료', count: orderCounts.complete },
    { key: 'cancel', label: '취소', count: orderCounts.cancel },
  ];

  return (
    <div className={styles.sideTab}>
      <div className={styles.loungeHeader}>
        <img src="/assets/image/admin/layout/side-bar/lounge_logo.svg" alt="logo" />
        <div className={styles.loungeTitle}>라운지</div>
      </div>

      <div className={styles.sideSelection}>
        <div className={styles.filtersContainer}>
          {filterItems.map((item) => (
              <div
                  key={item.key}
                  className={`${styles.filterButton} ${
                      activeFilter === item.key ? styles.active : ''
                  }`}
                  onClick={() => handleFilterClick(item.key)}
              >
                <div className={styles.filterLabel}>
                  {item.label}
                  {hasNotification && (
                      <div className={styles.notificationDot}></div>
                  )}
                </div>
                <div className={styles.filterCount}>({item.count})</div>
              </div>
          ))}
        </div>
        <div className={styles.menuSection}>
          <div className={styles.menuItem} style={{ backgroundColor: '#9081D8'}}>
            <div className={styles.menuIcon}>
              <img src="/assets/image/admin/layout/side-bar/order.svg" alt="logo" />
            </div>
            <div className={styles.menuLabel} style={{ color:"white" }}>오더</div>
          </div>

          <div className={styles.menuItem}>
            <div className={styles.menuIcon}>
              <img src="/assets/image/admin/layout/side-bar/menu.svg" alt="logo" />
            </div>
            <div className={styles.menuLabel}>
              <button onClick={() => setDrawer(prev => ({ ...prev, openDrawer: prev.openDrawer === 'menu' ? null : 'menu' }))}>
                메뉴 관리
              </button>
            </div>
          </div>

          <div className={styles.menuItem}>
            <div className={styles.menuIcon}>
              <img src="/assets/image/admin/layout/side-bar/setting.svg" alt="logo" />
            </div>
            <div className={styles.menuLabel}>
              <button onClick={() => setDrawer(prev => ({ ...prev, openDrawer: prev.openDrawer === 'setting' ? null : 'setting' }))}>
                설정
              </button>
            </div>
          </div>

          <div
            className={styles.menuItem}
            ref={notificationButtonRef}
            onClick={handleNotificationClick}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className={styles.menuIcon}>
              <img src="/assets/image/admin/layout/side-bar/notification.svg" alt="logo" />
              <div className={styles.notificationBadge}>
                <img src={`/assets/image/admin/layout/side-bar/noti-option/${notificationOption}.svg`} alt="logo" />
              </div>
            </div>
            <div className={styles.menuLabel}>알림음</div>
            {showNotificationPopover && (
              <div ref={popoverRef} className={styles.notificationPopover}>
                {notificationOptions.map((option) => (
                  <div
                    key={option.key}
                    className={`${styles.popoverOption} ${notificationOption === option.key ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotificationOptionClick(option.key);
                    }}
                  >
                    <div className={styles.popoverIcon}>
                      <img src={`/assets/image/admin/layout/side-bar/noti-option/${option.icon}`} alt={option.label} />
                    </div>
                    <div className={styles.popoverLabel}>{option.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.menuItem}>
            <div className={styles.menuIcon}>
              <img src="/assets/image/admin/layout/side-bar/view.svg" alt="logo" />
            </div>
            <div className={styles.menuLabel}>보기설정</div>
          </div>
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
        <SettingManagement />
      </Drawer>

    </div>
  );
};

export default SideTab;