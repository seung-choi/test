import { atom } from 'recoil';
import { DrawerState } from '@/types';

export const drawerState = atom<DrawerState>({
  key: 'drawerState',
  default: {
    openDrawer: null,
    selectedStore: '스타트 하우스',
    settingActiveTab: 'sales',
    menuSearchTerm: '',
    isReorderMode: false,
  },
});
