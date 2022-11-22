import type { IncomingMessage, ServerResponse } from "node:http";
import http from "node:http";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.write("hello world, start with pm2");
    res.end();
  }
);

server.listen(3000, () => {
  console.log("server start http://127.0.0.1:3000");
});
