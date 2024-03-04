import { request } from '../request';

const baseUrl = `${HTTP_COM_URL}/VisitorCenter/`;
// 添加访客 /white/visitor/getDetail
export function getDetailVisirtor<T>(
  data = {},
  options = {
    useErrMsg: true
  }
) {
  return request.post<T>(`${baseUrl}white/visitor/getDetail`, data, options);
}
