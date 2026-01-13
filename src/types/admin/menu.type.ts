import { MenuStatus } from '@/constants/admin/menuStatus';

export interface MenuTableRow {
  id: number;
  store: string;
  image?: string;
  code?: string;
  categoryId?: number;
  category?: string;
  name?: string;
  price: number;
  tags?: string[];
  cookingTime: number;
  status: MenuStatus;
  channels?: string[];
  types?: string[];
  registerDate: string;
  [key: string]: string | number | string[] | boolean | undefined | MenuStatus;
}
