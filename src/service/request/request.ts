import { RequestEnum } from '@/enum';
import axios from './instansce';

/** 创建请求 */
export function createRequest() {
  async function asyncRequest<T, R = any>(param: Service.RequestParam<R>): Promise<Service.BackendResultConfig<T>> {
    const { url, method, axiosConfig, data } = param;
    return await axios<T, R>({
      method: method || 'GET',
      url,
      data,
      axiosConfig: axiosConfig || {
        useErrMsg: true
      }
    });
  }
  /**
   * get请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function get<T, R>(url: string, data?: R, config?: Service.AxiosConfig) {
    return asyncRequest<T, R>({ url, method: RequestEnum.GET, data, axiosConfig: config });
  }

  /**
   * post请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function post<T, R>(url: string, data?: R, config?: Service.AxiosConfig) {
    return asyncRequest<T, R>({ url, method: RequestEnum.POST, data, axiosConfig: config });
  }
  /**
   * put请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function put<T, R>(url: string, data?: R, config?: Service.AxiosConfig) {
    return asyncRequest<T, R>({ url, method: RequestEnum.PUT, data, axiosConfig: config });
  }

  /**
   * delete请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function handleDelete<T, R>(url: string, data?: R, config?: Service.AxiosConfig) {
    return asyncRequest<T, R>({ url, method: RequestEnum.DELETE, data, axiosConfig: config });
  }

  return {
    get,
    post,
    put,
    delete: handleDelete
  };
}
