/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-20 17:54:40
 * @LastEditTime: 2022-10-20 17:59:32
 * @FilePath: \demo-node\log\src\core\controller.ts
 */
import type { Context } from "koa";
import baseFn from "../util/baseFn";

class Controller {
  ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }
  setRes(
    ret: boolean,
    message?: string,
    data?: unknown,
    statusCode: number = 200
  ) {
    baseFn(this.ctx, ret, message, data, statusCode);
  }
}

export default Controller;
