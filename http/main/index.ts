import net from "node:net";
import worker from "../worker";

net
  .createServer((connection) => {
    console.log("start");
    worker(connection);
  })
  .listen(80, () => {
    console.log("servers start:80");
  });
