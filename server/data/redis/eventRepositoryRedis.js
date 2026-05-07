import { getRedisClient } from "./redisClient.js";

const EVENT_POPUP_PREFIX = "eventpopup";

function buildEventPopupKey(barId, eventId) {
  return `${EVENT_POPUP_PREFIX}:${barId}:${eventId}`;
}

export async function setEventPopup(barId, eventId, payload, ttlSeconds) {
  const client = getRedisClient();
  if (!client) return null;

  const redisKey = buildEventPopupKey(barId, eventId);

  try {
    const redisCommand = `SET ${redisKey} <json> EX ${ttlSeconds}`;

    // Redis command: SET eventpopup:<barId>:<eventId> <json> EX <ttlSeconds>
    await client.sendCommand([
      "SET",
      redisKey,
      JSON.stringify(payload),
      "EX",
      String(ttlSeconds),
    ]);
    return payload;
  } catch (error) {
    console.warn(`Redis event popup command failed: SET ${redisKey} <json> EX ${ttlSeconds}: ${error.message}`);
    return null;
  }
}

export async function getEventPopup(barId, eventId) {
  const client = getRedisClient();
  if (!client) return null;

  const redisKey = buildEventPopupKey(barId, eventId);

  try {
    const redisCommand = `GET ${redisKey}`;

    // Redis command: GET eventpopup:<barId>:<eventId>
    const cachedValue = await client.sendCommand(["GET", redisKey]);
    if (cachedValue === null) return null;

    return JSON.parse(cachedValue);
  } catch (error) {
    console.warn(`Redis event popup command failed: GET ${redisKey}: ${error.message}`);
    return null;
  }
}

export async function getActiveEventPopups() {
  const client = getRedisClient();
  if (!client) return [];

  const activeEventPopups = [];

  try {
    let cursor = "0";

    do {
      const redisCommand = `SCAN ${cursor} MATCH eventpopup:* COUNT 100`;

      // Redis command: SCAN <cursor> MATCH eventpopup:* COUNT 100
      const response = await client.sendCommand([
        "SCAN",
        cursor,
        "MATCH",
        "eventpopup:*",
        "COUNT",
        "100",
      ]);

      cursor = String(response[0]);
      const keys = Array.isArray(response[1]) ? response[1] : [];

      for (const redisKey of keys) {
        const getCommand = `GET ${redisKey}`;

        // Redis command: GET eventpopup:<barId>:<eventId>
        const cachedValue = await client.sendCommand(["GET", redisKey]);
        if (!cachedValue) continue;

        try {
          activeEventPopups.push(JSON.parse(cachedValue));
        } catch (error) {
          console.warn(`Redis event popup JSON parse failed for ${redisKey}: ${error.message}`);
        }
      }
    } while (cursor !== "0");

    return activeEventPopups;
  } catch (error) {
    console.warn(`Redis event popup command failed: SCAN <cursor> MATCH eventpopup:* COUNT 100: ${error.message}`);
    return [];
  }
}

export async function deleteEventPopup(barId, eventId) {
  const client = getRedisClient();
  if (!client) return false;

  const redisKey = buildEventPopupKey(barId, eventId);

  try {
    const redisCommand = `DEL ${redisKey}`;

    // Redis command: DEL eventpopup:<barId>:<eventId>
    const deletedCount = await client.sendCommand(["DEL", redisKey]);
    return Number(deletedCount) > 0;
  } catch (error) {
    console.warn(`Redis event popup command failed: DEL ${redisKey}: ${error.message}`);
    return false;
  }
}
