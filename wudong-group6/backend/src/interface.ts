/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

/**
 * @description Pagination parameters
 */
export interface IPageParams {
  page?: number;
  pageSize?: number;
}

/**
 * @description Pagination result
 */
export interface IPageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * @description Unified API response
 */
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
}

/**
 * @description Login parameters
 */
export interface ILoginParams {
  username: string;
  password: string;
}

/**
 * @description JWT token payload
 */
export interface IJwtPayload {
  id: number;
  username: string;
  type: 'admin' | 'merchant';
}
