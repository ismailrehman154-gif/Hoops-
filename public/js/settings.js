// Settings page: the location toggle and wiping local data.

document.addEventListener("DOMContentLoaded", () => {
  const settings = loadSettings();

  // Set the toggle to match the saved setting, then save on every flip.
  const toggle = document.getElementById("location-toggle");
  toggle.checked = settings.location !== false;

  toggle.addEventListener("change", () => {
    saveSettings({ ...loadSettings(), location: toggle.checked });
  });

  // Clear data: asks "are you sure", wipes profile + settings off the phone,
  // back to login.
  document.getElementById("clear-data").addEventListener("click", () => {
    if (confirm("Clear your Hoops! profile and settings on this device?")) {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      window.location.href = "login.html";
    }
  });
});
