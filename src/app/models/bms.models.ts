export enum UserTypes {
  SUPER_ADMIN = 1,
  RESTAURANT_ADMIN = 2,
  MANAGER = 3,
  WAITER = 4,
  KITCHEN = 5,
  CASHIER = 6,
  CUSTOMER = 7,
}

export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Served' | 'Completed' | 'Cancelled';
export type OrderType = 'DineIn' | 'TakeAway' | 'Delivery';
export type FoodTableType = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning';

export enum FoodTableTypeEnum {
  Available = 1,
  Reserved = 2,
  Occupied = 3,
  Cleaning = 4
}

export enum OrderStatusEnum {
  Pending = 1,
  Accepted = 2,
  Preparing = 3,
  Ready = 4,
  Served = 5,
  Completed = 6,
  Cancelled = 7
}


export enum OrderTypeEnum {
  DineIn = 1,
  TakeAway = 2,
  Delivery = 3
}

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

export class DataTableRequest {
  limit = 50;
  count!: number;
  offset = 0;
  orderBy!: string;
  orderDir = 'desc';
  pageSize = 10;
  filter!: string;
  pageLimits: number[] = [10, 20, 30, 40, 50];
  filterObj: Record<string, unknown> = { IsActive: true };
  methodName!: string;

  constructor(init?: Partial<DataTableRequest>) {
    Object.assign(this, init);
  }

  reset(): void {
    this.offset = 0;
  }
}

export type DataTableRequestModel = DataTableRequest;

export interface BaseModel {
  Id?: number;
  IsActive: boolean;
  TotalRecord?: number;
  fIds?: number[];
  FreeTextSearch?: string;
  DataTableRequestModel?: DataTableRequest;
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
  TableStatus: FoodTableTypeEnum;
  BookTime: string;
  Name: string;
}

export interface OrderModel extends BaseModel {
  UserId: number;
  CustomerId?: number | null;
  CustomerName?: string | null;
  FoodTableId?: number | null;
  OrderStatus?: OrderStatusEnum;
  OrderType?: OrderTypeEnum;
  OrderDate: string;
  Notes?: string | null;
  OrderItemModels?: OrderItemModel[];
}

export interface OrderItemModel extends BaseModel {
  Quantity: number;
  FoodId?: number;
  Notes?: string | null;
  OrderId: number;
  OrderStatus?: OrderStatusEnum;
  FoodTableId: number;
}

export interface UserModel extends BaseModel {
  UserType: UserTypes;
  Name: string;
  Email?: string | null;
  Mobile: string;
  Password: string;
}

export interface LoginRequestModel {
  Email: string;
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
  Data?: unknown;
  DataVersion?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface DataTableResponse<T> {
  Data: T[];
  TotalRecord: number;
  DynamicGrid?: boolean;
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
