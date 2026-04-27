import { pool } from "./postgresClient.js";

const BAR_COLUMNS = `
  id,
  name,
  addr_street AS street,
  addr_housenumber AS house_number,
  addr_postcode AS postcode,
  addr_city AS city,
  phone,
  website,
  opening_hours,
  latitude,
  longitude
`;

function buildBarFilters(filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.name) {
    values.push(`%${filters.name}%`);
    conditions.push(`LOWER(name) LIKE LOWER($${values.length})`);
  }

  if (filters.city) {
    values.push(`%${filters.city}%`);
    conditions.push(`LOWER(addr_city) LIKE LOWER($${values.length})`);
  }

  if (filters.arrondissement) {
    values.push(`750${String(filters.arrondissement).padStart(2, "0")}`);
    conditions.push(`addr_postcode = $${values.length}`);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    values,
  };
}

export async function findAllBars(filters = {}) {
  const { where, values } = buildBarFilters(filters);
  const limit = Math.min(Number(filters.limit) || 500, 500);
  values.push(limit);

  const result = await pool.query(
    `
      SELECT ${BAR_COLUMNS}
      FROM bars
      ${where}
      ORDER BY name
      LIMIT $${values.length}
    `,
    values,
  );

  return result.rows;
}

export async function findBarById(id) {
  const result = await pool.query(
    `
      SELECT ${BAR_COLUMNS}
      FROM bars
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
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

export async function findFilterOptions() {
  const result = await pool.query(`
    SELECT DISTINCT addr_city AS city
    FROM bars
    WHERE addr_city IS NOT NULL
    ORDER BY addr_city
  `);

  return {
    cities: result.rows.map((row) => row.city),
  };
}

export async function findStatistics() {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total_bars,
      COUNT(DISTINCT addr_city)::int AS total_cities,
      COUNT(*) FILTER (WHERE latitude IS NOT NULL AND longitude IS NOT NULL)::int AS bars_with_coordinates
    FROM bars
  `);

  return result.rows[0];
}
