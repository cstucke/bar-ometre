import * as barService from "../services/barService.js";

export async function getBars(req, res) {
  const bars = await barService.getBars(req.query);
  res.json({ data: bars });
}

export async function getBarById(req, res) {
  const bar = await barService.getBarById(req.params.id);

  if (!bar) {
    return res.status(404).json({ message: "Bar not found" });
  }

  return res.json({ data: bar });
}

export async function searchBars(req, res) {
  const term = req.query.term || req.query.name || req.body?.term || req.body?.name;
  const bars = await barService.searchBars(term);
  res.json({ data: bars });
}

export async function getBarsByCity(req, res) {
  const bars = await barService.getBarsByCity(req.params.city);
  res.json({ data: bars });
}

export async function getBarsByArrondissement(req, res) {
  const bars = await barService.getBarsByArrondissement(req.params.arrondissement);
  res.json({ data: bars, count: bars.length });
}
