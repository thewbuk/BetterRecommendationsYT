let filteringEnabled = false;

// On start, get the status of filteringEnabled from storage
browser.storage.local.get("filteringEnabled").then((data) => {
  filteringEnabled = !!data.filteringEnabled;
});

// Listen to changes in the storage
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.filteringEnabled) {
    filteringEnabled = changes.filteringEnabled.newValue;
  }
});
