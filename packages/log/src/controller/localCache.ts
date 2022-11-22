/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-31 11:24:21
 * @LastEditTime: 2022-10-31 11:48:52
 * @FilePath: \demo-node\log\src\controller\localCache.ts
 */
import Controller from "../core/controller";
import NodeCache from "node-cache";

const cacheHandle = new NodeCache();

class LocalCache extends Controller {
  // 使用本地缓存
  yes() {
    let result: string | number | undefined = cacheHandle.get("result"); // 获取本地缓存
    if (!result || result === 0) {
      // 没有缓存
      result = 0; // 初始化result
      for (let i = 0; i < 100000000; i++) {
        result += i;
      }
      cacheHandle.set("result", result);
    }
    return this.setRes(true, "success", `cache sum 0 - 100000000 is ${result}`);
  }
  no() {
    let sum: number = 0;
    for (let i = 0; i < 100000000; i++) {
      sum += i;
    }
    return this.setRes(true, "success", `no cache sum 0 - 100000000 is ${sum}`);
  }
}

export default LocalCache;
