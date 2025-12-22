'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/common/DateRangePicker.module.scss';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  isOpen,
  onClose,
  triggerRef
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate ? new Date(startDate) : null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate ? new Date(endDate) : null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // 월요일을 0으로
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (selectingStart) {
      setTempStartDate(selectedDate);
      setTempEndDate(null);
      setSelectingStart(false);
    } else {
      if (tempStartDate && selectedDate < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(selectedDate);
      } else {
        setTempEndDate(selectedDate);
      }

      const finalStartDate = tempStartDate && selectedDate < tempStartDate ? selectedDate : tempStartDate;
      const finalEndDate = tempStartDate && selectedDate < tempStartDate ? tempStartDate : selectedDate;

      if (finalStartDate && finalEndDate) {
        onDateChange(formatDate(finalStartDate), formatDate(finalEndDate));
        setSelectingStart(true);
        onClose();
      }
    }
  };

  const isDateInRange = (day: number) => {
    if (!tempStartDate || !tempEndDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= tempStartDate && date <= tempEndDate;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = formatDate(date);
    return (tempStartDate && formatDate(tempStartDate) === dateStr) ||
           (tempEndDate && formatDate(tempEndDate) === dateStr);
  };

  const isRangeStart = (day: number, dayIndex: number, isCurrentMonth: boolean) => {
    if (!tempStartDate || !tempEndDate || !isCurrentMonth) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    // 실제 시작일이면 true
    if (formatDate(date) === formatDate(tempStartDate)) return true;

    // 범위 내에 있고, 해당 주의 첫 번째 날(월요일)이면 true
    if (dayIndex === 0 && date > tempStartDate && date <= tempEndDate) return true;

    return false;
  };

  const isRangeEnd = (day: number, dayIndex: number, isCurrentMonth: boolean) => {
    if (!tempStartDate || !tempEndDate || !isCurrentMonth) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    // 실제 종료일이면 true
    if (formatDate(date) === formatDate(tempEndDate)) return true;

    // 범위 내에 있고, 해당 주의 마지막 날(일요일)이면 true
    if (dayIndex === 6 && date >= tempStartDate && date < tempEndDate) return true;

    return false;
  };

  const getWeekday = (dayIndex: number) => {
    return dayIndex >= 5; // 토요일(5), 일요일(6)
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const daysInPrevMonth = getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    const days = [];

    // 이전 달의 날짜들
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true
      });
    }

    // 다음 달의 날짜들 (42칸 채우기: 6주 * 7일)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false
      });
    }

    // 7x6 그리드로 구성
    const weeks = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(days.slice(i * 7, (i + 1) * 7));
    }

    return weeks;
  };

  if (!isOpen) return null;

  const weeks = renderCalendar();

  return (
    <div className={styles.calendarDropdown} ref={dropdownRef}>
      <div className={styles.calendarContainer}>
        <div className={styles.monthNavigation}>
          <div className={styles.arrowButton} onClick={handlePrevMonth}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 18L9.5 12L15.5 6" stroke="#959595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.monthLabel}>
            <div className={styles.monthText}>{currentMonth.getMonth() + 1}월</div>
          </div>
          <div className={styles.arrowButton} onClick={handleNextMonth}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
              <path d="M15.5 18L9.5 12L15.5 6" stroke="#959595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.calendarGrid}>
          <div className={styles.weekdayRow}>
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
              <div
                key={day}
                className={`${styles.weekday} ${getWeekday(index) ? styles.weekend : ''}`}
              >
                {day}
              </div>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.dateRow}>
              {week.map((dateInfo, dayIndex) => {
                const isWeekend = getWeekday(dayIndex);
                const isInRange = dateInfo.isCurrentMonth && isDateInRange(dateInfo.day);
                const isSelected = dateInfo.isCurrentMonth && isDateSelected(dateInfo.day);
                const isStart = isRangeStart(dateInfo.day, dayIndex, dateInfo.isCurrentMonth);
                const isEnd = isRangeEnd(dateInfo.day, dayIndex, dateInfo.isCurrentMonth);

                return (
                  <div
                    key={dayIndex}
                    className={`${styles.dateCell} ${
                      !dateInfo.isCurrentMonth ? styles.inactive : ''
                    } ${isInRange ? styles.inRange : ''} ${
                      isSelected ? styles.selected : ''
                    } ${isStart ? styles.rangeStart : ''} ${
                      isEnd ? styles.rangeEnd : ''
                    } ${isWeekend ? styles.weekend : ''}`}
                    onClick={() => handleDateClick(dateInfo.day, dateInfo.isCurrentMonth)}
                  >
                    <div className={styles.dateText}>{dateInfo.day}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
