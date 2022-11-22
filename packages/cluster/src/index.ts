/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-07 17:41:43
 * @LastEditTime: 2022-11-18 17:07:12
 * @FilePath: \demo-node\cluster\index.ts
 */
import http from "node:http";

const server = http.createServer((req, res) => {
  res.write(`start with cluster ${process.pid}`);
  setTimeout(() => {
    res.end();
  }, 2000);
});

server.listen(3000, () => {
  console.log("server start 3000");
});

console.log(`Work ${process.pid} started`);
