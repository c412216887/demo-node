import { IncomingMessage, ServerResponse } from "node:http";
import proto from "./application";
import type Router from "./router/";

export type App = {
  (): void;
  use: Function;
  get: (path: string, fn: Function) => void;
  lazyRouter: Function;
  _router: Router;
  handle(req: IncomingMessage, res: ServerResponse): void;
  listen(port: number, cb?: () => void): void;
};

function createApplication(): App {
  const app = function (req: IncomingMessage, res: ServerResponse) {
    (app as App).handle(req, res);
  };
  Object.assign(app, proto);
  return app as unknown as App;
}

export default createApplication;
