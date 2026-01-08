import { useEffect, useRef, RefObject } from 'react';

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

export const useHorizontalScroll = () => {
  const handleScroll = (
    ref: RefObject<HTMLDivElement>,
    direction: 'left' | 'right',
    scrollAmount: number = 500
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

export const useScrollToTop = (dependency?: any) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dependency]);
};

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
