// Settings page: location toggle and local data controls.

document.addEventListener("DOMContentLoaded", () => {
  const settings = loadSettings();
  const toggle = document.getElementById("location-toggle");
  toggle.checked = settings.location !== false;

  toggle.addEventListener("change", () => {
    saveSettings({ ...loadSettings(), location: toggle.checked });
  });

  document.getElementById("clear-data").addEventListener("click", () => {
    if (confirm("Clear your Hoops! profile and settings on this device?")) {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      window.location.href = "login.html";
    }
  });
});
