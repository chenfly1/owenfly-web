import { request, showToast, navigateTo, getCurrentInstance } from '@tarojs/taro';
import jsonBig from 'json-bigint';
// import { ContentTypeEnum } from '@/enum';
import { removeToken } from '@/utils';
import { getRequestHeaders } from './helpers';
const JSONbigString = jsonBig({ storeAsString: true });
// const CodeMessage = {
//   SUCCESS: 'SUCCESS',
//   TKN0003: 'TKN0003', //当前用户已被顶下线
//   TKN0001: 'TKN0001', //token 无效
//   UU1001: 'UU1001' //账号不存在
// };
const OVERDUELIST = ['TKN0001', 'UU1001', 'TKN0003'];
async function axios<T, R>(config: Service.RequestParam<R>): Promise<Service.BackendResultConfig<T>> {
  let { method, url, data } = config;
  const axiosConfig = config.axiosConfig as Service.AxiosConfig;
  const header = getRequestHeaders(axiosConfig);
  /** 钉钉端 Content-Type为application/json时，data参数只支持json字符串，用户需要手动调用JSON.stringify进行序列化 */
  // if (header['Content-Type'] === ContentTypeEnum.JSON && method === 'POST') {
  //   data = JSON.stringify(data);
  // }
  return await new Promise((resolve, reject) => {
    request({
      /** 兼容Url不同的情况，可以通过填写完整路径 */
      url,
      method,
      data: data || {},
      header,
      timeout: 60000,
      dataType: 'text',
      success: resString => {
        const res = JSONbigString.parse(JSON.stringify(resString));
        // console.log(JSONbigString.parse(JSON.stringify(res.data)), JSON.stringify(res.data), 'ress');
        // console.log(JSONbigString, 'JSONbigString');
        const result = JSONbigString.parse(res.data) as Service.BackendResultConfig<T>;
        // console.log(result, 'res222s');

        // console.log(res.data, 'resss');
        const { code, message, msg } = result;
        /* 成功请求 */
        if ([0, 'SUCCESS'].includes(code)) {
          // try {
          //   // 如果转换成功则返回转换的数据结果
          //   return resolve(result);
          // } catch (err) {
          //   console.log(err, '转换报错了');
          //   // 如果转换失败，则包装为统一数据格式并返回
          //   return resolve(result);
          // }
          return resolve(result);
        }
        /* 登录超时 */
        if (OVERDUELIST.includes(code as any)) {
          navigateTo({
            url: 'pages/login/index'
          });
          // const { params, path } = getCurrentInstance().router as any;
          removeToken();
          // return reLaunch({
          //   url: `/pages/login/index?nextPage=${path}&${qs.stringify(params)}`
          // });
        }
        if (axiosConfig.useErrMsg) {
          showToast({
            title: message || msg || '系统错误',
            icon: 'none',
            duration: 2000
          });
        }
        return reject(result);
      },
      fail: err => {
        showToast({
          title: err.errMsg || '系统错误',
          icon: 'none',
          duration: 2000
        });
        // console.log(err)
        reject(err);
      },
      complete: () => {
        //
      }
    });
  });
}

export default axios;
