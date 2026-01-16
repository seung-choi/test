import type { Dispatch, SetStateAction } from 'react';
import type { LayoutPage } from '@/types/admin/layout.type';

export interface UseTableManagementProps {
  pages: LayoutPage[];
  setPages: Dispatch<SetStateAction<LayoutPage[]>>;
  currentPageId: string;
}
