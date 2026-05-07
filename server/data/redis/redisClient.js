import { createClient } from "redis";

import { config } from "../../config/config.js";

let redisClient = null;
let redisAvailable = false;

export async function connectRedis() {
  if (!config.redis.enabled) {
    redisAvailable = false;
    return null;
  }

  if (redisClient?.isOpen) {
    redisAvailable = true;
    return redisClient;
  }

  // Redis CLIENT: create the official Redis client with REDIS_URL
  redisClient = createClient({
    url: config.redis.url,
    socket: {
      reconnectStrategy: false,
    },
  });

  redisClient.on("error", (error) => {
    redisAvailable = false;
    console.warn(`Redis warning: ${error.message}`);
  });

  try {
    // Redis CONNECT: open connection to the Redis server
    await redisClient.connect();

    const redisCommand = "PING";

    // Redis command: PING
    await redisClient.sendCommand(["PING"]);

    redisAvailable = true;
    console.log("Redis connected");
    return redisClient;
  } catch (error) {
    if (redisClient?.isOpen) {
      try {
        const redisCommand = "QUIT";

        //  Redis command: QUIT
        await redisClient.sendCommand(["QUIT"]);
      } catch (quitError) {
        console.warn(`Redis close warning: ${quitError.message}`);
      }
    }

    redisAvailable = false;
    redisClient = null;
    console.warn(`Redis unavailable: ${error.message}`);
    return null;
  }
}

export function getRedisClient() {
  if (!config.redis.enabled || !redisAvailable || !redisClient?.isOpen) {
    return null;
  }

  return redisClient;
}

export async function closeRedis() {
  if (!redisClient?.isOpen) {
    redisAvailable = false;
    return;
  }

  try {
    const redisCommand = "QUIT";

    // Redis command: QUIT
    await redisClient.sendCommand(["QUIT"]);
  } catch (error) {
    console.warn(`Redis close warning: ${error.message}`);
  } finally {
    redisAvailable = false;
    redisClient = null;
  }
}

export function isRedisAvailable() {
  return Boolean(config.redis.enabled && redisAvailable && redisClient?.isOpen);
}
