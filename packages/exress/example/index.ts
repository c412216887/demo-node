/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-05 16:42:04
 * @LastEditTime: 2022-11-18 17:19:29
 * @FilePath: \demo-node\packages\exress\example\index.ts
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import express from "../express";

const app = express();
app.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
  console.log("1");
  next();
  console.log("1 end");
});

app.get("/", (req: IncomingMessage, res: ServerResponse, next: () => void) => {
  console.log("get method");
  res.end("hello world");
});

app.listen(3000, () => {
  console.log("server start 3000");
});

console.log(app);
