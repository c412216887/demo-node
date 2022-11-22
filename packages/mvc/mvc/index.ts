import type { IncomingMessage, ServerResponse } from "node:http";
import http from "node:http";
import { URL } from "node:url";

import setRet from "./util/baseFn";

const routerMapping = {
  "/v1/contents": {
    controller: "content",
    method: "list",
  },
  "v1/test": {
    controller: "content",
    method: "test",
  },
};

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    // 解析URL
    const url = new URL(req.url!, `http://${req.headers.host}`);
    //  路由控制
    const routers = Object.keys(routerMapping);
    if (!routers.includes(url.pathname)) {
      // 报错
      return void setRet(res, false);
    } else {
      // 分发路由
      const ControllerClass = require(`./controller/${
        routerMapping[url.pathname as keyof typeof routerMapping].controller
      }`).default;
      if (ControllerClass) {
        const controller = new ControllerClass(req, res);
        // 根据路由执行相关方法
        const method =
          controller[
            routerMapping[url.pathname as keyof typeof routerMapping].method
          ];
        if (method[Symbol.toStringTag] === "AsyncFunction") {
          await method.call(controller);
        } else {
          method.call(controller);
        }
      }
    }
  }
);

server.listen(3000, () => {
  console.log("server start: 3000");
});
