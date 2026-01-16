export interface TableRowData {
  id: string | number;
  name?: string;
  customerNames?: string;
  groupName?: string;
  [key: string]: string | number | string[] | boolean | undefined;
}
