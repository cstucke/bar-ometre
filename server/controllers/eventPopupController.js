import * as eventPopupService from "../services/eventPopupService.js";

export async function createEventPopup(req, res) {
  const eventPopup = await eventPopupService.createEventPopup(req.body);

  if (!eventPopup) {
    return res.status(503).json({ message: "Redis is unavailable" });
  }

  return res.status(201).json({ data: eventPopup });
}

export async function getActiveEventPopups(req, res) {
  const eventPopups = await eventPopupService.getActiveEventPopups();
  res.json({ data: eventPopups, count: eventPopups.length });
}

export async function generateOpeningTimePopups(req, res) {
  const eventPopups = await eventPopupService.generateOpeningTimePopups();
  res.json({ data: eventPopups, count: eventPopups.length });
}

export async function getEventPopup(req, res) {
  const eventPopup = await eventPopupService.getEventPopup(req.params.barId, req.params.eventId);

  if (!eventPopup) {
    return res.status(404).json({ message: "Event popup not found" });
  }

  return res.json({ data: eventPopup });
}

export async function deleteEventPopup(req, res) {
  const deleted = await eventPopupService.deleteEventPopup(req.params.barId, req.params.eventId);
  res.json({ data: { deleted } });
}
