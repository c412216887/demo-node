/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-08-06 21:26:31
 * @LastEditTime: 2022-11-05 17:13:33
 * @FilePath: \demo-node\packages\event-loop\count-async\start-count.js
 */
import http from "node:http"

const server = http.createServer((req, res) => {
  res.write(`${startCount()}`)
  res.end()
})

server.listen(5000, () => {
  console.log('server start: 5000')
})

/**
 * 从 0 计算到 500000000 的和
 * 
 */
 function startCount() {
  let sum = 0;
  for (let i = 0; i < 500000000; i++) {
    sum += i
  }
  return sum;
}
