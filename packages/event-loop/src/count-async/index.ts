/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-08-06 21:16:40
 * @LastEditTime: 2022-11-05 17:16:22
 * @FilePath: \demo-node\packages\event-loop\count-async\index.ts
 */
import http from "node:http";
import axios from "axios";

/**
 * 利用网络I/O计算和
 */
const server = http.createServer((req, res) => {
  Promise.all([startCount(), nextCount()])
    .then((data) => {
      const sum = data.reduce((prev, curr) => {
        return parseFloat(prev) + parseFloat(curr);
      });
      res.write(`${sum}`);
      res.end();
    })
    .catch(() => {
      res.end();
    });
});

async function startCount() {
  return await axios.get("http://127.0.0.1:5000").then((res) => res.data);
}

async function nextCount() {
  return await axios.get("http://127.0.0.1:6000").then((res) => res.data);
}

server.listen(4000, () => {
  console.log("server start: 40000");
});
