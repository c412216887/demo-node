import type { Collection, WithId } from "mongodb";
import Model from "../core/model";

export type Content = {
  content: string;
  desc: string;
  user_id: string;
};

class ContentModel extends Model {
  collectionName: string;
  constructor() {
    super();
    this.collectionName = "User";
  }
  async getList() {
    const collection: Collection = await this.get(this.collectionName);

    const contentList = await collection
      .find<WithId<Content>>({}, { limit: 100 })
      .toArray();
    return contentList;
  }
}

export default ContentModel;
