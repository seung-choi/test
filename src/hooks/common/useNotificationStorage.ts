import { useState, useEffect } from 'react';
import storage from '@/utils/storage';

export type NotificationOption = 'none' | 'one-time' | 'three-times' | 'repeat';

export const useNotificationStorage = () => {
  const getInitialNotificationOption = (): NotificationOption => {
    const saved = storage.local.get('notificationOption');
    if (saved === 'none' || saved === 'one-time' || saved === 'three-times' || saved === 'repeat') {
      return saved;
    }
    return 'repeat';
  };

  const [notificationOption, setNotificationOption] = useState<NotificationOption>(getInitialNotificationOption);

  const updateNotificationOption = (option: NotificationOption) => {
    setNotificationOption(option);
    storage.local.set({ notificationOption: option });
  };

  return {
    notificationOption,
    setNotificationOption: updateNotificationOption,
  };
};
