// Shared bits: profile storage, settings storage, the bottom nav.

const PROFILE_KEY = "hoopsProfile";
const SETTINGS_KEY = "hoopsSettings";

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null;
  } catch (err) {
    return null;
  }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { location: true };
  } catch (err) {
    return { location: true };
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Escape anything the user typed before it hits the page.
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Highlight the current tab. Each page sets data-page on <body>.
function markActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".tabbar a").forEach((a) => {
    if (a.dataset.page === page) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", markActiveNav);
