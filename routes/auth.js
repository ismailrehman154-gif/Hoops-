// Auth stubs. The login page keeps the profile in local storage for now.
// When accounts land, these routes get passport-local plus sessions, and
// the frontend swaps its local storage calls for fetch calls here.

const express = require("express");

const router = express.Router();

router.post("/auth/signup", (req, res) => {
  res.status(501).json({ ok: false, error: "signup not wired yet" }); //using server side error responses to be dsiplayed so long as the authenticator is not set up yet
});

router.post("/auth/login", (req, res) => {
  res.status(501).json({ ok: false, error: "login not wired yet" }); // same thing as up top
});

router.post("/auth/logout", (req, res) => { // gotta figure out how to use passport so i can actually build the authenticator
  res.json({ ok: true });
});

module.exports = router;
