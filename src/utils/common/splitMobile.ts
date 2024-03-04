/**
 * 手机号码分割
 * @param mobile - 手机号码
 * @param format - 分隔符
 */
export function splitMobile(mobile: number | string, format = '-') {
  return String(mobile).replace(/(?=(\d{4})+$)/g, format);
}
