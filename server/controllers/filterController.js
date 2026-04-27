import * as filterService from "../services/filterService.js";

export async function getFilters(req, res) {
  const filters = await filterService.getFilters();
  res.json({ data: filters });
}

export async function getCities(req, res) {
  const cities = await filterService.getCities();
  res.json({ data: cities });
}

export async function getStatistics(req, res) {
  const stats = await filterService.getStatistics();
  res.json({ data: stats });
}
