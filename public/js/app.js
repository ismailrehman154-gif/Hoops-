// Home page: park list with live traffic.
// Calls /api/traffic when the backend is up. When it is not (opening the
// page without the server, or the route missing), falls back to the bundled
// courts below with demo levels, so the page still reads like the app.

const API = {
  traffic: "/api/traffic",
};

// Same shape as courts.json. Only used when the API is unreachable.
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

// Backend levels to the badges the cards show.
const BADGE = {
  quiet: { label: "Slow", cls: "slow" },  // using these to display the activity at the parks, currently the data is 
  "warming up": { label: "Moderate", cls: "moderate" }, // misconstrued becaused there are no real users using the 
  busy: { label: "High", cls: "high" }, //application so it would not accurately output the responses
  packed: { label: "High", cls: "high" },
};

let courts = [];
let userPos = null;

// Stable demo level per court so the fallback does not shuffle on reload.
function demoLevel(courtId) {
  let h = 0;
  for (const ch of courtId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ["quiet", "quiet", "warming up", "busy", "packed"][h % 5];
}

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

function askLocation() {
  const settings = loadSettings();
  if (!settings.location || !("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      render();
    },
    () => {
      // Permission denied or unavailable. Distances just say "near you".
    },
    { timeout: 8000, maximumAge: 600000 }
  );
}

// Miles between two lat/lng points.
function milesBetween(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function distanceLabel(court) {
  if (!userPos) return "near you";
  const mi = milesBetween(userPos, court);
  return mi < 0.1 ? "here" : mi.toFixed(1) + " mi";
}

function mapsUrl(court) {
  return `https://www.google.com/maps/dir/?api=1&destination=${court.lat},${court.lng}`;
}

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

function greet() {
  const profile = loadProfile();
  const el = document.getElementById("welcome");
  el.innerHTML = profile
    ? `Welcome back, ${escapeHtml(profile.name)}`
    : `Welcome to Hoops! <a href="login.html">Set up your profile</a>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  greet();
  courts = await loadTraffic();
  render();
  askLocation();
  document.getElementById("search").addEventListener("input", render);
});
