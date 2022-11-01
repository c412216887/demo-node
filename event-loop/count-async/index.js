const http = require('http')
const axios = require('axios')
const server = http.createServer((req, res) => {
  Promise.all([startCount(), nextCount()]).then(data => {
    const sum = data.reduce((prev, curr) => {
      return parseFloat(prev) + parseFloat(curr)
    })
    res.write(`${sum}`)
    res.end()
  })
    .catch(() => {
    res.end()
  })
})

async function startCount() {
  return  await axios.get("http://127.0.0.1:5000").then(res => res.data)
}

async function nextCount() {
  return await axios.get("http://127.0.0.1:6000").then(res => res.data)
}

server.listen(4000, () => {
  console.log("server start: 40000")
})