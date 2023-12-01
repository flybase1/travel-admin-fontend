//方法一
// export default function formatDate(val) {
//   var date = new Date(Number(val)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
//   var Y = date.getFullYear() + "-";
//   var M =
//     (date.getMonth() + 1 < 10
//       ? "0" + (date.getMonth() + 1)
//       : date.getMonth() + 1) + "-";
//   var D = date.getDate() + " ";
//   var h = date.getHours() + ":";
//   var m = date.getMinutes() + ":";
//   var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
//   return Y + M + D + h + m + s;
// }

import { format } from "date-fns";

export default function formatDate(val) {
  // 将字符串转为 Date 对象
  const date = new Date(val);

  // 获取年月日时分秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // 拼接成格式化后的字符串
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}
