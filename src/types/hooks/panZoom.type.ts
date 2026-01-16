export interface PanPosition {
  x: number;
  y: number;
}

export interface PanZoomOptions {
  enabled?: boolean;
  enableWheel?: boolean;
  enableZoom?: boolean;
  allowMiddleButton?: boolean;
  ignoreSelectors?: string[];
}
