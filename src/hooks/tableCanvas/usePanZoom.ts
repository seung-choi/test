import { useState, useCallback, useEffect, useRef } from 'react';
import type { PanPosition, PanZoomOptions } from '@/types';

const DEFAULT_IGNORE_SELECTORS = [
    'button',
    '[draggable]',
    'input',
    'select',
    'textarea',
    'a',
    '[data-table-item]',
    '[data-no-pan]'
];

export const usePanZoom = (options: PanZoomOptions = {}) => {
    const {
        enabled = true,
        enableWheel = true,
        enableZoom = true,
        allowMiddleButton = true,
        ignoreSelectors = DEFAULT_IGNORE_SELECTORS,
    } = options;
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState<PanPosition>({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState<PanPosition>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = useCallback(() => {
        if (!enableZoom) return;
        setZoom(prev => Math.min(prev + 0.1, 3));
    }, [enableZoom]);

    const handleZoomOut = useCallback(() => {
        if (!enableZoom) return;
        setZoom(prev => Math.max(prev - 0.1, 0.3));
    }, [enableZoom]);

    const handleZoomReset = useCallback(() => {
        if (enableZoom) {
            setZoom(1);
        }
        setPan({ x: 0, y: 0 });
    }, [enableZoom]);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!enableWheel || !enableZoom) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
    }, [enableWheel, enableZoom]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!enabled) return;
        const target = e.target as HTMLElement;
        const isInteractiveElement = ignoreSelectors.some((selector) => Boolean(target.closest(selector)));

        if (!isInteractiveElement && e.button === 0) {
            e.preventDefault();
            setIsPanning(true);
            setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        } else if (allowMiddleButton && e.button === 1) {
            e.preventDefault();
            setIsPanning(true);
            setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    }, [enabled, ignoreSelectors, allowMiddleButton, pan]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isPanning) {
            const newX = e.clientX - startPan.x;
            const newY = e.clientY - startPan.y;

            setPan({
                x: newX,
                y: newY
            });
        }
    }, [isPanning, startPan]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    useEffect(() => {
        if (!enabled) return;
        const container = containerRef.current;
        if (!container) return;

        if (enableWheel && enableZoom) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            if (enableWheel && enableZoom) {
                container.removeEventListener('wheel', handleWheel);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [enabled, enableWheel, enableZoom, handleWheel, handleMouseMove, handleMouseUp]);

    return {
        zoom,
        pan,
        isPanning,
        containerRef,
        setPan,
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        handleMouseDown
    };
};
