import { TableType } from '@/types';
import { BorderPosition } from './types';

interface BorderPositions {
  [key: string]: number[];
}

const BORDER_POSITIONS: Record<TableType, BorderPositions> = {
  T4S: {
    top: [23],
    bottom: [98],
    left: [98],
    right: [22]
  },
  T6R: {
    top: [22, 108],
    bottom: [97, 183],
    left: [98],
    right: [22]
  },
  T8S: {
    top: [22, 108],
    bottom: [97, 183],
    left: [98, 184],
    right: [22, 108]
  },
  T8R: {
    top: [22, 108, 194],
    bottom: [97, 183, 269],
    left: [98],
    right: [22]
  },
  T10R: {
    top: [22, 108, 194, 281],
    bottom: [98, 183, 269, 357],
    left: [98],
    right: [22]
  },
  T12R: {
    top: [22, 108, 194, 281, 367],
    bottom: [98, 183, 269, 357, 443],
    left: [98],
    right: [22]
  }
};

export const calculateBorderPositions = (
  type: TableType,
  scale: number
): BorderPosition[] => {
  const positions: BorderPosition[] = [];
  const config = BORDER_POSITIONS[type];

  Object.entries(config).forEach(([direction, values]) => {
    values.forEach((value, index) => {
      const isVertical = direction === 'left' || direction === 'right';
      positions.push({
        key: `${direction}${values.length > 1 ? index + 1 : ''}`,
        className: direction,
        left: isVertical ? 0 : value * scale,
        top: isVertical ? value * scale : undefined
      });
    });
  });

  return positions;
};
