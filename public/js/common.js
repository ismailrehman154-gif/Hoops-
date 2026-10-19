// Shared stuff every page needs: profile, settings, backup courts, and cleaning user input.
// Loads before the page's own script.

const PROFILE_KEY = "hoopsProfile";
const SETTINGS_KEY = "hoopsSettings";

// 8 backup courts. Only used when the server is not running
// (opening the page straight from the files, or the API route missing).
// Lives here so the home page and the courts page share one copy.
const FALLBACK_COURTS = [
  { courtId: "flushing-meadows", name: "Flushing Meadows Corona Park", neighborhood: "Corona, Queens", lat: 40.74612, lng: -73.85279 },
  { courtId: "cunningham-park", name: "Cunningham Park", neighborhood: "Fresh Meadows, Queens", lat: 40.74238, lng: -73.76479 },
  { courtId: "astoria-park", name: "Astoria Park", neighborhood: "Astoria, Queens", lat: 40.77675, lng: -73.92371 },
  { courtId: "forest-park", name: "Forest Park", neighborhood: "Woodhaven, Queens", lat: 40.69631, lng: -73.86651 },
  { courtId: "kissena-park", name: "Kissena Park", neighborhood: "Flushing, Queens", lat: 40.75178, lng: -73.82036 },
  { courtId: "rath-park", name: "Rath Park", neighborhood: "Franklin Square, NY", lat: 40.70797, lng: -73.68062 },
  { courtId: "tompkins-square", name: "Tompkins Square Park", neighborhood: "East Village, Manhattan", lat: 40.7265, lng: -73.98178 },
  { courtId: "west-4th", name: "West 4th Street Courts", neighborhood: "Greenwich Village, Manhattan", lat: 40.7312, lng: -74.0003 },
];

// Builds the Google Maps directions link for a court.
// Both pages use this for their "Go Now" buttons.
function mapsUrl(court) {
  return `https://www.google.com/maps/dir/?api=1&destination=${court.lat},${court.lng}`;
}

// Reads the saved profile off the phone. null when nobody signed in yet.
function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null;
  } catch (err) {
    return null;
  }
}

// Saves the profile on the phone. localStorage is the browser's little
// storage box, it keeps the data even after the page closes.
function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Reads the saved settings. Location starts on.
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

// Cleans anything the user typed before it goes on the page.
// Turns < > & " into safe codes, so a name can't break the layout
// or sneak code into the page.
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Lights up the current tab. Each page's <body> says which page it is,
// so this just matches the tab to the page.
function markActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".tabbar a").forEach((a) => {
    if (a.dataset.page === page) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", markActiveNav);
