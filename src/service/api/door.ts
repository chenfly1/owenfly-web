import { request } from '../request';
const baseUrl = `${HTTP_URL}/door`;

export function getVisitorDetails<T>(uuid: string, options?) {
  return request.get<T, any>(`${baseUrl}/white/saas/visitor/${uuid}`, {}, options);
}

export function getQrcode<T>(data, options?) {
  return request.get<T, any>(`${baseUrl}/white/door/auth/qrcode/visitor`, data, options);
}
