import { request } from '../request';

const baseUrl = `${HTTP_COM_URL}/DoorManager/`;
export function accessauthVisitorGet<T>(
  data = {},
  options = {
    useErrMsg: true
  }
) {
  return request.post<T>(`${baseUrl}white/v1/accessauth/visitor/get`, data, options);
}
