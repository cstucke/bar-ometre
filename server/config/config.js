import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },


  mongodb: {
    uri:    process.env.MONGODB_URI ?? (() => { throw new Error("MONGODB_URI is not set in .env") })(),
    dbName: process.env.MONGODB_DB  ?? (() => { throw new Error("MONGODB_DB is not set in .env") })(),
  },
};
