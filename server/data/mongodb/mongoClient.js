import { MongoClient } from "mongodb";
import { config } from "../../config/config.js";

const client = new MongoClient(config.mongodb.uri);
await client.connect();

export const db = client.db(config.mongodb.dbName);
export const barsCollection = db.collection("bars");

export async function findAllBars(filters = {}) {
    const limit = Math.min(Number(filters.limit) || 500, 500);
    const query = buildBarFilter(filters);

    const docs = await barsCollection
    .find(query)
    .sort({ name: 1 })
    .limit(limit)
    .toArray();

    return docs.map(toBarDTO);
}

export async function findBarById(id) {
    const doc = await barsCollection.findOne({ _id: id });
    return toBarDTO(doc);
}

export async function searchBars(term) {
    return findAllBars({ name: term });
}

export async function findBarsByCity(city) {
    return findAllBars({ city });
}

export async function findBarsByArrondissement(arrondissement) {
    return findAllBars({ arrondissement });
}

export async function findNearby({ lng, lat, maxDistance = 1000, limit = 50 }) {
    const docs = await barsCollection
    .find({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: maxDistance,
            },
        },
    })
    .limit(limit)
    .toArray();

    return docs.map(toBarDTO);
}

export async function findFilterOptions() {
    const cities = await barsCollection.distinct("address.city", {
        "address.city": { $ne: null },
    });

    return { cities: cities.sort() };
}

export async function findStatistics() {
    const [total, withCoords] = await Promise.all([
        barsCollection.countDocuments(),
        barsCollection.countDocuments({
        "location.coordinates": { $exists: true },
        }),
    ]);

    const cities = await barsCollection.distinct("address.city", {
        "address.city": { $ne: null },
    });

    return {
        total_bars:            total,
        total_cities:          cities.length,
        bars_with_coordinates: withCoords,
    };
}