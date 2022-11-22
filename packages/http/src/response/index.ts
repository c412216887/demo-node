import type { Message } from "../type/http";

enum StatusCode {
  "Success" = 200,
  "Created" = 201,
  "Partial Content" = 206,
  "Unauthorized" = 401,
  "Forbidden" = 403,
  "Not Found" = 404,
  "Range Not Satisfiable" = 416,
  "Internal Server Error" = 500,
}

function makeResponse(message: Message) {
  let status = message.response.status;
  if (!status) {
    status = StatusCode["Internal Server Error"];
  }
  const responseLine = `${message.request.version} ${status} ${StatusCode[status]}\r\n`;
  let body = message.response.body;
  const headers: Record<string, unknown> = {
    ...message.response.headers,
    ...{
      "Content-Length": body.length,
    },
  };
  const responseHeaders = Object.keys(headers).reduce(
    (a: string, b: keyof typeof headers) => {
      return `${a}${b}: ${headers[b]}\r\n`;
    },
    ""
  );
  return Buffer.concat([
    Buffer.from(responseLine, "ascii"),
    Buffer.from(responseHeaders, "ascii"),
    Buffer.from("\r\n", "ascii"),
    message.response.body,
  ]);
}

export default makeResponse;
