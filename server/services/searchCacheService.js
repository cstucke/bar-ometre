import { createHash } from "node:crypto";

import { config } from "../config/config.js";
import * as searchCacheRepository from "../data/redis/searchCacheRepositoryRedis.js";

function normalizeForStableKey(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeForStableKey);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort()
      .reduce((normalized, key) => {
        normalized[key] = normalizeForStableKey(value[key]);
        return normalized;
      }, {});
  }

  return value;
}

export function buildStableSearchKey(searchParams) {
  const stableJson = JSON.stringify(normalizeForStableKey(searchParams));
  const stableKey = createHash("sha256").update(stableJson).digest("hex").slice(0, 16);
  return `cache:search:${stableKey}`;
}

export async function getCachedSearchResult(searchParams) {
  const redisKey = buildStableSearchKey(searchParams);
  const cachedResult = await searchCacheRepository.getCachedSearchResult(redisKey);

  if (cachedResult !== null) {
    console.log(`Redis search cache hit: ${redisKey}`);
  }

  return cachedResult;
}

export async function setCachedSearchResult(searchParams, results) {
  const redisKey = buildStableSearchKey(searchParams);
  return searchCacheRepository.setCachedSearchResult(
    redisKey,
    results,
    config.redis.searchCacheTtlSeconds,
  );
}
