import { getRedisClient } from "./redisClient.js";

export async function getCachedSearchResult(redisKey) {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const redisCommand = `GET ${redisKey}`;

    // Redis command: GET cache:search:<stableKey>
    const cachedValue = await client.sendCommand(["GET", redisKey]);
    if (cachedValue === null) return null;

    return JSON.parse(cachedValue);
  } catch (error) {
    console.warn(`Redis search cache command failed: GET ${redisKey}: ${error.message}`);
    return null;
  }
}

export async function setCachedSearchResult(redisKey, results, ttlSeconds) {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const redisCommand = `SET ${redisKey} <json> EX ${ttlSeconds}`;

    // Redis command: SET cache:search:<stableKey> <json> EX <ttlSeconds>
    await client.sendCommand([
      "SET",
      redisKey,
      JSON.stringify(results),
      "EX",
      String(ttlSeconds),
    ]);
    return true;
  } catch (error) {
    console.warn(`Redis search cache command failed: SET ${redisKey} <json> EX ${ttlSeconds}: ${error.message}`);
    return false;
  }
}

export async function deleteCachedSearchResult(redisKey) {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const redisCommand = `DEL ${redisKey}`;

    // Redis command: DEL cache:search:<stableKey>
    const deletedCount = await client.sendCommand(["DEL", redisKey]);
    return Number(deletedCount) > 0;
  } catch (error) {
    console.warn(`Redis search cache command failed: DEL ${redisKey}: ${error.message}`);
    return false;
  }
}
