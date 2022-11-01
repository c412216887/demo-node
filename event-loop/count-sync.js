const http = require('http')

const server = http.createServer((req, res) => {
  res.write(`${startCount() + nextCount()}`)
  res.end()
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

/**
 * 从 5000000000 计算到 1000000000 的和
 * @returns 和
 */
function nextCount() {
  let sum = 0;
  for (let i = 500000000; i < 1000000000; i++) {
    sum += i
  }
  return sum
}

/**
 * 启动服务
 */
server.listen("4000", () => {
  console.log("server start: 40000")
})