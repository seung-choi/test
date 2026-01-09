import { MenuStatus } from '@/constants/admin/menuStatus';

export interface MenuTableRow {
  id: number;
  store: string;
  image?: string;
  code?: string;
  category?: string;
  name?: string;
  price: number;
  tags?: string[];
  cookingTime: number;
  status: MenuStatus;
  channels?: string[];
  types?: string[];
  registerDate: string;
}
