import http from "node:http";
const server = http.createServer((req, res) => {
  res.write(`${nextCount()}`);
  res.end();
});

server.listen(6000, () => {
  console.log("server start: 6000");
});

function nextCount() {
  let sum = 0;
  for (let i = 500000000; i < 1000000000; i++) {
    sum += i;
  }
  return sum;
}
