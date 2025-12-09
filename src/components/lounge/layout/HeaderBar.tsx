'use client';

import React, { useState } from 'react';
import { CourseData } from '@/types';
import styles from '@/styles/components/lounge/layout/HeaderBar.module.scss';

interface HeaderBarProps {
  courseData: CourseData;
  onCourseChange?: (courseType: 'lake' | 'hill') => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ courseData, onCourseChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<'lake' | 'hill'>('lake');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCourseChange = (courseType: 'lake' | 'hill') => {
    setSelectedCourse(courseType);
    onCourseChange?.(courseType);
  };

  const currentCourseData = selectedCourse === 'lake' ? courseData.lakeCourse : courseData.hillCourse;

  if (!isExpanded) {
    return (
      <div className={styles.headerContainer}>
        <div className={styles.collapsedHeader}>
          <button
            className={styles.toggleButton}
            onClick={toggleExpanded}
            aria-label="헤더 펼치기"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.toggleIcon}
            >
              <path
                d="M11 14.3L15.4 9.9L6.6 9.9L11 14.3ZM11 22C9.47826 22 8.04826 21.711 6.71 21.133C5.37174 20.555 4.20757 19.772 3.2175 18.782C2.22743 17.792 1.44391 16.629 0.866951 15.293C0.289988 13.957 0.000988098 12.521 1.09673e-06 11C-0.000986904 9.479 0.288013 8.049 0.866951 6.71C1.44589 5.371 2.229 4.207 3.2175 3.218C4.206 2.229 5.370 1.445 6.71 0.867C8.05 0.289 9.479 0 11 0C12.521 0 13.957 0.289 15.293 0.867C16.629 1.445 17.792 2.228 18.782 3.218C19.772 4.208 20.555 5.371 21.133 6.71C21.711 8.049 22 9.479 22 11C22 12.521 21.711 13.957 21.133 15.293C20.555 16.629 19.772 17.792 18.782 18.782C17.792 19.772 16.629 20.555 15.293 21.133C13.957 21.711 12.521 22 11 22Z"
                fill="#959595"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.expandedHeader}>
        <div className={styles.headerContent}>
          {/* 왼쪽 코스 홀 정보 */}
          <div className={styles.courseSection}>
            {currentCourseData.map((hole, index) => (
              <React.Fragment key={hole.id}>
                <div className={styles.holeTag}>
                  <span className={styles.holeText}>{hole.holeNumber}</span>
                </div>
                {index < currentCourseData.length - 1 && (
                  <div className={styles.holeDot}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 중앙 코스 선택 버튼들 */}
          <div className={styles.centerSection}>
            <button
              className={`${styles.courseButton} ${
                selectedCourse === 'lake' ? styles.active : ''
              } ${styles.lakeButton}`}
              onClick={() => handleCourseChange('lake')}
            >
              LAKE
            </button>

            <div className={styles.startHouse}>
              <h2 className={styles.startHouseTitle}>스타트 하우스</h2>
              <div className={styles.startHouseUnderline}></div>
            </div>

            <button
              className={`${styles.courseButton} ${
                selectedCourse === 'hill' ? styles.active : ''
              } ${styles.hillButton}`}
              onClick={() => handleCourseChange('hill')}
            >
              HILL
            </button>
          </div>

          {/* 오른쪽 코스 홀 정보 (역순) */}
          <div className={styles.courseSection}>
            {[...currentCourseData].reverse().map((hole, index) => (
              <React.Fragment key={`${hole.id}-reverse`}>
                <div className={styles.holeTag}>
                  <span className={styles.holeText}>{hole.holeNumber}</span>
                </div>
                {index < currentCourseData.length - 1 && (
                  <div className={styles.holeDot}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <button
          className={styles.toggleButton}
          onClick={toggleExpanded}
          aria-label="헤더 접기"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.toggleIcon}
          >
            <path
              d="M11 7.7L6.60001 12.1L15.4 12.1L11 7.7ZM11 4.7604e-06C12.5217 4.89342e-06 13.9517 0.288938 15.29 0.866805C16.6283 1.44467 17.7925 2.22824 18.7825 3.2175C19.7725 4.20677 20.5561 5.37094 21.1332 6.71C21.7103 8.04907 21.9993 9.47907 22 11C22.0007 12.5209 21.7118 13.9509 21.1332 15.29C20.5546 16.6291 19.771 17.7932 18.7825 18.7825C17.794 19.7718 16.6298 20.5553 15.29 21.1332C13.9502 21.7111 12.5202 22 11 22C9.47981 22 8.04981 21.7111 6.71001 21.1332C5.37021 20.5553 4.20604 19.7718 3.21751 18.7825C2.22898 17.7932 1.44505 16.6291 0.865714 15.29C0.286381 13.9509 -0.0021869 12.5209 1.43131e-05 11C0.00221362 9.47907 0.291147 8.04907 0.866813 6.71C1.44248 5.37094 2.22604 4.20677 3.21751 3.2175C4.20898 2.22824 5.37315 1.44431 6.71001 0.865706C8.04688 0.287106 9.47688 -0.00146212 11 4.7604e-06Z"
              fill="#959595"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;