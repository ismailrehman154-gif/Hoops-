// Hoops! frontend scaffold.
// Serves the pages in public/ and wires the API routes the frontend calls.
// The route files stay thin on purpose: real auth and real traffic storage
// come later, on top of the Mongo backend in hoops-mongo.

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/parks"));
app.use("/api", require("./routes/traffic"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hoops! listening on :${PORT}`));
