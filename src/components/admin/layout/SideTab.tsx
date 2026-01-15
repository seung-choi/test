import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import Drawer from '@/components/admin/drawer/Drawer';
import MenuManagement, { MenuManagementRef } from '@/components/admin/drawer/menu/MenuManagement';
import SettingManagement from '@/components/admin/drawer/setting/SettingManagement';
import FilterSection from './sidetab/FilterSection';
import MenuSection from './sidetab/MenuSection';
import { drawerState } from '@/lib/recoil';
import { OrderCounts, OrderFilterKey } from '@/types';
import { useNotificationStorage } from '@/hooks/common/useNotificationStorage';
import { useDeviceType } from '@/hooks/common/useDeviceType';
import { useFullscreen } from '@/hooks/common/useFullscreen';

interface SideTabProps {
  orderCounts: OrderCounts;
  onFilterChange: (filter: OrderFilterKey) => void;
  hasNotification?: boolean;
  onMessageNotificationClear?: () => void;
}

const SideTab: React.FC<SideTabProps> = ({
  orderCounts,
  onFilterChange,
  hasNotification = false,
  onMessageNotificationClear
}) => {
  const [activeFilter, setActiveFilter] = useState<OrderFilterKey>('order');
  const [drawer, setDrawer] = useRecoilState(drawerState);
  const menuManagementRef = useRef<MenuManagementRef>(null);
  const [hasSelectedItems, setHasSelectedItems] = useState(false);

  const { notificationOption, setNotificationOption } = useNotificationStorage();
  const { isTablet } = useDeviceType();
  const { toggleFullscreen } = useFullscreen();

  const handleFilterClick = (filter: OrderFilterKey) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  const handleMenuClick = () => {
    setDrawer(prev => ({ ...prev, openDrawer: prev.openDrawer === 'menu' ? null : 'menu' }));
  };

  const handleSettingClick = () => {
    setDrawer(prev => ({ ...prev, openDrawer: prev.openDrawer === 'setting' ? null : 'setting' }));
  };

  const handleDrawerClose = () => {
    setDrawer(prev => ({ ...prev, openDrawer: null }));
  };

  return (
    <div className={styles.sideTab}>
      <div className={styles.loungeHeader}>
        <img src="/assets/image/admin/layout/side-bar/lounge_logo.svg" alt="logo" />
        <div className={styles.loungeTitle}>라운지</div>
      </div>

      <div className={styles.sideSelection}>
        <FilterSection
          activeFilter={activeFilter}
          orderCounts={orderCounts}
          hasNotification={hasNotification}
          onFilterChange={handleFilterClick}
        />

        <MenuSection
          notificationOption={notificationOption}
          isTablet={isTablet}
          hasMenuNotification={hasNotification}
          onMenuClick={handleMenuClick}
          onSettingClick={handleSettingClick}
          onNotificationChange={setNotificationOption}
          onFullscreenToggle={toggleFullscreen}
          onMessageNotificationClear={onMessageNotificationClear}
        />
      </div>

      <Drawer
        isOpen={drawer.openDrawer === 'menu'}
        onClose={handleDrawerClose}
        title="메뉴 관리"
        mode='menu'
        hasSelectedItems={hasSelectedItems}
        onDelete={() => menuManagementRef.current?.handleDelete()}
        onReorderCommit={() => menuManagementRef.current?.handleCommitReorder()}
      >
        <MenuManagement
          ref={menuManagementRef}
          onClose={handleDrawerClose}
          onSelectionChange={setHasSelectedItems}
        />
      </Drawer>

      <Drawer
        isOpen={drawer.openDrawer === 'setting'}
        onClose={handleDrawerClose}
        title="설정"
        mode='setting'
      >
        <SettingManagement />
      </Drawer>
    </div>
  );
};

export default SideTab;
