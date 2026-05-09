export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Served' | 'Completed' | 'Cancelled';
export type OrderType = 'DineIn' | 'TakeAway' | 'Delivery';
export type FoodTableType = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning';

export const orderStatusValues: readonly OrderStatus[] = [
  'Pending',
  'Accepted',
  'Preparing',
  'Ready',
  'Served',
  'Completed',
  'Cancelled',
];

export const orderTypeValues: readonly OrderType[] = ['DineIn', 'TakeAway', 'Delivery'];
export const foodTableTypeValues: readonly FoodTableType[] = ['Available', 'Reserved', 'Occupied', 'Cleaning'];

export interface BaseModel {
  Id: number;
  IsActive: boolean;
  TotalRecord?: number;
  fIds?: number[];
  FreeTextSearch?: string;
  DataTableRequestModel?: DataTableRequestModel;
}

export interface DataTableRequestModel {
  PageSize?: number;
  Limit?: number;
  Offset?: number;
  OrderDir?: 'ASC' | 'DESC' | string;
  OrderBy?: string;
  Filter?: string;
  FilterObj?: Record<string, unknown>;
  IsShowNoData?: boolean;
  ResponseForDataTable?: boolean;
  GetSetCache?: boolean;
}

export interface FoodCategoryModel extends BaseModel {
  Name: string;
}

export interface FoodModel extends BaseModel {
  Name: string;
  Description?: string | null;
  Price: number;
  FoodCategoryId: number;
}

export interface FoodTableModel extends BaseModel {
  TableStatus: FoodTableType;
  BookTime: string;
  Name: string;
}

export interface OrderModel extends BaseModel {
  UserId: number;
  OrderStatus: OrderStatus;
  OrderType: OrderType;
  OrderDate: string;
  Notes?: string | null;
}

export interface OrderItemModel extends BaseModel {
  Quantity: number;
  FoodId: number;
  Notes?: string | null;
  OrderId: number;
  OrderStatus: string;
  FoodTableId: number;
}

export interface UserModel extends BaseModel {
  Name: string;
  Email?: string | null;
  Mobile: string;
  Password: string;
}

export interface ApiSuccess<T> {
  Status: true;
  Message: string;
  Data: T;
  DataVersion: string;
}

export interface ApiError {
  Status: false;
  ErrorType?: number | string;
  Message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface DataTableResponse<T> {
  Data: T[];
  TotalRecord?: number;
}

export interface WeatherForecastModel {
  Date: string;
  TemperatureC: number;
  TemperatureF: number;
  Summary?: string | null;
}

export type BmsEntityName = 'FoodCategory' | 'Food' | 'FoodTable' | 'Order' | 'OrderItem' | 'User';

export type BmsEntityMap = {
  FoodCategory: FoodCategoryModel;
  Food: FoodModel;
  FoodTable: FoodTableModel;
  Order: OrderModel;
  OrderItem: OrderItemModel;
  User: UserModel;
};
