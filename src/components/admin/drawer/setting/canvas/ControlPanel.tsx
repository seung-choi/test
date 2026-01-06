'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/controlPanel.module.scss';
import { LayoutPage } from '@/types';

interface ControlPanelProps {
    pages: LayoutPage[];
    onPageAdd: () => void;
    onPageDelete: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    pages,
    onPageAdd,
    onPageDelete
}) => {
    const totalPages = pages.length;

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <button
                    className={styles.addButton}
                    onClick={onPageAdd}
                    title="페이지 추가"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="3" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <rect x="11" y="3" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="2 2"/>
                        <path d="M14 10h-1m-1 0h1m0 0v-1m0 1v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>페이지 추가</span>
                </button>

                <button
                    className={styles.deleteButton}
                    onClick={onPageDelete}
                    disabled={totalPages <= 1}
                    title="페이지 삭제"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 5h10M7 5V4a1 1 0 011-1h2a1 1 0 011 1v1m2 0v9a1 1 0 01-1 1H6a1 1 0 01-1-1V5h8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 8v4m2-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>페이지 삭제</span>
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
