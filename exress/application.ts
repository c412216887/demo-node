import type { IncomingMessage, ServerResponse } from "node:http";
import http from "node:http";
import type { App } from "./express";
import Router from "./router";

const methods = ["get"];

const app: Record<string, unknown> = {};

app.lazyRouter = function () {
  if (!this._router) {
    this._router = new Router();
  }
};

app.use = function (this: App, path: string | Function, fn?: Function) {
  if (typeof path === "function") {
    fn = path;
    path = "/";
  }
  this.lazyRouter();
  return this._router.use(path, fn!);
};

app.get = function (
  this: App,
  path: string,
  fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void
) {
  this.lazyRouter();
  const route = this._router.route(path);
  // ts-ignore
  route.get.call(route, fn);
  return this;
};

app.handle = function (this: App, req: IncomingMessage, res: ServerResponse) {
  const router = this._router;
  router.handle(req, res);
};

app.listen = function (this: App, port: number, cb?: () => void) {
  const server = http.createServer(this);
  server.listen(port, cb);
};
export default app;
