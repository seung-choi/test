export interface GetTableResponse {
  tableId: number;
  tableNo: string;
  tableCd: string | null;
  tableXyr: string | null;
  tableWhp: string | null;
  tableOrd: number;
  tableErp: string | null;
  tableDiv: string | null;
  createdDt?: string;
  modifiedDt?: string;
}

export interface PostTableRequest {
  tableNo: string;
  tableOrd: number;
}

export interface PutTableRequest {
  tableId: number;
  tableCd: string | null;
  tableXyr: string | null;
  tableWhp: string | null;
}

export interface PatchTableRequest {
  tableId: number;
  tableOrd: number;
}
