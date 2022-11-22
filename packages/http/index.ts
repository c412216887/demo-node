/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-08-23 16:30:44
 * @LastEditTime: 2022-11-01 11:25:03
 * @FilePath: \demo-node\packages\http\index.ts
 */
import net from "node:net";
import worker from "./src/worker";

net
  .createServer((connection) => {
    console.log("start");
    worker(connection);
  })
  .listen(80, () => {
    console.log("servers start:80");
  });
