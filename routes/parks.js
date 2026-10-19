// Park directory. Reads the same courts.json shape the backend uses,
// so the frontend and the Mongo backend never disagree on court IDs.

const express = require("express"); // utilizing express in each and every backend part for each and every page


const router = express.Router();

const courts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "courts.json"), "utf8")
).courts;

router.get("/parks", (req, res) => {
  res.json({ courts });
});

module.exports = router;
