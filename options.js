// Get the saved views count and set it in the input field
browser.storage.local.get("viewsCount").then(({ viewsCount }) => {
  document.getElementById("viewsCount").value = viewsCount || 100000; // default to 100000 if not set
});

// Save the views count when the save button is clicked
document.getElementById("saveButton").addEventListener("click", function () {
  let viewsCount = document.getElementById("viewsCount").value;
  browser.storage.local.set({ viewsCount: viewsCount });
});
