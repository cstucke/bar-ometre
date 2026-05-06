import { MongoClient } from "mongodb";
import { createRequire } from "module";
import dotenv from "dotenv";

dotenv.config();

const require = createRequire(import.meta.url);
const bars = require("../../database/paris_bars.json");

const client = new MongoClient(process.env.MONGODB_URI);
const db     = client.db(process.env.MONGODB_DB);
const coll   = db.collection("bars");

async function migrate() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    await coll.drop().catch(() => {});
    console.log("Cleared existing collection");

    const result = await coll.insertMany(bars);
    console.log(`Inserted ${result.insertedCount} bars`);

    await coll.createIndex({ location: "2dsphere" });
    await coll.createIndex({ "address.postcode": 1 });
    await coll.createIndex({ name: "text" });
    console.log("Indexes created");

    console.log("🍺 Migration complete");
  } finally {
    await client.close();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});