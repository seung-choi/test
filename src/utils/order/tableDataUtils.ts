import type { TableWHP, TableXYR } from '@/types';

export const parseTableXYR = (value?: string | null): TableXYR => {
  const [x, y, r] = (value ?? '0,0,0').split(',').map(Number);
  return {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
    r: Number.isFinite(r) ? r : 0
  };
};

export const parseTableWHP = (value?: string | null): TableWHP => {
  const [w, h, p] = (value ?? '1920,1080,1').split(',').map(Number);
  return {
    w: Number.isFinite(w) ? w : 1920,
    h: Number.isFinite(h) ? h : 1080,
    p: Number.isFinite(p) ? p : 1
  };
};
