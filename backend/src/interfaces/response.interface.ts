export interface IResponse<T = any> {
  status: string;
  code: number;
  message: string;
  data?: T;
  error?: any;
}

export interface IPagination<T = any> extends IResponse<T>{
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  }
}