// Get the saved state of the filter and set it in the checkbox
browser.storage.local.get("filteringEnabled").then(({ filteringEnabled }) => {
  document.getElementById("toggleCheckbox").checked = filteringEnabled || false;
  console.log(
    `Filtering is currently ${filteringEnabled ? "enabled" : "disabled"}`
  );
});

// Save the state of the filter when the checkbox is toggled
document
  .getElementById("toggleCheckbox")
  .addEventListener("change", function () {
    let isEnabled = this.checked;
    console.log(`Filtering is now ${isEnabled ? "enabled" : "disabled"}`);
    browser.storage.local.set({ filteringEnabled: isEnabled });
  });
