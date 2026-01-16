import type { CSSProperties, ReactNode, RefObject } from 'react';
import type { Bill, BillOrder } from '@/types/bill.type';
import type { GpsBookingType } from '@/types/booking.type';
import type { CustomerInfo, OrderHistory, OrderItemSummary, OrderCounts } from '@/types/admin/orderInfo.type';
import type { TableOption } from '@/types/admin/tableSelection.type';
import type { SalesFilter, SalesStats } from '@/types/admin/setting.types';
import type { CancelReason, DeleteItem } from '@/types/admin/modal.type';
import type { ErpProduct } from '@/types/erp.type';
import type { TableRowData } from '@/types';
import type { PlacedTable, TableType } from '@/types/admin/layout.type';
import type { GetTableResponse } from '@/api/table';
import type { BillOrderStatus } from '@/types/bill.type';
import type { ProductFormData } from '@/types/admin/modal.type';
import type { ErpLinkSelection } from '@/types/admin/modal.type';
import type { NotificationOption } from '@/hooks/common/useNotificationStorage';
import type { MessageFormData } from '@/types/message.type';

export interface InfoCardProps {
  bill: Bill;
  booking?: GpsBookingType;
  onAcceptOrder?: (tableId: number | null) => void;
  onCancelOrder?: () => void;
  onCompleteOrder?: () => void;
  onMessageOrder?: () => void;
  availableTables?: TableOption[];
}

export interface InfoCardHeaderProps {
  tableNumber: string;
  realTimeLocation: string;
  selectedTable: string | null;
  isDropdownOpen: boolean;
  isDisabledStatus: boolean;
  availableTables: TableOption[];
  onToggleDropdown: () => void;
  onSelectTable: (table: TableOption) => void;
}

export interface CustomerInfoSectionProps {
  customerInfo: CustomerInfo;
  tags: string[];
  onMessageClick?: () => void;
}

export interface OrderItemsListProps {
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  orderItems: OrderItemSummary[];
  orderPlayerName?: string | null;
  orderCourseName?: string | null;
  orderHoleNo?: number | null;
  specialRequest?: string;
  status: BillOrderStatus;
}

export interface OrderHistorySectionProps {
  orderHistory: OrderHistory[];
  isExpanded: (historyId: string) => boolean;
  onToggleExpansion: (historyId: string) => void;
}

export interface InfoCardActionsProps {
  status: BillOrderStatus;
  cancelReason?: string;
  totalAmount?: number;
  selectedTableId?: number | null;
  onAcceptOrder?: (tableId: number | null) => void;
  onCancelOrder?: () => void;
  onCompleteOrder?: () => void;
}

export interface SideTabProps {
  orderCounts: OrderCounts;
  onFilterChange: (filter: BillOrderStatus) => void;
  hasNotification?: boolean;
  onMessageNotificationClear?: () => void;
}

export interface HeaderBarProps {
  onExpandedChange?: (isExpanded: boolean) => void;
}

export interface FilterSectionProps {
  activeFilter: BillOrderStatus;
  orderCounts: OrderCounts;
  hasNotification: boolean;
  onFilterChange: (filter: BillOrderStatus) => void;
}

export interface MenuSectionProps {
  notificationOption: NotificationOption;
  isTablet?: boolean;
  hasMenuNotification?: boolean;
  onMenuClick: () => void;
  onSettingClick: () => void;
  onNotificationChange: (option: NotificationOption) => void;
  onFullscreenToggle: () => void;
  onMessageNotificationClear?: () => void;
}

export interface NotificationButtonProps {
  notificationOption: NotificationOption;
  isTablet?: boolean;
  onOptionChange: (option: NotificationOption) => void;
}

export interface MessageButtonProps {
  hasNotification?: boolean;
  isTablet?: boolean;
  onNotificationClear?: () => void;
}

export interface MessageIconProps {
  hasNotification?: boolean;
  isActive?: boolean;
  size?: number;
}

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLDivElement>;
}

export interface SalesFilterActionBarProps {
  filter: SalesFilter;
  onFilterChange: (filter: SalesFilter) => void;
  stats: SalesStats;
  onExportExcel: () => void;
}

export interface ModalWrapperProps {
  isShow: boolean;
  onClose: () => void;
  enableOverlayClick?: boolean;
  children: ReactNode;
}

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  style?: CSSProperties;
  render?: (value: string | number | string[] | boolean | undefined, row: TableRowData) => ReactNode;
}

export interface SortableRowProps {
  row: TableRowData;
  columns: TableColumn[];
  isReorderMode?: boolean;
}

export interface TableProps {
  columns: TableColumn[];
  data: TableRowData[];
  variant?: 'default' | 'menu' | 'sales';
  onSort?: (key: string) => void;
  className?: string;
  isReorderMode?: boolean;
}

export type DrawerMode = 'setting' | 'menu';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  hasBackgroundImage?: boolean;
  mode?: DrawerMode;
  hasSelectedItems?: boolean;
  onDelete?: () => void;
  onReorderCommit?: () => void;
}

export interface CommonModalLayoutProps {
  title: string;
  children: ReactNode;
  buttons?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerRight?: ReactNode;
}

export interface MenuManagementProps {
  onClose: () => void;
  onDelete?: (selectedItems: string[]) => void;
  onSelectionChange?: (hasSelection: boolean) => void;
}

export interface LayoutTabsProps {
  activeTab: 'table' | 'list';
  onTabChange: (tab: 'table' | 'list') => void;
  onSave?: () => void;
}

export interface TableNumberListProps {
  linkedNumbers?: string[];
}

export interface TableWithPage extends PlacedTable {
  pageName?: string;
}

export interface TableListViewProps {
  placedTables: TableWithPage[];
  tableList?: GetTableResponse[];
  onReorderPlacedTables?: (reorderedTables: PlacedTable[]) => void;
  onReorderTableList?: (reorderedTables: GetTableResponse[]) => void;
}

export interface DraggableTableItemProps {
  table: PlacedTable;
  onMove: (tableId: string, position: { x: number; y: number }, targetPageId?: string) => void;
  onRemove: (tableId: string) => void;
  onSetTableNumber: (tableId: string, tableNumber: string) => void;
  onRotate: (tableId: string) => void;
  placedTables: PlacedTable[];
  pageId?: string;
  getPlacedTablesByPageId?: (pageId?: string) => PlacedTable[];
  availableTableNumbers: string[];
}

export interface PageNavigationProps {
  pages: { id: string; name: string }[];
  currentPageId: string;
  onPageSelect: (pageId: string) => void;
  onPageAdd: () => void;
  onPageDelete: (pageId: string) => void;
}

export interface ControlPanelProps {
  pages: { id: string; name: string }[];
  onPageAdd: () => void;
  onPageDelete: () => void;
}

export interface LayoutCanvasProps {
  pageId?: string;
  placedTables: PlacedTable[];
  onAddTable: (type: TableType, position: { x: number; y: number }, pageId?: string) => void;
  onMoveTable: (tableId: string, position: { x: number; y: number }, sourcePageId?: string, targetPageId?: string) => void;
  onRemoveTable: (tableId: string, pageId?: string) => void;
  onSetTableNumber: (tableId: string, tableNumber: string, pageId?: string) => void;
  onRotateTable: (tableId: string, pageId?: string) => void;
  availableTableNumbers: string[];
  onSelect?: (pageId?: string) => void;
  getPlacedTablesByPageId?: (pageId?: string) => PlacedTable[];
}

export interface CancelReasonModalContentProps {
  onConfirm: (payload: { reason: string; orderIdList: number[] }) => void;
  onClose: () => void;
  orderList?: BillOrder[];
  isOrderSelectionRequired?: boolean;
}

export interface CancelReasonManagementModalContentProps {
  initialReasons?: CancelReason[];
  onSubmit: (reasons: CancelReason[]) => void;
  onClose: () => void;
}

export interface ErpLinkModalContentProps {
  onLinkErp: (selection: ErpLinkSelection) => void;
  onManual: () => void;
  onClose: () => void;
}

export interface ConfirmModalContentProps {
  title?: string;
  desc: string;
  okBtnLabel?: string;
  cancelBtnLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ErpSearchModalContentProps {
  onSelect: (product: ErpProduct) => void;
  onClose: () => void;
}

export interface CategoryModalContentProps {
  onClose: () => void;
}

export interface ProductModalContentProps {
  mode: 'create' | 'edit';
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onClose: () => void;
}

export interface ImageUploadProps {
  image?: File | string;
  onChange: (file: File) => void;
}

export interface TagSelectorProps {
  selectedTags: string[];
  onToggle: (tag: string) => void;
  maxTags?: number;
}

export interface TimeControlProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

export interface MessageModalContentProps {
  title: string;
  recipients?: string[];
  bookingId?: number | null;
  onSubmit: (data: MessageFormData) => void;
  onClose: () => void;
}

export interface DeleteConfirmModalContentProps {
  items: DeleteItem[];
  onConfirm: () => void;
  onClose: () => void;
}
