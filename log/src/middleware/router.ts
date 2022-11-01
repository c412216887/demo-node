/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-18 17:28:59
 * @LastEditTime: 2022-10-31 11:51:03
 * @FilePath: \demo-node\log\src\middleware\router.ts
 */
import type { Context } from "koa";
import { URL } from "node:url";
import setRet from "../util/baseFn";
const routerMapping: Record<string, { controller: string; method: string }> = {
  "/v1/contents": {
    controller: "content",
    method: "list",
  },
  "/v1/log": {
    controller: "content",
    method: "log",
  },
  "/v1/no-cache": {
    controller: "localCache",
    method: "no",
  },
  "/v1/cache": {
    controller: "localCache",
    method: "yes",
  },
};

async function main(ctx: Context) {
  // 获取get参数
  const myUrl = new URL(ctx.request.url, `http://${ctx.request.header.host}`);
  const pathname = myUrl.pathname;
  // 过滤非法用户信息请求
  if (!routerMapping[pathname]) {
    setRet(ctx, false);
    return;
  }
  const ConstrollerClass =
    require(`../controller/${routerMapping[pathname].controller}`).default;
  const controllerObj = new ConstrollerClass(ctx);
  const method =
    controllerObj[routerMapping[pathname].method].bind(controllerObj);
  if (method[Symbol.toStringTag] === "AsyncFunction") {
    await method();
  } else {
    method();
  }
}

export default main;
