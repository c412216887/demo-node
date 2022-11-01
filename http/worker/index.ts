// 处理connect

import type { Socket } from "net";
import type { Message, Env } from "../type/http";
import HttpParser from "./HttpParser";
import makeResponse from "../response";
import path from "node:path";
import postPlugin from "../plugin/postPlugin";
import getPlugin from "../plugin/getPlugin";
import putPlugin from "../plugin/putPlugin";
import delPlugin from "../plugin/delPlugin";
import { authPLugin } from "../plugin/authPlugin";
import { corsPlugin } from "../plugin/corsPlugin";

function work(connection: Socket) {
  const parser = new HttpParser(connection);
  // 监听获取数据
  connection.on("data", (buffer) => {
    parser.append(buffer);
  });
  parser.on("finish", async (message: Message) => {
    const env: Env = {
      www: path.resolve(__dirname, "../../www/"),
      template: path.resolve(__dirname, "../../template.ejs"),
      session: path.resolve(__dirname, "../../session/"),
    };
    corsPlugin(message, env);
    authPLugin(message, env);
    // 调用plugin
    await getPlugin(message, env);
    // 调用plugin
    postPlugin(message, env);
    putPlugin(message, env);
    delPlugin(message, env);
    // 返回response
    const response = makeResponse(message);
    connection.end(response);
  });
}

export default work;
