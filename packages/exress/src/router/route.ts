import { IncomingMessage, ServerResponse } from "http";
import Layer from "./layer";

const methods = ["get"];
class Route {
  stack: unknown[] = [];
  methods: { [key in typeof methods[number]]: boolean } = {};
  dispatch(req: IncomingMessage, res: ServerResponse) {
    const stack = this.stack;
    let idx = 0;
    const method = req.method?.toLowerCase();

    next();
    function next() {
      const layer: Layer = stack[idx++] as Layer;
      if (layer.method && layer.method !== method) {
        next();
      } else {
        layer.handle_request(req, res, next);
      }
    }
  }
  get(
    this: Route,
    fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void
  ) {
    const layer = new Layer("/", fn);
    layer.method = "get";
    this.methods.get = true;
    this.stack.push(layer);
  }
}

export default Route;
