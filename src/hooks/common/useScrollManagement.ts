import { useEffect, useRef, RefObject } from 'react';

/**
 * Body scroll lock hook - 모달이나 drawer가 열릴 때 배경 스크롤 방지
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
};

/**
 * Horizontal scroll hook - ref를 사용한 가로 스크롤 관리
 */
export const useHorizontalScroll = () => {
  const handleScroll = (
    ref: RefObject<HTMLDivElement>,
    direction: 'left' | 'right',
    scrollAmount: number = 300
  ) => {
    if (ref.current) {
      const newScrollLeft = direction === 'left'
        ? ref.current.scrollLeft - scrollAmount
        : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return { handleScroll };
};

/**
 * Scroll to top hook - 컴포넌트 마운트 시 스크롤 최상단으로 이동
 */
export const useScrollToTop = (dependency?: any) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dependency]);
};

/**
 * Scroll position tracking hook - 스크롤 위치 추적
 */
export const useScrollPosition = () => {
  const scrollPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = {
        x: window.pageXOffset,
        y: window.pageYOffset,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPositionRef;
};
