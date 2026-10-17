// Demo traffic for the frontend draft.
// In-memory pings with the same fuzzy levels as the real backend:
// 3+ pings warms a court up, 6+ is busy, 10+ is packed. 30-minute decay.
// The Mongo version in hoops-mongo replaces this file when it is ready.

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const courts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "courts.json"), "utf8")
).courts;

const PING_WINDOW_MS = 30 * 60 * 1000;
const knownCourts = new Set(courts.map((c) => c.courtId));

// { courtId, ts }. Never stores who pinged, just that a ping happened.
let pings = [];

function levelFor(count) {
  if (count >= 10) return "packed";
  if (count >= 6) return "busy";
  if (count >= 3) return "warming up";
  return "quiet";
}

function prune() {
  const cutoff = Date.now() - PING_WINDOW_MS;
  pings = pings.filter((p) => p.ts >= cutoff);
}

// A few demo pings so the draft does not open on an empty map.
function seedDemo() {
  const now = Date.now();
  const ids = courts.slice(0, 3).map((c) => c.courtId);
  for (let i = 0; i < 7; i++) pings.push({ courtId: ids[0], ts: now - i * 60000 });
  for (let i = 0; i < 4; i++) pings.push({ courtId: ids[1], ts: now - i * 60000 });
  for (let i = 0; i < 3; i++) pings.push({ courtId: ids[2], ts: now - i * 60000 });
}
seedDemo();

// A player at a court pings it. Body: { courtId }. That is all we accept.
router.post("/ping", (req, res) => {
  const { courtId } = req.body || {};
  if (!courtId || !knownCourts.has(courtId)) {
    return res.status(400).json({ ok: false, error: "unknown courtId" });
  }
  pings.push({ courtId, ts: Date.now() });
  res.json({ ok: true });
});

// The frontend calls this. The shape matches /api/courts/active on the
// real backend, so the frontend does not change when the backends swap.
router.get("/traffic", (req, res) => {
  prune();
  const counts = {};
  for (const p of pings) counts[p.courtId] = (counts[p.courtId] || 0) + 1;

  const live = courts.map((c) => ({
    courtId: c.courtId,
    name: c.name,
    neighborhood: c.neighborhood,
    location: c.location,
    lat: c.lat,
    lng: c.lng,
    level: levelFor(counts[c.courtId] || 0),
  }));

  res.json({ courts: live, windowMinutes: 30 });
});

module.exports = router;
