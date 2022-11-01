import Koa from "../application";
import type { Context } from "../application";

const app = new Koa();
app.use(async (ctx: Context, next: () => Promise<void>) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(1);
      resolve(1);
    }, 20);
  });
  await next();
  console.log("1 end");
});
