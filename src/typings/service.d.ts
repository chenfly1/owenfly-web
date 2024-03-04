/** 请求的相关类型 */
declare namespace Service {
  type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

  interface AxiosConfig {
    /** 请求类型 */
    contentType?: string;
    /** 是否显示Toast */
    useErrMsg?: boolean;
  }

  interface RequestParam<T = any> {
    url: string;
    method?: Service.RequestMethod;
    data?: T;
    axiosConfig?: Service.AxiosConfig;
  }

  interface PageResult<T = any> {
    list: Array<T>;
    pageNo: number;
    pageSize: number;
    totalPage: number;
  }
  /** 请求错误 */
  interface RequestError {
    /** 错误码 */
    errorCode: string | number;
    /** 错误信息 */
    message: string;
  }

  /** 后端接口返回的数据结构配置 */

  // "success": false,
  //   "code": 0,
  //   "msg": "请求成功/系统异常",
  //   "data": {}
  interface BackendResultConfig<T = any> {
    /** 表示后端请求状态码的属性字段 */
    code: string | number;
    /** 表示后端返回的数据结构 */
    data: T;
    /** 表示后端消息的属性字段 */
    message?: string;
    msg?: string;
    /** 表示后端返回的数据结构 */
  }

  /** 自定义的请求成功结果 */
  interface SuccessResult<T = any> {
    /** 请求错误 */
    error: null | RequestError;

    /** 请求数据 */
    success: null | T;
  }

  interface Result {
    code: string;
    msg: string;
  }

  /** 自定义的请求结果 */
  type RequestResult<T = any> = SuccessResult<T>;
}
