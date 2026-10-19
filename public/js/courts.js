// Courts page: every park in the directory, with an "I'm at this court" button.
// The ping only sends the court id. No name, no GPS, nobody knows who pinged.

const API = {
  parks: "/api/parks",
  ping: "/api/ping",
};

// Same plan as the home page: server first, bundled file second,
// the 8 backup courts from common.js last.
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

// Sends one ping for a court. The server counts it toward the traffic level.
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

// Page loaded: get the courts, build a card for each one,
// drop them all into #court-list at once.
// courts.map(...) turns every court into its card HTML,
// .join("") glues them into one big string,
// innerHTML puts that string on the page.
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
        <a class="go" href="${mapsUrl(c)}" target="_blank" rel="noopener">Go Now</a>
      </div>
    </article>`
    )
    .join("");

  // One listener on the whole list. Figures out which button got clicked
  // by reading its data-court, then pings that court.
  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".ping-btn");
    if (btn) ping(btn.dataset.court, status);
  });
});
