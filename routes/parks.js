// Serves the court directory at GET /api/parks.
// Reads courts.json once when the server starts, so every request is fast.

const express = require("express");
const fs = require("fs"); // built into Node. reads files.
const path = require("path"); // built into Node. builds folder paths.

const router = express.Router();

// Load the courts now, not per request. Same file the traffic route reads,
// so both routes always agree on the court ids.
const courts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "courts.json"), "utf8")
).courts;

// Sends the whole directory as JSON: { courts: [...] }.
router.get("/parks", (req, res) => {
  res.json({ courts });
});

module.exports = router;
