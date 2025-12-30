'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/pageNavigation.module.scss';
import { LayoutPage } from '@/types';

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
                                <svg width="63" height="64" viewBox="0 0 63 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_2767_80237)">
                                        <rect x="10" y="10" width="43" height="44" rx="21.5" fill="#F3F3F3" shape-rendering="crispEdges"/>
                                        <rect x="10.25" y="10.25" width="42.5" height="43.5" rx="21.25" stroke="#7B7B7B" stroke-width="0.5" shape-rendering="crispEdges"/>
                                        <path d="M44.6896 33.8823H33.3843V45.1876H29.6159V33.8823H18.3105V30.1139H29.6159V18.8086H33.3843V30.1139H44.6896V33.8823Z" fill="#959595"/>
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_2767_80237" x="0" y="0" width="63" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                            <feOffset/>
                                            <feGaussianBlur stdDeviation="5"/>
                                            <feComposite in2="hardAlpha" operator="out"/>
                                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2767_80237"/>
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2767_80237" result="shape"/>
                                        </filter>
                                    </defs>
                                </svg>

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
