import type { Filter, FindOptions } from "mongodb";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { UserDetail } from "../type";
import http from "node:http";
import { URL } from "url";
import { getClient } from "../../../lib/mongodb";

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    // 解析请求报文
    const myUrl = new URL(req.url || "", `http://${req.headers.host}`);
    const pathname = myUrl.pathname;
    console.log(pathname);
    if ("/api/userInfos" !== pathname) {
      return setRetInfo(res, false);
    }
    // 获取到query参数
    const userIds: string | null = myUrl.searchParams.get("user_ids");
    console.log(userIds);
    if (userIds === null) {
      return setRetInfo(res, false);
    }
    // 根据入参批量获取数据
    const userInfo = await queryData({ id: { $in: userIds.split(",") } });
    setRetInfo(res, true, "success", userInfo);
  }
);

server.listen(4000, () => {
  console.log("server start: http://127.0.0.1:4000");
});

async function queryData(filter: Filter<UserDetail>, options?: FindOptions) {
  // 链接mongodb
  const client = await getClient();
  const collection = client.db("User").collection("detail");
  const userDetails = await collection.find(filter).toArray();
  return userDetails;
}

function setRetInfo(
  res: ServerResponse,
  ret: boolean,
  message?: string,
  data?: unknown,
  statusCode: number = 200
) {
  type RetInfo = {
    ret: 0 | -1;
    message: string;
    data: unknown;
  };
  let retInfo: RetInfo;
  if (!ret) {
    retInfo = {
      ret: -1,
      message: message || "error",
      data: {},
    };
  } else {
    retInfo = {
      ret: 0,
      message: message || "success",
      data: data || {},
    };
  }
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.write(JSON.stringify(retInfo));
  res.end();
}
