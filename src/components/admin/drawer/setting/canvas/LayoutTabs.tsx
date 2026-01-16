'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/layoutTabs.module.scss';
import type { LayoutTabsProps } from '@/types';

const LayoutTabs: React.FC<LayoutTabsProps> = ({ activeTab, onTabChange, onSave }) => {
    return (
        <div className={styles.tabContainer}>
            <div className={styles.tabGroup}>
                <button
                    className={`${styles.tab} ${activeTab === 'table' ? styles.active : ''}`}
                    onClick={() => onTabChange('table')}
                >
                    테이블 모드
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
                    onClick={() => onTabChange('list')}
                >
                    목록 모드
                </button>
            </div>
            {onSave && (
                <button className={styles.saveButton} onClick={onSave}>
                    저장
                </button>
            )}
        </div>
    );
};

export default LayoutTabs;
