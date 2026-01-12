import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import { NotificationOption } from '@/hooks/common/useNotificationStorage';

interface NotificationButtonProps {
  notificationOption: NotificationOption;
  onOptionChange: (option: NotificationOption) => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  notificationOption,
  onOptionChange,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const notificationOptions = [
    { key: 'one-time' as NotificationOption, label: '알림 1번', icon: 'one-time.svg' },
    { key: 'three-times' as NotificationOption, label: '알림 3번', icon: 'three-times.svg' },
    { key: 'repeat' as NotificationOption, label: '계속 알림', icon: 'repeat.svg' },
    { key: 'none' as NotificationOption, label: '알림끄기', icon: 'none.svg' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  const handleClick = () => {
    setShowPopover(!showPopover);
  };

  const handleOptionClick = (option: NotificationOption) => {
    onOptionChange(option);
    setShowPopover(false);
  };

  return (
    <div
      className={styles.menuItem}
      ref={buttonRef}
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className={styles.menuIcon}>
        <img src="/assets/image/admin/layout/side-bar/notification.svg" alt="logo" />
        <div className={styles.notificationBadge}>
          <img src={`/assets/image/admin/layout/side-bar/noti-option/${notificationOption}.svg`} alt="logo" />
        </div>
      </div>
      <div className={styles.menuLabel}>알림음</div>
      {showPopover && (
        <div ref={popoverRef} className={styles.notificationPopover}>
          {notificationOptions.map((option) => (
            <div
              key={option.key}
              className={`${styles.popoverOption} ${notificationOption === option.key ? styles.active : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(option.key);
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
  );
};

export default NotificationButton;
