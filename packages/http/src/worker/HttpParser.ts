import type { Socket } from "node:net";
import type { Response, Request } from "../type/http";

import { EventEmitter } from "node:events";

type RequestLineCache = [number, string, string, string, boolean];
type HeadersCache = [number, string, string, boolean];
type BodyCache = [number, number, Uint8Array];

class HttpParser extends EventEmitter {
  _parse: Function;
  message: {
    request: Request;
    response: Response;
  };
  cache?: RequestLineCache | HeadersCache | BodyCache;
  constructor(private connect: Socket) {
    super();
    this._parse = this._parseRequestLine;
    this.message = {
      request: {
        method: "",
        path: "",
        version: "",
        headers: {},
        body: Buffer.from(""),
      },
      response: {
        status: 0,
        message: "",
        headers: {},
        body: Buffer.from(""),
      },
    };
  }
  append(buffer: Buffer) {
    buffer.forEach((b) => {
      if (typeof this._parse === "function") {
        this._parse = this._parse(b);
      }
    });
  }
  _parseRequestLine(char: number) {
    if (this.cache === undefined) {
      this.cache = [1, "", "", "", false];
    }
    if (char === 0x20) {
      // 判断是不是空格
      this.cache[0]++;
    } else if (char === 0x0d) {
      // 判断是不是CR
      this.cache[4] = true;
    } else if (char === 0x0a && this.cache[4]) {
      // 判断是不是LF
      this.message.request.method = (this.cache as RequestLineCache)[1];
      this.message.request.path = (this.cache as RequestLineCache)[2];
      this.message.request.version = (
        this.cache as RequestLineCache
      )[3] as string;
      this.cache = void 0;
      return this._parseHeaders;
    } else {
      (this.cache as RequestLineCache)[(this.cache as RequestLineCache)[0]] +=
        String.fromCharCode(char); // 将二进制码，转换为对应的string
    }
    return this._parseRequestLine;
  }
  _parseHeaders(char: number) {
    if (this.cache === undefined) {
      this.cache = [1, "", "", false];
    }
    if (char === 0x20) {
      // 判断是不是空格
      return this._parseHeaders;
    } else if (char === 0x3a) {
      this.cache[0]++;
    } else if (char === 0x0d) {
      // 判断是不是CR
      this.cache[3] = true;
    } else if (char === 0x0a && this.cache[3]) {
      // 判断是不是LF
      if (this.cache[1] === "") {
        this.cache = void 0;
        const contentLength = this.message.request.headers["Content-Length"];
        if (contentLength && parseInt(contentLength) > 0) {
          return this._parseBody;
        } else {
          return this._finish();
        }
      } else {
        this.message.request.headers[this.cache[1]] = (
          this.cache as HeadersCache
        )[2];
        this.cache = void 0;
        return this._parseHeaders;
      }
    } else {
      (this.cache[this.cache[0]] as string) += String.fromCharCode(char);
    }
    return this._parseHeaders;
  }
  _parseBody(data: number) {
    // 判断请求头中有没有content-length
    if (this.cache === undefined) {
      const contentLength = this.message.request.headers["Content-Length"];
      this.cache = [
        parseInt(contentLength),
        0,
        new Uint8Array(parseInt(contentLength)),
      ];
    }
    const bodyCache = this.cache as BodyCache;
    bodyCache[2][bodyCache[1]] = data;
    bodyCache[1]++;
    if (bodyCache[0] === bodyCache[1]) {
      this.message.request.body = Buffer.from(bodyCache[2]);
      return this._finish();
    }
    return this._parseBody;
  }
  _finish() {
    this.emit("finish", this.message);
  }
}

export default HttpParser;
