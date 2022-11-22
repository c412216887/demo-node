import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { DetailedUserMap, UserDetail, UserInfo } from "../type";

import { URL } from "node:url";
import { getClient } from "../../lib/mongodb";

import type { Filter, FindOptions, WithId } from "mongodb";
import axios from "axios";

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    // 判断请求路径
    const myUrl = new URL(req.url || "", `http://${req.headers.host}`);
    const pathname = myUrl.pathname;
    // 过滤非拉取用户信息请求
    if ("/v1/contents" !== pathname) {
      return setRetInfo(res, false, "path no found", null, 404);
    }
    // 从DB中获取数据
    const allUserInfo: WithId<UserInfo>[] = await queryData({}, { limit: 100 });
    // 过滤数据
    const userDetailedInfo = await filterUserInfo(allUserInfo);
    // 返回数据
    setRetInfo(res, true, "success", userDetailedInfo);
  }
);

server.listen(3000, () => {
  console.log("server start http://127.0.0.1:3000");
});

/**
 *
 * @param data content列表
 * @returns 完整数据
 */
async function filterUserInfo(
  data: WithId<UserInfo>[]
): Promise<DetailedUserMap[]> {
  // 过滤user_id为空的数据
  const nonNullUserInfo: UserInfo[] = data.filter(
    (user: { user_id?: string }) => user["user_id"]
  );
  const userIdList = nonNullUserInfo.map((userInfo) => userInfo["user_id"]);
  console.log("userId", userIdList);
  // 根据user_id批量获取userInfo
  const userRes = await axios.get("http://127.0.0.1:4000/api/userInfos", {
    params: { user_ids: userIdList.join(",") },
  });
  const userDetailedInfo: WithId<UserDetail>[] = userRes.data
    .data as WithId<UserDetail>[];
  // if (userDetailedInfo.length < 1) {
  // }

  const userMap: { [k: string]: WithId<UserDetail> } = userDetailedInfo.reduce(
    (prev, user: WithId<UserDetail>) => {
      return {
        ...prev,
        [user.id]: user,
      };
    },
    {}
  );
  const userFull: DetailedUserMap[] = data.map((userInfo: WithId<UserInfo>) => {
    return {
      ...userInfo,
      user_info: userMap[userInfo.user_id],
    };
  });
  return userFull;
}

/**
 * 查询MongoDB
 * @param filter 查询条件
 * @param options 限制条件
 * @returns 查询到的结果
 */
async function queryData(
  filter: Filter<UserInfo>,
  options?: FindOptions
): Promise<WithId<UserInfo>[]> {
  // 链接mongodb
  const client = await getClient();
  const collection = client.db("User").collection("User");
  const queryArr = await collection
    .find<WithId<UserInfo>>(filter, options)
    .toArray();
  return queryArr;
}

function setRetInfo(
  res: ServerResponse,
  ret: boolean,
  message?: string,
  dataInfo?: unknown,
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
      data: dataInfo || {},
    };
  }
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.write(JSON.stringify(retInfo));
  res.end();
}
