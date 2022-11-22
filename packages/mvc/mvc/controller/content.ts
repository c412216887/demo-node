import type { WithId } from "mongodb";
import Controller from "../core/controller";
import ContentModel from "../model/content";
import type { Content } from "../model/content";
import axios from "axios";

type User = {
  id: string;
  name: string;
  desc: string;
};

class ContentController extends Controller {
  // 获取userInfoList
  async list() {
    // 从mongodb中获取到contents
    const model = new ContentModel();
    const contentList = await model.getList();
    // 过滤数据
    const contents = this._filterContent(contentList);
    // 调用api-server,查询userInfo
    const userInfos = await this._callApi(contents);
    // 组合数据
    const contentFull = this._addUserInfo(contents, userInfos);
    // 返回ret
    this.setRet(true, "success", contentFull);
  }
  // 处理content
  _filterContent(contents: WithId<Content>[]) {
    return contents.filter((content) => content["user_id"]);
  }
  async _callApi(contents: WithId<Content>[]) {
    const userIds = contents.map((content) => content.user_id);
    const res = await axios.get("http://127.0.0.1:4000/api/userInfos", {
      params: { user_ids: userIds.join(",") },
    });
    const userInfos: WithId<User>[] = res.data.data;
    return userInfos;
  }
  _addUserInfo(contents: WithId<Content>[], userInfos: WithId<User>[]) {
    const userInfoMap = userInfos.reduce((prev, userInfo) => {
      return {
        ...prev,
        [userInfo.id]: userInfo,
      };
    }, {});
    const contentFull = contents.map((content) => {
      return {
        ...content,
        user_info: userInfoMap[
          content.user_id as keyof typeof userInfoMap
        ] as WithId<User>,
      };
    });
    return contentFull;
  }
  test() {
    this.setRet(false);
  }
}

export default ContentController;
