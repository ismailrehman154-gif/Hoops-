// Auth stubs. The login page keeps the profile in localStorage for now.
// When accounts land, these routes get passport-local plus sessions, and
// the frontend swaps its localStorage calls for fetch calls here.

const express = require("express");

const router = express.Router();

router.post("/auth/signup", (req, res) => {
  res.status(501).json({ ok: false, error: "signup not wired yet" });
});

router.post("/auth/login", (req, res) => {
  res.status(501).json({ ok: false, error: "login not wired yet" });
});

router.post("/auth/logout", (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
