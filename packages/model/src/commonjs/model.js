/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-02 17:10:25
 * @LastEditTime: 2022-11-22 18:05:26
 * @FilePath: \demo-node\packages\model\src\commonjs\model.js
 */
let obj = {};
class Add {
  constructor() {
    console.log("Add");
  }
  add(a, b) {
    return a + b;
  }
}
let n = 0;
n++;
console.log(n);
obj = new Add();
module.exports = obj;
