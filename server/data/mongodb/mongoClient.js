import { MongoClient } from "mongodb";
import { config } from "../../config/config.js";

const client = new MongoClient(config.mongodb.uri);
await client.connect();

export const db = client.db(config.mongodb.dbName);
export const barsCollection = db.collection("bars");
