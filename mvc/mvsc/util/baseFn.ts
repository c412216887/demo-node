import type { ServerResponse } from "node:http";

function setRet(
  res: ServerResponse,
  ret: boolean,
  message?: string,
  dataInfo?: unknown,
  statusCode: number = 200
) {
  type RetInfo = {
    ret: -1 | 0;
    message: typeof message;
    data: typeof dataInfo;
  };
  let retInfo: RetInfo;
  if (!ret) {
    retInfo = {
      ret: -1,
      message: message || "error",
      data: dataInfo || {},
    };
  } else {
    retInfo = {
      ret: 0,
      message: message || "success",
      data: dataInfo || {},
    };
  }
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.write(JSON.stringify(retInfo));
  res.end();
}

export default setRet;
