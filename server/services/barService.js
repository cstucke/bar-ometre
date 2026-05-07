import * as barRepository from "../data/postgres/barRepository.js";

export async function getBars(filters) {
  return barRepository.findAllBars(filters);
}

export const getBarsByIds = async (barIds) => {
  try {
    const bars = await Bar.find({
      _id: { $in: barIds } 
    });
    return bars;
  } catch (error) {
    console.error("Error fetching populated bars from MongoDB:", error);
    throw new Error('Could not fetch complete bar details');
  }
};

export async function searchBars(term) {
  if (!term) {
    const error = new Error("Search term required");
    error.statusCode = 400;
    throw error;
  }

  return barRepository.searchBars(term);
}

export async function getBarsByCity(city) {
  return barRepository.findBarsByCity(city);
}

export async function getBarsByArrondissement(arrondissement) {
  return barRepository.findBarsByArrondissement(arrondissement);
}
