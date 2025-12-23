export type DrawerType = 'menu' | 'setting' | null;
export type SettingTab = 'sales' | 'layout';

export interface DrawerState {
  openDrawer: DrawerType;
  selectedStore: string;
  settingActiveTab: SettingTab;
  menuSearchTerm: string;
  isReorderMode: boolean;
}
