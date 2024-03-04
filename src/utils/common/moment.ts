// import momentDate from 'moment';
// momentDate.locale('zh-cn');
// export function moment(...arg) {
//   return momentDate(...arg);
// }

export function formateDate(date) {
  if (!date) return '';
  const arr = date.split('T');
  const d = arr[0];
  const darr = d.split('-');

  const t = arr[1];
  const tarr = t.split('.000');
  const marr = tarr[0].split(':');

  // eslint-disable-next-line radix
  const dd = `${darr[0]}-${darr[1]}-${darr[2]} ${marr[0]}:${marr[1]}`;
  return dd;
}
