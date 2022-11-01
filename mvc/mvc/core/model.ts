import baseMongo from "./mongodb";

class Model {
  db: string;
  baseMongo: typeof baseMongo;
  constructor() {
    // 链接数据库
    this.db = "User";
    this.baseMongo = baseMongo;
  }
  async get(collectionName: string) {
    const client = await this.baseMongo?.getClient();
    const collection = client.db(this.db).collection(collectionName);
    return collection;
  }
}

export default Model;
