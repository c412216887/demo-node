import { IncomingMessage, ServerResponse } from "http";
import type Route from "./route";
class Layer {
  handle: Function;
  name: string;
  route?: Route;
  method?: string;
  /**
   *
   * @param path 路由
   * @param fn 中间键或者api方法
   */
  constructor(path: string, fn: Function) {
    this.handle = fn;
    this.name = fn.name;
  }
  /**
   *
   * @param req 请求报文
   * @param res 返回报文
   * @param next 执行下一个layer对象
   */
  handle_request(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const fn = this.handle;
    fn(req, res, next);
  }
  match() {}
}

export default Layer;
