import * as barRepository from "../data/mongodb/barRepositoryMongo.js";
import * as eventRepository from "../data/redis/eventRepositoryRedis.js";

const DAY_CODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_PATTERN = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/;
const DAY_INDEX_BY_CODE = {
  Su: 0,
  Mo: 1,
  Tu: 2,
  We: 3,
  Th: 4,
  Fr: 5,
  Sa: 6,
};

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function requireValue(value, fieldName) {
  if (!value) {
    throw createValidationError(`${fieldName} is required`);
  }
}

function parseTimeToMinutes(timeValue) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeValue);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) return null;
  if (hours === 24 && minutes !== 0) return null;

  return hours * 60 + minutes;
}

function expandDayRange(startCode, endCode) {
  const days = [];
  let dayIndex = DAY_INDEX_BY_CODE[startCode];
  const endIndex = DAY_INDEX_BY_CODE[endCode];

  while (dayIndex !== endIndex) {
    days.push(dayIndex);
    dayIndex = (dayIndex + 1) % 7;
  }

  days.push(endIndex);
  return days;
}

function parseDayExpression(dayExpression) {
  if (!dayExpression) return [0, 1, 2, 3, 4, 5, 6];

  return dayExpression
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => {
      const rangeMatch = /^(Su|Mo|Tu|We|Th|Fr|Sa)-(Su|Mo|Tu|We|Th|Fr|Sa)$/.exec(part);
      if (rangeMatch) return expandDayRange(rangeMatch[1], rangeMatch[2]);

      if (DAY_INDEX_BY_CODE[part] !== undefined) return [DAY_INDEX_BY_CODE[part]];

      return [];
    });
}

function makeDateForDayAndMinutes(referenceDate, dayOffset, minutes) {
  const date = new Date(referenceDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  date.setMinutes(minutes);
  return date;
}

function formatLocalTime(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function parseOpeningHourRules(openingHours) {
  if (!openingHours || typeof openingHours !== "string") return [];

  return openingHours
    .split(";")
    .map((rule) => rule.trim())
    .filter((rule) => rule && !/\boff\b/i.test(rule) && !rule.includes("+"))
    .flatMap((rule) => {
      const timeMatches = [...rule.matchAll(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/g)];
      if (timeMatches.length === 0) return [];

      const dayPart = rule
        .slice(0, timeMatches[0].index)
        .trim()
        .replace(/\s*,\s*/g, ",");

      if (MONTH_PATTERN.test(dayPart)) return [];

      const dayExpressionMatch = dayPart.match(/((?:Su|Mo|Tu|We|Th|Fr|Sa)(?:-(?:Su|Mo|Tu|We|Th|Fr|Sa))?(?:\s*,\s*(?:Su|Mo|Tu|We|Th|Fr|Sa)(?:-(?:Su|Mo|Tu|We|Th|Fr|Sa))?)*)$/);
      if (dayPart && !dayExpressionMatch) return [];

      const days = parseDayExpression(dayExpressionMatch?.[1]);
      if (days.length === 0) return [];

      return days.flatMap((dayIndex) => timeMatches.map((timeMatch) => ({
        dayIndex,
        opensAtMinutes: parseTimeToMinutes(timeMatch[1]),
        closesAtMinutes: parseTimeToMinutes(timeMatch[2]),
      }))).filter((interval) => (
        interval.opensAtMinutes !== null
        && interval.closesAtMinutes !== null
        && interval.opensAtMinutes !== interval.closesAtMinutes
      ));
    });
}

function getOpeningIntervalsForNow(openingHours, now) {
  const rules = parseOpeningHourRules(openingHours);
  const todayIndex = now.getDay();
  const yesterdayIndex = (todayIndex + 6) % 7;

  return rules.flatMap((rule) => {
    const intervals = [];

    if (rule.dayIndex === todayIndex) {
      const crossesMidnight = rule.closesAtMinutes <= rule.opensAtMinutes;
      intervals.push({
        opensAt: makeDateForDayAndMinutes(now, 0, rule.opensAtMinutes),
        closesAt: makeDateForDayAndMinutes(now, crossesMidnight ? 1 : 0, rule.closesAtMinutes),
      });
    }

    if (rule.dayIndex === yesterdayIndex && rule.closesAtMinutes <= rule.opensAtMinutes) {
      intervals.push({
        opensAt: makeDateForDayAndMinutes(now, -1, rule.opensAtMinutes),
        closesAt: makeDateForDayAndMinutes(now, 0, rule.closesAtMinutes),
      });
    }

    return intervals;
  }).sort((a, b) => a.opensAt - b.opensAt);
}

function buildOpeningTimePopup(bar, now) {
  const intervals = getOpeningIntervalsForNow(bar.opening_hours, now);
  const activeInterval = intervals.find((interval) => (
    interval.opensAt <= now && interval.closesAt > now
  ));

  if (activeInterval) {
    return {
      startsAt: activeInterval.opensAt,
      endsAt: activeInterval.closesAt,
      title: "Open now",
      message: `Open until ${formatLocalTime(activeInterval.closesAt)}`,
    };
  }

  return null;
}

export async function createEventPopup({ barId, eventId, type, title, message, startsAt, endsAt }) {
  requireValue(barId, "barId");
  requireValue(eventId, "eventId");
  requireValue(title, "title");
  requireValue(message, "message");
  requireValue(endsAt, "endsAt");

  const endsAtDate = new Date(endsAt);
  if (Number.isNaN(endsAtDate.getTime())) {
    throw createValidationError("endsAt must be a valid date");
  }

  const ttlSeconds = Math.ceil((endsAtDate.getTime() - Date.now()) / 1000);
  if (ttlSeconds <= 0) {
    throw createValidationError("endsAt must be a future date");
  }

  let startsAtIso = null;
  if (startsAt) {
    const startsAtDate = new Date(startsAt);
    if (Number.isNaN(startsAtDate.getTime())) {
      throw createValidationError("startsAt must be a valid date");
    }
    startsAtIso = startsAtDate.toISOString();
  }

  const eventPopup = {
    barId,
    eventId,
    type: type || "generic",
    title,
    message,
    startsAt: startsAtIso,
    endsAt: endsAtDate.toISOString(),
    createdAt: new Date().toISOString(),
  };

  return eventRepository.setEventPopup(barId, eventId, eventPopup, ttlSeconds);
}

export async function getActiveEventPopups() {
  return eventRepository.getActiveEventPopups();
}

export async function generateOpeningTimePopups() {
  const bars = await barRepository.findBarsWithOpeningHours();
  const now = new Date();
  const createdAt = now.toISOString();
  const generatedPopups = [];

  for (const bar of bars) {
    const popupTiming = buildOpeningTimePopup(bar, now);
    if (!popupTiming) continue;

    const ttlSeconds = Math.ceil((popupTiming.endsAt.getTime() - now.getTime()) / 1000);
    if (ttlSeconds <= 0) continue;

    const barId = String(bar._id);
    const eventId = "opening-hours-today";
    const eventPopup = {
      barId,
      eventId,
      type: "opening_hours",
      title: popupTiming.title,
      message: popupTiming.message,
      startsAt: popupTiming.startsAt.toISOString(),
      endsAt: popupTiming.endsAt.toISOString(),
      createdAt,
    };

    const storedPopup = await eventRepository.setEventPopup(
      barId,
      eventId,
      eventPopup,
      ttlSeconds,
    );

    if (storedPopup) {
      generatedPopups.push(storedPopup);
    }
  }

  return generatedPopups;
}

export async function getEventPopup(barId, eventId) {
  requireValue(barId, "barId");
  requireValue(eventId, "eventId");

  return eventRepository.getEventPopup(barId, eventId);
}

export async function deleteEventPopup(barId, eventId) {
  requireValue(barId, "barId");
  requireValue(eventId, "eventId");

  return eventRepository.deleteEventPopup(barId, eventId);
}
