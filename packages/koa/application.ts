import type { IncomingMessage, ServerResponse } from "node:http";
import http from "node:http";

export type Context = {
  app: Application;
  req: IncomingMessage;
  res: ServerResponse;
};

export default class Application {
  middleware: ((
    ctx: Context,
    next: () => Promise<void>
  ) => void | undefined)[] = [];
  listen(port: number, cb?: () => void) {
    const server = http.createServer(this.callback());
    server.listen(port, cb);
  }
  callback() {
    const fn: (ctx: Context) => Promise<void> = compose(this.middleware);
    const handleRequest = function (req: IncomingMessage, res: ServerResponse) {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
  use(fn: (ctx: Context, next: () => Promise<void>) => void): Application {
    this.middleware.push(fn);
    return this;
  }
  handleRequest(ctx: Context, fnMiddleware: (ctx: Context) => Promise<void>) {
    return fnMiddleware(ctx).then(() => respond(ctx));
  }
  createContenxt(
    this: Application,
    req: IncomingMessage,
    res: ServerResponse
  ): Context {
    const context = {
      app: this,
      req: req,
      res: res,
    };
    return context;
  }
}

function compose(
  middleware: ((
    context: Context,
    next: () => Promise<void>
  ) => void | undefined)[]
): (context: Context) => Promise<void> {
  if (!Array.isArray(middleware)) {
    throw new TypeError("Middleware stack must be an array");
  }
  return function (context: Context): Promise<void> {
    return dispatch(0);
    function dispatch(idx: number) {
      let fn: (ctx: Context, next: () => Promise<void>) => void | undefined =
        middleware[idx];
      if (idx === middleware.length) {
        return Promise.resolve();
      }
      return Promise.resolve(fn(context, dispatch.bind(null, idx + 1)));
    }
  };
}

function respond(ctx: Context) {
  const res = ctx.res;
  return res.end();
}
