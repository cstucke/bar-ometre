import * as barRepository from "../data/postgres/barRepository.js";

export async function getFilters() {
  return barRepository.findFilterOptions();
}

export async function getCities() {
  const filters = await barRepository.findFilterOptions();
  return filters.cities;
}

export async function getStatistics() {
  return barRepository.findStatistics();
}
