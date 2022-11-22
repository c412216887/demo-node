import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";

class Mongodb {
  mongoClient: MongoClient;
  client?: MongoClient;
  constructor() {
    this.mongoClient = new MongoClient(uri);
    this.mongoClient.connect((err) => {
      if (err) {
        console.log("connect db error", err);
        return;
      }
      this.client = this.mongoClient;
    });
  }
  async getClient() {
    if (!this.client) {
      this.client = await this.mongoClient.connect();
    }
    return this.client;
  }
}
let baseMongo: Mongodb = new Mongodb();
export default baseMongo;
