import { atom } from 'recoil';

export type DrawerType = 'menu' | 'setting' | null;
export type SettingTab = 'sales' | 'layout';

export interface DrawerState {
  // 열린 drawer 타입
  openDrawer: DrawerType;

  // 선택된 매장
  selectedStore: string;

  // Setting Drawer 상태
  settingActiveTab: SettingTab;

  // Menu Drawer 상태
  menuSearchTerm: string;
}

export const drawerState = atom<DrawerState>({
  key: 'drawerState',
  default: {
    openDrawer: null,
    selectedStore: '스타트 하우스',
    settingActiveTab: 'sales',
    menuSearchTerm: '',
  },
});
