/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-18 17:26:03
 * @LastEditTime: 2022-10-20 18:19:42
 * @FilePath: \demo-node\log\src\middleware\logCenter.ts
 */
import type { Context, Next } from "koa";
import Log from "../lib/log";

const log = new Log();

log.start();

export default function (ctx: Context, next: Next) {
  ctx.log = log;
  next();
}
