import { atom } from 'recoil';

export type DrawerType = 'menu' | 'setting' | null;
export type SettingTab = 'sales' | 'layout';

export interface DrawerState {
  openDrawer: DrawerType;
  selectedStore: string;
  settingActiveTab: SettingTab;
  menuSearchTerm: string;
  isReorderMode: boolean;
}

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
