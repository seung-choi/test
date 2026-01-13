import { useState, useLayoutEffect, useEffect, RefObject } from 'react';

interface ContainerSize {
  width: number;
  height: number;
}

export const useContainerSize = (
  containerRef: RefObject<HTMLDivElement>,
  isActive: boolean = true
): ContainerSize => {
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      setContainerSize({
        width: element.clientWidth,
        height: element.clientHeight
      });
    };

    updateSize();
  }, [containerRef]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      setContainerSize({
        width: element.clientWidth,
        height: element.clientHeight
      });
    };

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => updateSize());
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [containerRef]);

  useEffect(() => {
    if (!isActive) return;
    const element = containerRef.current;
    if (!element) return;

    const frameId = requestAnimationFrame(() => {
      setContainerSize({
        width: element.clientWidth,
        height: element.clientHeight
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [isActive, containerRef]);

  return containerSize;
};
