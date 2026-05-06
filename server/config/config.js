import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set in .env`);
  return value;
}

export const config = {
  server: {
    port:    process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  
  mongodb: {
    uri:    required("MONGODB_URI"),
    dbName: required("MONGODB_DB"),
  },
};
