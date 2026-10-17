// Profile page: shows the saved profile, or points to login.

document.addEventListener("DOMContentLoaded", () => {
  const profile = loadProfile();
  const wrap = document.getElementById("profile-wrap");

  if (!profile) {
    wrap.innerHTML = `
      <div class="profile-card">
        <h2>No profile yet</h2>
        <p class="style">Set one up to get the full Hoops! experience.</p>
      </div>
      <a class="btn-ghost" href="login.html">Go to login</a>`;
    return;
  }

  wrap.innerHTML = `
    <div class="profile-card">
      <h2>${escapeHtml(profile.name)}</h2>
      <p class="style">${escapeHtml(profile.playStyle || "Play style not set")}</p>
      <span class="badge ${profile.level === "Advanced" ? "high" : profile.level === "Intermediate" ? "moderate" : "slow"}">${escapeHtml(profile.level)}</span>
    </div>
    <button class="btn-ghost danger" id="signout">Sign out</button>`;

  document.getElementById("signout").addEventListener("click", () => {
    localStorage.removeItem(PROFILE_KEY);
    window.location.href = "login.html";
  });
});
