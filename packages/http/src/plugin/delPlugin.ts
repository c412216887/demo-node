import type { Env, Message } from "../type/http";
import fs from "node:fs";
import path from "node:path";

function delPlugin(message: Message, env: Env) {
  if (message.response.status !== 0 || message.request.method !== "DELETE") {
    return;
  }
  // 获取路径
  const pathname = message.request.path;
  // 路径不能以./ ../ 开头
  if (pathname.startsWith(".")) {
    message.response.status = 403;
    return;
  }
  const fullPath = path.join(env.www, pathname);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    message.response.status = 200;
    return;
  }
  message.response.status = 404;
}

export default delPlugin;
