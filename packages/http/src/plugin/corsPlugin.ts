import type { Env, Message } from "../type/http";

export function corsPlugin(message: Message, env: Env) {
  Object.assign(message.response.headers, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  });
}
