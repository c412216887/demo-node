/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-07 17:41:57
 * @LastEditTime: 2022-11-18 17:12:40
 * @FilePath: \demo-node\packages\cluster\cluster.ts
 */
import cluster from "cluster";

const instance = 2;
if (cluster.isPrimary) {
  // 是否为主进程
  for (let i = 0; i < instance; i++) {
    cluster.fork();
  }
} else {
  import("./src/index");
}
