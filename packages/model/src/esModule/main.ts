/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-11-22 18:25:11
 * @LastEditTime: 2022-11-22 18:42:50
 * @FilePath: \demo-node\packages\model\src\esModule\main.ts
 */
import { a, b } from "./a";
console.log("a", a);
console.log("b", b);
setTimeout(() => {
  console.log("a", a);
  console.log("b", b);
}, 500);
