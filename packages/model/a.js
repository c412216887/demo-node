/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-11-22 18:22:33
 * @LastEditTime: 2022-11-22 18:38:39
 * @FilePath: \demo-node\packages\model\a.js
 */
let a = 1;
let b = { num: 1 }
setTimeout(() => {
  a = 2
  b.num = 2
}, 200)
module.exports = {
  a,
  b,
}

