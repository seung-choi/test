import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import NotificationButton from './NotificationButton';
import MessageButton from './MessageButton';
import { NotificationOption } from '@/hooks/common/useNotificationStorage';

interface MenuSectionProps {
  notificationOption: NotificationOption;
  isTablet: boolean;
  hasMenuNotification?: boolean;
  onMenuClick: () => void;
  onSettingClick: () => void;
  onNotificationChange: (option: NotificationOption) => void;
  onFullscreenToggle: () => void;
  onMessageNotificationClear?: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  notificationOption,
  isTablet,
  hasMenuNotification = false,
  onMenuClick,
  onSettingClick,
  onNotificationChange,
  onFullscreenToggle,
  onMessageNotificationClear,
}) => {
    const router = useRouter();

    const handleRouterClick = () => {
        router.push('/order/main');
    };

    return (
    <div className={styles.menuSection}>
      <div className={`${styles.menuItem} ${styles.activeMenuItem}`} onClick={handleRouterClick}>
        <div className={styles.menuIcon}>
          <img src="/assets/image/admin/layout/side-bar/order.svg" alt="logo" />
        </div>
        <div className={styles.menuLabel}>오더</div>
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

      <MessageButton
        hasNotification={hasMenuNotification}
        isTablet={isTablet}
        onNotificationClear={onMessageNotificationClear}
      />

      <NotificationButton
        notificationOption={notificationOption}
        isTablet={isTablet}
        onOptionChange={onNotificationChange}
      />

      {!isTablet && (
        <div className={styles.menuItem} onClick={onFullscreenToggle} style={{ height: '2.5rem', alignItems: 'center' }}>
          <div className={styles.menuIcon}>
            <img src="/assets/image/admin/layout/side-bar/view.svg" alt="logo" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSection;
