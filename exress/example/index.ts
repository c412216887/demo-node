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
