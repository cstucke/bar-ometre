import * as barRepository from "../data/mongodb/barRepositoryMongo.js";

export async function getBars(filters) {
  return barRepository.findAllBars(filters);
}

export async function getBarById(id) {
  return barRepository.findBarById(id);
}

export async function searchBars(term) {
  if (!term) {
    const error = new Error("Search term required");
    error.statusCode = 400;
    throw error;
  };
  return barRepository.searchBars(term);
};

export async function getBarsByCity(city) {
  return barRepository.findBarsByCity(city);
};

export async function getBarsByArrondissement(arrondissement) {
  return barRepository.findBarsByArrondissement(arrondissement);
};