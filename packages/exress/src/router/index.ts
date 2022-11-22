import { IncomingMessage, ServerResponse } from "node:http";
import Layer from "./layer";
import Route from "./route";
// Router 属于单例模式
class Router {
  stack: Layer[];
  constructor() {
    this.stack = [];
  }
  use(fn: Function): void;
  use(path: string, fn: Function): void;
  use(path: string | Function, fn?: Function) {
    if (typeof path === "function") {
      fn = path;
      path = "/";
    }
    const layer = new Layer(path, fn!);
    layer.route = undefined;
    this.stack.push(layer);
  }
  route(path: string) {
    const route = new Route();
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
  }
  handle(req: IncomingMessage, res: ServerResponse) {
    const stack = this.stack;
    let idx = 0;
    next();
    function next() {
      let layer: Layer;
      let match: boolean = false;
      while (match !== true && idx < stack.length) {
        layer = stack[idx++];
        match = true;
      }
      layer!.handle_request(req, res, next);
    }
  }
}
export default Router;
