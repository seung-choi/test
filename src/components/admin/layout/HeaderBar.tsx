'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from '@/styles/components/admin/layout/HeaderBar.module.scss';
import { useHorizontalScroll } from '@/hooks/common/useScrollManagement';
import { useGolferPositions, type GolferPositionData } from '@/hooks/api/useBookingList';
import { useShopInfo } from '@/hooks/api/useShopInfo';

interface HeaderBarProps {
  onExpandedChange?: (isExpanded: boolean) => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onExpandedChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [firstCourseScrolled, setFirstCourseScrolled] = useState(false);
  const [secondCourseScrolled, setSecondCourseScrolled] = useState(false);
  const [firstCourseCanScrollRight, setFirstCourseCanScrollRight] = useState(false);
  const [secondCourseCanScrollRight, setSecondCourseCanScrollRight] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  const firstCourseScheduleRef = useRef<HTMLDivElement>(null);
  const secondCourseScheduleRef = useRef<HTMLDivElement>(null);
  const { handleScroll } = useHorizontalScroll();

  const { courses, isLoading: isClubLoading } = useShopInfo();

  const { golferPositions, isLoading, error } = useGolferPositions({
    refetchInterval: 5000,
  });

  const toggleExpanded = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newExpanded = !isExpanded;
    setIsExpanded(prev => !prev);
    onExpandedChange?.(newExpanded);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, isExpanded, onExpandedChange]);

  const handleFirstCourseScroll = useCallback(() => {
    if (firstCourseScheduleRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = firstCourseScheduleRef.current;
      setFirstCourseScrolled(scrollLeft > 0);
      setFirstCourseCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  }, []);

  const handleSecondCourseScroll = useCallback(() => {
    if (secondCourseScheduleRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = secondCourseScheduleRef.current;
      setSecondCourseScrolled(scrollLeft > 0);
      setSecondCourseCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  }, []);

  const firstCourse = courses[0];
  const secondCourse = courses[1];

  const HOLE_GAP_REM = 1.875;

  const calculateHoleWidth = (
    holeWth: number,
    totalWth: number,
    holesCount: number
  ): string => {
    const percentage = (holeWth / totalWth) * 100;
    const gapPerHole = (HOLE_GAP_REM * (holesCount - 1)) / holesCount;
    return `calc(${percentage.toFixed(4)}% - ${gapPerHole.toFixed(4)}rem)`;
  };

  const firstCourseTotalWth = firstCourse?.holes.reduce((sum, hole) => sum + hole.holeWth, 0) || 1;
  const secondCourseTotalWth = secondCourse?.holes.reduce((sum, hole) => sum + hole.holeWth, 0) || 1;

  const firstCourseScheduleData = firstCourse
    ? golferPositions.filter(
        (golfer) => golfer.outCourse.toUpperCase() === firstCourse.courseNm.toUpperCase()
      )
    : [];

  const secondCourseScheduleData = secondCourse
    ? golferPositions.filter(
        (golfer) => golfer.outCourse.toUpperCase() === secondCourse.courseNm.toUpperCase()
      )
    : [];

  useEffect(() => {
    handleFirstCourseScroll();
  }, [firstCourseScheduleData.length, handleFirstCourseScroll]);

  useEffect(() => {
    handleSecondCourseScroll();
  }, [secondCourseScheduleData.length, handleSecondCourseScroll]);

  const renderStatusIndicator = (isGroup: boolean, courseColor: string) => {
    if (isGroup) {
      return (
        <div
          className={styles.statusIconLarge}
          style={{
            background: `${courseColor}80`,
            outlineColor: courseColor,
          }}
        >
          <div
            className={styles.statusIconLargeInner}
            style={{ background: courseColor }}
          />
        </div>
      );
    }
    return (
      <div
        className={styles.statusIcon}
        style={{ background: courseColor }}
      />
    );
  };

  const getCourseColor = (courseName: string): string => {
    const course = courses.find(c => c.courseNm.toUpperCase() === courseName.toUpperCase());
    return course?.courseCol || '#9081D8';
  };

  const renderGolferCard = (golfer: GolferPositionData) => {
    const courseColor = getCourseColor(golfer.outCourse);
    const borderColor = golfer.bookingsCol || courseColor;

    return (
      <div
        key={golfer.bookingId}
        className={styles.golferPosition}
        style={{
          left: golfer.position.left,
        }}
      >
        <div
          className={styles.golferCard}
          style={{
            border: golfer.isGroup ? `0.125rem solid ${borderColor}` : 'none',
          }}
        >
          <div className={styles.golferName}>
            {golfer.bookingNm}
          </div>
          <div className={styles.golferStatusContainer}>
            {golfer.isGroup ? (
              <div className={styles.golferStatusAlert}>
                <div
                  className={styles.golferStatusBackground}
                  style={{
                    backgroundColor: `${courseColor}80`,
                    outlineColor: courseColor,
                  }}
                />
                <div
                  className={styles.golferStatusIcon}
                  style={{ backgroundColor: courseColor }}
                />
              </div>
            ) : (
              <div
                className={styles.golferStatusNormal}
                style={{ backgroundColor: courseColor }}
              />
            )}
          </div>
          <div className={styles.golferTime}>
            {golfer.bookingTm}
          </div>
        </div>
      </div>
    );
  };

  const getGolfersForHole = (holeNumber: number, courseNm: string) => {
    if (!golferPositions || golferPositions.length === 0) return [];

    return golferPositions.filter(golfer =>
      golfer.holeNo === holeNumber &&
      golfer.course.toUpperCase() === courseNm.toUpperCase()
    );
  };

  const getHeaderContainerClass = () => {
    let classes = [styles.headerContainer];

    if (!isExpanded) {
      classes.push(styles.collapsed);
    } else {
      classes.push(styles.expanded);
    }

    if (isAnimating) {
      classes.push(styles.animating);
    }

    return classes.join(' ');
  };

  const getCourseScheduleData = (courseName: string) => {
    return golferPositions.filter(
      (golfer) => golfer.outCourse.toUpperCase() === courseName.toUpperCase()
    );
  };

  const renderCourseSummary = (course: typeof courses[0]) => {
    const scheduleData = getCourseScheduleData(course.courseNm);
    const waitingCount = scheduleData.length;
    const isHovered = hoveredCourse === course.courseNm;

    return (
      <div
        key={course.courseId}
        className={styles.courseSummaryItem}
        onMouseEnter={() => setHoveredCourse(course.courseNm)}
        onMouseLeave={() => setHoveredCourse(null)}
      >
        <div className={styles.courseSummaryHeader}>
          <div
            className={styles.courseSummaryButton}
            style={{
              backgroundColor: course.courseCol ? `${course.courseCol}33` : 'rgba(219, 0, 0, 0.20)',
              outlineColor: course.courseCol || '#CE0A0A',
            }}
          >
            {course.courseNm}
          </div>
          <div
            className={styles.courseSummaryWaiting}
            style={{
              borderBottomColor: course.courseCol || '#DC0000',
            }}
          >
            {waitingCount}팀 대기
          </div>
        </div>

        {isHovered && scheduleData.length > 0 && (
          <div className={styles.courseSummaryPopover}>
            <div className={styles.courseSummaryPopoverContent}>
              {scheduleData.map((schedule) => (
                <div key={schedule.bookingId} className={styles.courseSummaryScheduleItem}>
                  <div className={styles.statusIndicator}>
                    {renderStatusIndicator(schedule.isGroup, getCourseColor(schedule.outCourse))}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{schedule.bookingNm}</div>
                  </div>
                  <div className={styles.timeInfo}>
                    <div className={styles.timeText}>{schedule.bookingTm}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderScheduleRow = (
    scheduleData: GolferPositionData[],
    scrollRef: React.RefObject<HTMLDivElement>,
    isScrolled: boolean,
    canScrollRight: boolean,
    onScroll: () => void
  ) => (
    <div className={styles.scheduleRow}>
      {scheduleData.length > 0 && isScrolled && (
        <img
          src="/assets/image/global/arrow/arrow-sm.svg"
          alt="arrow-left"
          onClick={() => handleScroll(scrollRef, 'left')}
          style={{
            cursor: 'pointer',
            transform: 'rotate(180deg)',
          }}
        />
      )}
      <div
        className={styles.scheduleItems}
        ref={scrollRef}
        onScroll={onScroll}
      >
        {scheduleData.length > 0 ? (
          scheduleData.map((schedule) => (
            <div key={schedule.bookingId} className={styles.scheduleItem}>
              <div className={styles.statusIndicator}>
                {renderStatusIndicator(schedule.isGroup, getCourseColor(schedule.outCourse))}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{schedule.bookingNm}</div>
              </div>
              <div className={styles.timeInfo}>
                <div className={styles.timeText}>{schedule.bookingTm}</div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.scheduleItem}>
            <div className={styles.userName}>대기 인원이 없습니다</div>
          </div>
        )}
      </div>
      {scheduleData.length > 0 && canScrollRight && (
        <img
          src="/assets/image/global/arrow/arrow-sm.svg"
          alt="arrow-right"
          onClick={() => handleScroll(scrollRef, 'right')}
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  );

  const ToggleIcon = ({ isExpanded }: { isExpanded: boolean }) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.toggleIcon} ${!isExpanded ? styles.rotated : ''}`}
    >
      <path
        d="M11 7.7L6.60001 12.1L15.4 12.1L11 7.7ZM11 4.7604e-06C12.5217 4.89342e-06 13.9517 0.288938 15.29 0.866805C16.6283 1.44467 17.7925 2.22824 18.7825 3.2175C19.7725 4.20677 20.5561 5.37094 21.1332 6.71C21.7103 8.04907 21.9993 9.47907 22 11C22.0007 12.5209 21.7118 13.9509 21.1332 15.29C20.5546 16.6291 19.771 17.7932 18.7825 18.7825C17.794 19.7718 16.6298 20.5553 15.29 21.1332C13.9502 21.7111 12.5202 22 11 22C9.47981 22 8.04981 21.7111 6.71001 21.1332C5.37021 20.5553 4.20604 19.7718 3.21751 18.7825C2.22898 17.7932 1.44505 16.6291 0.865714 15.29C0.286381 13.9509 -0.0021869 12.5209 1.43131e-05 11C0.00221362 9.47907 0.291147 8.04907 0.866813 6.71C1.44248 5.37094 2.22604 4.20677 3.21751 3.2175C4.20898 2.22824 5.37315 1.44431 6.71001 0.865706C8.04688 0.287106 9.47688 -0.00146212 11 4.7604e-06Z"
        fill="#959595"
      />
    </svg>
  );

  if (!isExpanded) {
    return (
      <div className={getHeaderContainerClass()}>
        <div className={styles.collapsedHeader}>
          <button
            className={styles.toggleButton}
            onClick={toggleExpanded}
            aria-label="헤더 펼치기"
            disabled={isAnimating}
          >
            <ToggleIcon isExpanded={isExpanded} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={getHeaderContainerClass()}>
      <div className={styles.expandedHeader}>
        <div className={styles.headerContent}>
          <div className={styles.courseSection}>
            <div className={styles.courseSectionWrapper}>
              {firstCourse?.holes.map((hole) => (
                <div
                  key={hole.holeId}
                  className={styles.holeTag}
                  style={{
                    position: 'relative',
                    width: calculateHoleWidth(hole.holeWth, firstCourseTotalWth, firstCourse.holes.length),
                  }}
                >
                  <span className={styles.holeText}>{hole.holeNo}H</span>
                  {getGolfersForHole(hole.holeNo, firstCourse.courseNm).map(renderGolferCard)}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.centerSection}>
            <div
              className={styles.courseButton}
              style={{
                backgroundColor: firstCourse?.courseCol
                  ? `${firstCourse.courseCol}33`
                  : 'rgba(212, 43, 43, 0.20)',
                borderColor: firstCourse?.courseCol || '#D42B2B',
              }}
            >
              {firstCourse?.courseNm || '코스 1'}
            </div>

            <div className={styles.startHouse}>
              <div className={styles.startHouseTitle}>
                <img src='/assets/image/admin/layout/header/home.svg' alt="start-house" />
              </div>
            </div>

            <div
              className={styles.courseButton}
              style={{
                backgroundColor: secondCourse?.courseCol
                  ? `${secondCourse.courseCol}33`
                  : 'rgba(255, 213, 0, 0.20)',
                borderColor: secondCourse?.courseCol || '#FFD500',
              }}
            >
              {secondCourse?.courseNm || '코스 2'}
            </div>
          </div>

          <div className={styles.courseSection}>
            <div className={styles.courseSectionWrapper}>
              {secondCourse?.holes.slice().reverse().map((hole) => (
                <div
                  key={hole.holeId}
                  className={styles.holeTag}
                  style={{
                    position: 'relative',
                    width: calculateHoleWidth(hole.holeWth, secondCourseTotalWth, secondCourse.holes.length),
                  }}
                >
                  <span className={styles.holeText}>{hole.holeNo}H</span>
                  {getGolfersForHole(hole.holeNo, secondCourse.courseNm).map(renderGolferCard)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {courses.length >= 3 ? (
          <div className={styles.courseSummarySection}>
            {courses.map((course) => renderCourseSummary(course))}
          </div>
        ) : (
          <div className={styles.scheduleSection}>
            {renderScheduleRow(
              firstCourseScheduleData,
              firstCourseScheduleRef,
              firstCourseScrolled,
              firstCourseCanScrollRight,
              handleFirstCourseScroll
            )}

            <div className={styles.spacer} />

            {renderScheduleRow(
              secondCourseScheduleData,
              secondCourseScheduleRef,
              secondCourseScrolled,
              secondCourseCanScrollRight,
              handleSecondCourseScroll
            )}
          </div>
        )}

        <button
          className={styles.toggleButton}
          onClick={toggleExpanded}
          aria-label="헤더 접기"
        >
          <ToggleIcon isExpanded={isExpanded} />
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
