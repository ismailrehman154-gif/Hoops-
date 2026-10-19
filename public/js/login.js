// Login page. No backend yet: the profile is saved on the phone (localStorage).
// When real accounts land, saveProfile gets swapped for a fetch to /api/auth/login.

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault(); // stop the form from reloading the page

  // Grab what he typed.
  const nameField = document.getElementById("player-name");
  const styleField = document.getElementById("play-style");
  const name = nameField.value.trim();
  const playStyle = styleField.value.trim();
  const level = document.querySelector('input[name="level"]:checked').value;

  // Name is required. No name, no submit: flag the field and stop.
  const nameWrap = document.getElementById("name-field");
  if (!name) {
    nameWrap.classList.add("invalid");
    nameField.focus();
    return;
  }
  nameWrap.classList.remove("invalid");

  // Save it on the phone and head to the home page.
  saveProfile({ name, playStyle, level, createdAt: Date.now() });
  window.location.href = "index.html";
});
