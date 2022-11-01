import type { Message, Env } from "../type/http";
import fs from "fs";
import path from "path";
import ejs from "ejs";

async function getPlugin(message: Message, env: Env) {
  if (message.response.status !== 0 || message.request.method !== "GET") {
    return;
  }
  // 获取路径
  const pathname = message.request.path;
  if (pathname.startsWith(".")) {
    message.response.status = 403;
  }
  const fullPath = path.join(env.www, pathname);
  // 判断路径是否存在
  if (!fs.existsSync(fullPath)) {
    message.response.status = 404;
    return;
  }
  // 判断路径是否为文件夹
  const fsStat = fs.statSync(fullPath);
  if (fsStat.isDirectory()) {
    // 获取文件夹下所有文件
    const files: string[] = fs.readdirSync(fullPath);
    const data = files.map((file) => {
      const stat = fs.statSync(path.join(fullPath, file));
      return {
        filename: file,
        size: stat.size,
        lastModified: stat.mtime,
      };
    });
    const html = await ejs.renderFile(env.template, {
      title: pathname,
      data,
    });
    message.response.status = 200;
    message.response.body = Buffer.from(html);
    return;
  } else if (fsStat.isFile()) {
    const rangeHeader: string = message.request.headers["Range"];
    if (!rangeHeader) {
      const file = fs.readFileSync(fullPath);
      message.response.status = 200;
      message.response.body = file;
    } else {
      const fileBuffer = fs.openSync(fullPath, "r");
      // bytes=200-1000
      const rangeList = rangeHeader.match(/bytes\s*?=\s*?(\d+?)\s*?-(\d+)/i);
      if (rangeList === null) {
        message.response.status = 416;
      } else {
        const size = parseInt(rangeList[2]) - parseInt(rangeList[1]) + 1;
        const writeBuffer = Buffer.alloc(size);
        fs.readSync(fileBuffer, writeBuffer, 0, size, parseInt(rangeList[1]));
        fs.closeSync(fileBuffer);
        message.response.status = 206;
        message.response.headers[
          "Content-Range"
        ] = `bytes ${rangeList[1]}-${rangeList[2]}/${fsStat.size}`;
        message.response.body = writeBuffer;
        return;
      }
    }
  }
}

export default getPlugin;
