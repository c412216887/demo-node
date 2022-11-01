import type { IncomingMessage, ServerResponse } from "node:http";
import http from "node:http";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.write(`start with cluster ${process.pid}`);
    setTimeout(() => {
      res.end();
    }, 2000);
  }
);

server.listen(3000, () => {
  console.log("server start 3000");
});

console.log(`Work ${process.pid} started`);
