// Login page. Frontend-only for now: the profile lives in localStorage.
// When /api/auth/login exists, swap saveProfile for a fetch call.

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nameField = document.getElementById("player-name");
  const styleField = document.getElementById("play-style");
  const name = nameField.value.trim();
  const playStyle = styleField.value.trim();
  const level = document.querySelector('input[name="level"]:checked').value;

  const nameWrap = document.getElementById("name-field");
  if (!name) {
    nameWrap.classList.add("invalid");
    nameField.focus();
    return;
  }
  nameWrap.classList.remove("invalid");

  saveProfile({ name, playStyle, level, createdAt: Date.now() });
  window.location.href = "index.html";
});
