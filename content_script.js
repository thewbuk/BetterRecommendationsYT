let observer = null;
let viewLimit = 100000; // default view count if not set

function hideVideosBasedOnViews() {
  let videoItems = document.querySelectorAll("ytd-video-meta-block");

  videoItems.forEach((videoItem) => {
    let viewCountElement = videoItem.querySelector("span.inline-metadata-item");
    let viewCountText = viewCountElement ? viewCountElement.innerText : "";
    let viewCount = parseInt(viewCountText.replace(/\D/g, ""));

    // Proceed only if the viewCount is a valid number
    if (!isNaN(viewCount) && viewCount < viewLimit) {
      let videoCard = videoItem.closest("ytd-rich-grid-media");
      if (videoCard) {
        videoCard.style.visibility = "hidden";
      }
    }
  });
}

// Function to start observing the page for changes
function startObserving() {
  if (observer === null) {
    observer = new MutationObserver(hideVideosBasedOnViews);
  }

  observer.observe(document.body, { childList: true, subtree: true });
  console.log("Started observing page for changes");
}

// Function to stop observing the page for changes
function stopObserving() {
  if (observer !== null) {
    observer.disconnect();
  }
  console.log("Stopped observing page for changes");
}

// On start, get the saved state and view count from storage
browser.storage.local
  .get(["filteringEnabled", "viewsCount"])
  .then(({ filteringEnabled, viewsCount }) => {
    viewLimit = viewsCount || 100000;
    if (filteringEnabled) {
      startObserving();
    } else {
      stopObserving();
    }
    console.log(
      `Starting with filtering ${
        filteringEnabled ? "enabled" : "disabled"
      } and view count limit ${viewLimit}`
    );
  });

// Listen to changes in the storage
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    if (changes.viewsCount) {
      viewLimit = changes.viewsCount.newValue;
      console.log(`Changed view count limit to ${viewLimit}`);
    }
    if (changes.filteringEnabled) {
      if (changes.filteringEnabled.newValue) {
        startObserving();
      } else {
        stopObserving();
      }
      console.log(
        `Filtering is now ${
          changes.filteringEnabled.newValue ? "enabled" : "disabled"
        }`
      );
    }
  }
});

// Listen to changes in YouTube's internal state (necessary for single page apps)
window.addEventListener("yt-navigate-finish", function () {
  console.log("YouTube page changed, reapplying filters");
  hideVideosBasedOnViews();
});
