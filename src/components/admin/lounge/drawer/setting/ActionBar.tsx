'use client';

import React, { ReactNode } from 'react';
import styles from '@/styles/pages/admin/setting.module.scss';

interface ActionBarProps {
  children: ReactNode;
}


const ActionBar: React.FC<ActionBarProps> = ({ children }) => {
  return (
    <div className={styles.actionBarContainer}>
      {children}
    </div>
  );
};

export default ActionBar;
