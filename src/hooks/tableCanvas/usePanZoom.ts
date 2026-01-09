import { useState, useCallback, useEffect, useRef } from 'react';

interface PanPosition {
    x: number;
    y: number;
}

export const usePanZoom = () => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState<PanPosition>({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState<PanPosition>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.1, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.1, 0.3));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
        }
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        const isInteractiveElement = target.closest('button') ||
                                     target.closest('[draggable]') ||
                                     target.closest('input') ||
                                     target.closest('select') ||
                                     target.hasAttribute('data-table-item');

        if (!isInteractiveElement && e.button === 0) {
            e.preventDefault();
            setIsPanning(true);
            setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        } else if (e.button === 1) {
            e.preventDefault();
            setIsPanning(true);
            setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    }, [pan]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isPanning) {
            const newX = e.clientX - startPan.x;
            const newY = e.clientY - startPan.y;

            // 마이너스 방지
            const clampedX = Math.max(0, newX);
            const clampedY = Math.max(0, newY);

            setPan({
                x: clampedX,
                y: clampedY
            });
        }
    }, [isPanning, startPan]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleWheel, handleMouseMove, handleMouseUp]);

    return {
        zoom,
        pan,
        isPanning,
        containerRef,
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        handleMouseDown
    };
};
