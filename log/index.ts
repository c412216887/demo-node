/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-18 17:14:39
 * @LastEditTime: 2022-10-20 18:13:47
 * @FilePath: \demo-node\log\index.ts
 */
import Koa from "koa";
import logCenter from "./src/middleware/logCenter";
import router from "./src/middleware/router";
const app = new Koa();

app.use(logCenter);
app.use(router);

app.listen(3000, () => {
  console.log("server start 3000");
});
