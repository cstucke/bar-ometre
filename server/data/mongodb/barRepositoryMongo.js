import { barsCollection } from "./mongoClient.js";

function buildQuery({ name, city, arrondissement } = {}) {
  const query = {};
  if (name) query.name = { $regex: name, $options: "i" };
  if (city) query["address.city"] = { $regex: city, $options: "i" };
  if (arrondissement) {
    query["address.postcode"] = `750${String(arrondissement).padStart(2, "0")}`;
  }
  return query;
}

function toDTO(doc) {
  if (!doc) return null;
  return {
    id:            doc._id,
    name:          doc.name,
    street:        doc.address?.street      ?? null,
    house_number:  doc.address?.housenumber ?? null,
    postcode:      doc.address?.postcode    ?? null,
    city:          doc.address?.city        ?? null,
    phone:         doc.contact?.phone       ?? null,
    website:       doc.contact?.website     ?? null,
    opening_hours: doc.opening_hours        ?? null,
    latitude:      doc.location?.coordinates?.[1] ?? null,
    longitude:     doc.location?.coordinates?.[0] ?? null,
  };
}

export async function findAllBars(filters = {}) {
  const limit = Math.min(Number(filters.limit) || 500, 500);
  const docs = await barsCollection
    .find(buildQuery(filters))
    .sort({ name: 1 })
    .limit(limit)
    .toArray();
  return docs.map(toDTO);
}

export async function findBarById(id) {
  return toDTO(await barsCollection.findOne({ _id: id }));
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
  return docs.map(toDTO);
}

export async function findBarsWithOpeningHours() {
  return barsCollection
    .find(
      { opening_hours: { $exists: true, $type: "string", $ne: "" } },
      { projection: { _id: 1, name: 1, opening_hours: 1 } },
    )
    .toArray();
}

export async function findFilterOptions() {
  const cities = await barsCollection
    .distinct("address.city", { "address.city": { $ne: null } });
  return { cities: cities.sort() };
}

export async function findStatistics() {
  const [total_bars, bars_with_coordinates, cities] = await Promise.all([
    barsCollection.countDocuments(),
    barsCollection.countDocuments({ "location.coordinates": { $exists: true } }),
    barsCollection.distinct("address.city", { "address.city": { $ne: null } }),
  ]);
  return { total_bars, total_cities: cities.length, bars_with_coordinates };
}
