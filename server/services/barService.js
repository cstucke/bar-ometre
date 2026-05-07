import * as barRepository from "../data/mongodb/barRepositoryMongo.js";
import * as searchCacheService from "./searchCacheService.js";

export async function getBars(filters) {
  return barRepository.findAllBars(filters);
}

export const getBarsByIds = async (barIds) => {
  if (!barIds || barIds.length === 0) return [];
  return barRepository.findBarsByIds(barIds); 
};

export async function searchBars(term) {
  if (!term) {
    const error = new Error("Search term required");
    error.statusCode = 400;
    throw error;
  };
  const searchParams = { term };
  const cachedBars = await searchCacheService.getCachedSearchResult(searchParams);
  if (cachedBars !== null) return cachedBars;

  const bars = await barRepository.searchBars(term);
  await searchCacheService.setCachedSearchResult(searchParams, bars);
  return bars;
};

export async function getBarsByCity(city) {
  return barRepository.findBarsByCity(city);
};

export async function getBarsByArrondissement(arrondissement) {
  return barRepository.findBarsByArrondissement(arrondissement);
};
