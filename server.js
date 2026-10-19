// Hoops! server. Serves the pages in public/ and the /api routes.
// Run it with: npm install, then npm run dev. Opens on http://localhost:3000.

const express = require("express");
const path = require("path"); // built into Node, no install needed. builds folder paths.

const app = express();
app.use(express.json()); // lets routes read JSON bodies, like the ping's { courtId }
app.use(express.static(path.join(__dirname, "public"))); // serves index.html, css, js, images

// The API. Auth comes later, so only parks and traffic for now.
app.use("/api", require("./routes/parks"));
app.use("/api", require("./routes/traffic"));

// Quick check the server is alive.
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hoops! listening on :${PORT}`));
