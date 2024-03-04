import { request } from '../request';

const baseUrl = `${HTTP_URL}/cfc/`;
// 获取验证码
export function captcha<T>(
  data = {},
  options = {
    useErrMsg: true
  }
) {
  return request.post<T>(`${baseUrl}client/captcha`, data, options);
}

export function captchaCheck<T>(
  data = {},
  options = {
    useErrMsg: true
  }
) {
  return request.post<T>(`${baseUrl}client/captcha/check`, data, options);
}
