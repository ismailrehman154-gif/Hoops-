// Traffic at GET /api/traffic, pings at POST /api/ping.
// Demo version: pings live in memory, gone when the server restarts.
// The Mongo version replaces this file when the real backend is ready.

const express = require("express");
const fs = require("fs"); // built into Node. reads files.
const path = require("path"); // built into Node. builds folder paths.

const router = express.Router();

// Same courts.json as the parks route, so the ids always match.
const courts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "courts.json"), "utf8")
).courts;

// How long a ping counts: 30 minutes, in milliseconds.
const PING_WINDOW_MS = 30 * 60 * 1000;

// Quick check that a pinged court id is real.
const knownCourts = new Set(courts.map((c) => c.courtId));

// Every ping: { courtId, ts }. Never stores who pinged,
// just that somebody was at that court at that time.
let pings = [];

// Turns a ping count into a level word.
// The frontend's badge turns the word into the Slow/Moderate/High label,
// so this file picks the word and app.js picks how it looks.
function levelFor(count) {
  if (count >= 10) return "packed";
  if (count >= 6) return "busy";
  if (count >= 3) return "warming up";
  return "quiet";
}

// Throws away pings older than the 30-minute window.
// "Prune" just means trim: the cutoff is now minus 30 minutes,
// filter keeps only the pings newer than that.
function prune() {
  const cutoff = Date.now() - PING_WINDOW_MS;
  pings = pings.filter((p) => p.ts >= cutoff);
}

// A few fake pings so the page doesn't open empty while testing.
// First court gets 7 (busy), next two get 4 and 3 (warming up).
function seedDemo() {
  const now = Date.now();
  const ids = courts.slice(0, 3).map((c) => c.courtId);
  for (let i = 0; i < 7; i++) pings.push({ courtId: ids[0], ts: now - i * 60000 });
  for (let i = 0; i < 4; i++) pings.push({ courtId: ids[1], ts: now - i * 60000 });
  for (let i = 0; i < 3; i++) pings.push({ courtId: ids[2], ts: now - i * 60000 });
}
seedDemo();

// A player at a court pings it. Body is just { courtId }. Nothing else accepted.
router.post("/ping", (req, res) => {
  const { courtId } = req.body || {};
  if (!courtId || !knownCourts.has(courtId)) {
    return res.status(400).json({ ok: false, error: "unknown courtId" });
  }
  pings.push({ courtId, ts: Date.now() });
  res.json({ ok: true });
});

// The home page calls this. Prunes old pings first, counts what's left
// per court, sends every court with its level word.
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
