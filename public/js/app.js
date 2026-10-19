// Home page: the park list with live traffic.
// Tries the server first. Server down? Reads the bundled courts file.
// That missing too? Uses the 8 backup courts in common.js.
// Either way the page still looks like the app.

const API = {
  traffic: "/api/traffic",
};

// Turns the backend's level word into what the card shows.
// The word is different for every court and changes over time,
// so it has to live in JS. HTML can't know it ahead of time.
const BADGE = {
  quiet: { label: "Slow", cls: "slow" },
  "warming up": { label: "Moderate", cls: "moderate" },
  busy: { label: "High", cls: "high" },
  packed: { label: "High", cls: "high" },
};

let courts = [];
let userPos = null;

// Picks a steady demo level for a backup court.
// Hashes the court id into a number, uses it to pick from the list,
// so a court shows the same level on every reload instead of shuffling.
function demoLevel(courtId) {
  let h = 0;
  for (const ch of courtId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ["quiet", "quiet", "warming up", "busy", "packed"][h % 5];
}

// Gets the courts with their traffic levels.
// Plan: 1. ask the server. 2. if that fails, read the bundled courts file
// and hand each court a demo level. 3. if that fails too, use the backups.
async function loadTraffic() {
  try {
    const res = await fetch(API.traffic);
    if (!res.ok) throw new Error("traffic route missing");
    const data = await res.json();
    return data.courts;
  } catch (err) {
    try {
      const res = await fetch("data/courts.json");
      if (!res.ok) throw new Error("bundled data missing");
      const data = await res.json();
      return data.courts.map((c) => ({ ...c, level: demoLevel(c.courtId) }));
    } catch (err2) {
      return FALLBACK_COURTS.map((c) => ({ ...c, level: demoLevel(c.courtId) }));
    }
  }
}

// Asks the phone where it is, but only when the settings toggle is on.
// When the location lands, redraws the list so the distances show up.
function askLocation() {
  const settings = loadSettings();
  if (!settings.location || !("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      render();
    },
    () => {
      // Said no, or the phone can't. Distances just say "near you".
    },
    { timeout: 8000, maximumAge: 600000 }
  );
}

// Miles between two lat/lng points. Standard map math (haversine):
// turns the points into radians, runs the formula, times earth's radius.
function milesBetween(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const R = 3958.8; // earth radius in miles
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// What the card shows under the park name: "1.2 mi", "here", or "near you".
function distanceLabel(court) {
  if (!userPos) return "near you";
  const mi = milesBetween(userPos, court);
  return mi < 0.1 ? "here" : mi.toFixed(1) + " mi";
}

// Builds one park card's HTML from a court object.
// Called once per court, so every card gets its own name, badge, and link.
function cardHtml(court) {
  const badge = BADGE[court.level] || BADGE.quiet;
  const place = court.location || court.neighborhood || "";
  return `
    <article class="card" data-court="${escapeHtml(court.courtId)}">
      <div class="card-top">
        <div>
          <h3>${escapeHtml(court.name)}</h3>
          <p class="meta">${escapeHtml(place)} &middot; ${escapeHtml(distanceLabel(court))}</p>
        </div>
        <span class="badge ${badge.cls}">${badge.label}</span>
      </div>
      <a class="go" href="${mapsUrl(court)}" target="_blank" rel="noopener">Go Now</a>
    </article>`;
}

// Draws the list. Filters by the search box, builds a card per match,
// drops them all into #park-list at once.
function render() {
  const q = document.getElementById("search").value.trim().toLowerCase();
  const list = document.getElementById("park-list");
  const matches = courts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.neighborhood || "").toLowerCase().includes(q) ||
      (c.location || "").toLowerCase().includes(q)
  );
  list.innerHTML = matches.length
    ? matches.map(cardHtml).join("")
    : `<p class="empty">No parks match "${escapeHtml(q)}". Try another search.</p>`;
}

// "Welcome back, {name}" when signed in, else points to the login page.
function greet() {
  const profile = loadProfile();
  const el = document.getElementById("welcome");
  el.innerHTML = profile
    ? `Welcome back, ${escapeHtml(profile.name)}`
    : `Welcome to Hoops! <a href="login.html">Set up your profile</a>`;
}

// Page loaded: greet, get the courts, draw them, ask for location,
// redraw the list on every keystroke in the search box.
document.addEventListener("DOMContentLoaded", async () => {
  greet();
  courts = await loadTraffic();
  render();
  askLocation();
  document.getElementById("search").addEventListener("input", render);
});
