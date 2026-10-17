// Courts directory page: every park, with an "I'm at this court" ping.
// The ping sends only the court ID, same as the real backend expects.

const API = {
  parks: "/api/parks",
  ping: "/api/ping",
};

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

async function loadParks() {
  try {
    const res = await fetch(API.parks);
    if (!res.ok) throw new Error("parks route missing");
    return (await res.json()).courts;
  } catch (err) {
    try {
      const res = await fetch("data/courts.json");
      if (!res.ok) throw new Error("bundled data missing");
      return (await res.json()).courts;
    } catch (err2) {
      return FALLBACK_COURTS;
    }
  }
}

async function ping(courtId, statusEl) {
  try {
    const res = await fetch(API.ping, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courtId }),
    });
    statusEl.textContent = res.ok
      ? "Pinged. The traffic badge updates in a minute or so."
      : "Ping failed. Is the server running?";
  } catch (err) {
    statusEl.textContent = "Ping failed. Is the server running?";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const courts = await loadParks();
  const list = document.getElementById("court-list");
  const status = document.getElementById("ping-status");

  list.innerHTML = courts
    .map(
      (c) => `
    <article class="card">
      <div class="card-top">
        <div>
          <h3>${escapeHtml(c.name)}</h3>
          <p class="meta">${escapeHtml(c.location || c.neighborhood || "")}</p>
        </div>
      </div>
      <div class="ping-row">
        <button class="ping-btn" data-court="${escapeHtml(c.courtId)}">I am at this court</button>
        <a class="go" style="margin-top:0; flex:1;" href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}" target="_blank" rel="noopener">Go Now</a>
      </div>
    </article>`
    )
    .join("");

  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".ping-btn");
    if (btn) ping(btn.dataset.court, status);
  });
});
