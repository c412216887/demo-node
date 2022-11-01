const http = require("http")
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
