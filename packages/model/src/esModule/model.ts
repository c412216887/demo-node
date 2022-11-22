/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-02 17:10:25
 * @LastEditTime: 2022-11-22 17:41:58
 * @FilePath: \demo-node\packages\ESModel\src\model.ts
 */
let obj = {};
class Add {
  constructor() {
    console.log("Add");
  }
  add(a: number, b: number) {
    return a + b;
  }
}
let n = 0;
n++;
console.log(n);
obj = new Add();
export default obj;
