import React from 'react';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import NotificationButton from './NotificationButton';
import { NotificationOption } from '@/hooks/common/useNotificationStorage';
import {router} from "next/client";

interface MenuSectionProps {
  notificationOption: NotificationOption;
  isTablet: boolean;
  onMenuClick: () => void;
  onSettingClick: () => void;
  onNotificationChange: (option: NotificationOption) => void;
  onFullscreenToggle: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  notificationOption,
  isTablet,
  onMenuClick,
  onSettingClick,
  onNotificationChange,
  onFullscreenToggle,
}) => {
    const handleRouterClick = () => {
        router.push('order/main')
    }

    return (
    <div className={styles.menuSection}>
      <div className={styles.menuItem} style={{ backgroundColor: '#9081D8' }}>
        <div className={styles.menuIcon}>
          <img src="/assets/image/admin/layout/side-bar/order.svg" alt="logo" />
        </div>
        <div className={styles.menuLabel} style={{ color: 'white' }} onClick={handleRouterClick}>오더</div>
      </div>

      <div className={styles.menuItem} onClick={onMenuClick}>
        <div className={styles.menuIcon}>
          <img src="/assets/image/admin/layout/side-bar/menu.svg" alt="logo" />
        </div>
        <div className={styles.menuLabel}>메뉴 관리</div>
      </div>

      <div className={styles.menuItem} onClick={onSettingClick}>
        <div className={styles.menuIcon}>
          <img src="/assets/image/admin/layout/side-bar/setting.svg" alt="logo" />
        </div>
        <div className={styles.menuLabel}>설정</div>
      </div>

      <NotificationButton
        notificationOption={notificationOption}
        onOptionChange={onNotificationChange}
      />

      {!isTablet && (
        <div className={styles.menuItem} onClick={onFullscreenToggle} style={{ cursor: 'pointer' }}>
          <div className={styles.menuIcon}>
            <img src="/assets/image/admin/layout/side-bar/view.svg" alt="logo" />
          </div>
          <div className={styles.menuLabel}>보기설정</div>
        </div>
      )}
    </div>
  );
};

export default MenuSection;
