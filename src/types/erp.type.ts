export interface ErpProduct {
  id: string;
  category: string;
  code: string;
  name: string;
  price: number;
}

export type ErpSearchType = '상품 코드' | '상품명';
