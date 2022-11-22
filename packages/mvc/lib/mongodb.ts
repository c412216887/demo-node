import { MongoClient } from "mongodb";

// 链接数据库网址
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let connectedClient: MongoClient;

async function main() {
  try {
    connectedClient = await client.connect();
    console.log("connect success");
  } catch (error) {
    console.log("mongodb connect error", error);
  }
}

export async function getClient() {
  if (connectedClient !== undefined) {
    return connectedClient;
  }
  await main();
  return connectedClient;
}
