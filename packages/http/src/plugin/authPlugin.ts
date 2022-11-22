import fs from "node:fs";
import path from "node:path";
import type { Env, Message } from "../type/http";

export function authPLugin(message: Message, env: Env) {
  if (message.response.status !== 0) {
    return;
  }
  // 获取Auth, 必须先校验authorization，再校验cookie，否则一旦cookie错误，则永远要登录
  const authorize: string | undefined =
    message.request.headers["Authorization"];
  if (authorize) {
    // Basic YWxhZGRpbjpvcGVuc2VzYW1l
    const authMatch = authorize.match(/Basic\s*(\w+)/i);
    if (authMatch && authMatch[1]) {
      const userAndPwd = Buffer.from(authMatch[1], "base64").toString();
      if (userAndPwd) {
        const userAndPwdList = userAndPwd.split(":");
        const user = userAndPwdList[0];
        const pwd = userAndPwdList[1];
        if (user === "admin" && pwd === "123456") {
          // 登录成功设置cookie
          const randomNum = Date.now();
          // 创建一个session文件
          fs.writeFile(
            path.join(env.session, randomNum.toString()),
            user,
            (error) => {
              console.log(error?.message);
            }
          );
          Object.assign(message.response.headers, {
            "Set-Cookie": `session_id=${randomNum}; HttpOnly; Max-age=3600`,
          });
          return;
        }
      }
    }
  } else {
    // 采用session方法存储
    // 看看cookie
    const cookie = message.request.headers["Cookie"];
    const sessionIdMatch = cookie && cookie.match(/session_id=(\w+)/i);
    if (sessionIdMatch && sessionIdMatch[1]) {
      const sessionId = sessionIdMatch[1];
      // 对应的session文件是否存在
      const sessionPath = path.join(env.session, sessionId);
      if (fs.existsSync(sessionPath)) {
        // 读取文件
        const user = fs.readFileSync(sessionPath, "utf-8");
        if (user === "admin") {
          return;
        }
      }
    }
  }
  // 登录失败
  message.response.status = 401;
  Object.assign(message.response.headers, {
    "WWW-Authenticate": "Basic realm='login'",
  });
  return;
}
