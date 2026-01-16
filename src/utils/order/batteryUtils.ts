export const getBatteryColor = (level: number): string => {
  if (level <= 20) return '#FF1212';
  if (level <= 50) return '#FFA500';
  return '#00FF00';
};

export const getBatteryWidth = (level: number, maxWidth: number = 18): number => {
  return Math.max(0, Math.min(maxWidth, (level / 100) * maxWidth));
};
