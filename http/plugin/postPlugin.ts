import path from "node:path";
import fs from "node:fs";
import type { Message, Env } from "../type/http";

function postPlugin(message: Message, env: Env) {
  // status初始化值为0,如果不为0，则表示已经被其他plugin给处理了
  if (message.response.status !== 0 || message.request.method !== "POST") {
    return;
  }
  // postPLugin主要创建一个新的文件, 创建的文件放在www文件夹中
  const wwwPath = path.resolve(__dirname, "../../www/");
  const pathname = message.request.path;
  // 路径不能以. ./ ../开头
  if (pathname.indexOf(".") === 0) {
    message.response.status = 403;
    return;
  }
  // 判断路径是否已经存在
  const fullPath = path.join(wwwPath, pathname);
  if (fs.existsSync(fullPath)) {
    message.response.status = 403;
    return;
  }
  // 创建文件夹
  const dirname = path.dirname(fullPath);
  fs.mkdirSync(dirname, { recursive: true });
  // 创建文件
  fs.writeFileSync(fullPath, message.request.body, { encoding: "utf-8" });
  message.response.status = 201;
  return;
}

export default postPlugin;
