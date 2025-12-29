'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/pageNavigation.module.scss';
import { LayoutPage } from '@/types/admin/layout.type';

interface PageNavigationProps {
    pages: LayoutPage[];
    currentPageId: string;
    onPageSelect: (pageId: string) => void;
    onPageAdd: () => void;
    onPageDelete: (pageId: string) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSelect,
    onPageAdd,
    onPageDelete
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.pageList}>
                {pages.map((page, index) => (
                    <div
                        key={page.id}
                        className={`${styles.pageItem} ${page.id === currentPageId ? styles.active : ''}`}
                        onClick={() => onPageSelect(page.id)}
                    >
                        <div className={styles.pageNumber}>{index + 1}</div>
                        {pages.length > 1 && (
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPageDelete(page.id);
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button className={styles.addButton} onClick={onPageAdd}>
                <div className={styles.addIcon}>
                    <div className={styles.plusIcon} />
                </div>
                <div className={styles.addText}>페이지 추가</div>
            </button>
        </div>
    );
};

export default PageNavigation;
