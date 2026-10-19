// Profile page. Reads the saved profile and draws it.
// The HTML lives here in JS (not in profile.html) because there are two
// versions: one for "no profile yet", one for the real profile.
// JS picks which one to show, so it builds the HTML itself.

document.addEventListener("DOMContentLoaded", () => {
  const profile = loadProfile();
  const wrap = document.getElementById("profile-wrap");

  // Nobody signed in: show the empty state with a link to login.
  if (!profile) {
    wrap.innerHTML = `
      <div class="profile-card">
        <h2>No profile yet</h2>
        <p class="style">Set one up to get the full Hoops! experience.</p>
      </div>
      <a class="btn-ghost" href="login.html">Go to login</a>`;
    return;
  }

  // Badge color for the level he picked.
  const levelCls = { Beginner: "slow", Intermediate: "moderate", Advanced: "high" };

  wrap.innerHTML = `
    <div class="profile-card">
      <h2>${escapeHtml(profile.name)}</h2>
      <p class="style">${escapeHtml(profile.playStyle || "Play style not set")}</p>
      <span class="badge ${levelCls[profile.level] || "slow"}">${escapeHtml(profile.level)}</span>
    </div>
    <button class="btn-ghost danger" id="signout">Sign out</button>`;

  // Sign out wipes the profile off the phone and goes back to login.
  document.getElementById("signout").addEventListener("click", () => {
    localStorage.removeItem(PROFILE_KEY);
    window.location.href = "login.html";
  });
});
