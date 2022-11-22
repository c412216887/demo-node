/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-04 19:47:31
 * @LastEditTime: 2022-11-18 17:20:21
 * @FilePath: \demo-node\packages\exress\express.ts
 */
import { IncomingMessage, ServerResponse } from "node:http";
import proto from "./src/application";
import type Router from "./src/router";

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
