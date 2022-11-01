import type { IncomingMessage, ServerResponse } from "node:http";
import setRet from "../util/baseFn";
class Controller {
  constructor(private req: IncomingMessage, private res: ServerResponse) {}
  setRet(
    ret: boolean,
    message?: string,
    dataInfo?: unknown,
    statusCode: number = 200
  ) {
    setRet(this.res, ret, message, dataInfo, statusCode);
  }
}

export default Controller;
