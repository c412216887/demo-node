/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-20 17:42:38
 * @LastEditTime: 2022-10-20 17:48:13
 * @FilePath: \demo-node\log\src\util\baseFn.ts
 */
import type { Context } from "koa";

function setRet(
  ctx: Context,
  ret: boolean,
  message?: string,
  dataInfo?: unknown,
  statusCode: number = 200
) {
  type RetInfo = {
    ret: -1 | 0;
    message: typeof message;
    data: typeof dataInfo;
  };
  let retInfo: RetInfo;
  if (!ret) {
    retInfo = {
      ret: -1,
      message: message || "error",
      data: dataInfo || {},
    };
  } else {
    retInfo = {
      ret: 0,
      message: message || "success",
      data: dataInfo || {},
    };
  }
  ctx.response.type = "text/plain";
  ctx.response.status = statusCode;
  ctx.response.body = JSON.stringify(retInfo);
}

export default setRet;
