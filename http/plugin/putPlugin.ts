import fs from "node:fs";
import path from "node:path";
import type { Message, Env } from "../type/http";

function putPlugin(message: Message, env: Env) {
  if (message.response.status !== 0 || message.request.method !== "PUT") {
    return;
  }
  // 获取路径
  const pathname = message.request.path;
  if (pathname.startsWith(".")) {
    message.response.status = 403;
    return;
  }
  const fullPath = path.join(env.www, pathname);
  if (!fs.existsSync(fullPath)) {
    message.response.status = 404;
    return;
  }
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    message.response.status = 403;
  } else {
    fs.writeFileSync(fullPath, message.request.body, { encoding: "utf-8" });
    message.response.status = 200;
  }
}

export default putPlugin;
