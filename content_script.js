let observer = null;
let viewLimit = 100000; // default view count if not set

function hideVideosBasedOnViews() {
  let videoItems = document.querySelectorAll("ytd-rich-grid-media");

  videoItems.forEach((videoItem) => {
    // Using ytd-video-meta-block class to get the view count
    let metaBlock = videoItem.querySelector("ytd-video-meta-block");
    let viewCountSpan = metaBlock
      ? metaBlock.querySelector("span.inline-metadata-item")
      : null;
    let viewCountText = viewCountSpan ? viewCountSpan.innerText : "";

    // Convert K and M to numeric values
    let multiplier = 1;
    if (viewCountText.includes("K")) {
      multiplier = 1000;
    } else if (viewCountText.includes("M")) {
      multiplier = 1000000;
    }

    let viewCount = parseInt(viewCountText.replace(/\D/g, "")) * multiplier;

    console.log(
      `Processing video with text from metaBlock: ${viewCountText}, parsed view count: ${viewCount}`
    );

    // Hide the video item only if the viewCount is a valid number and less than viewLimit
    if (!isNaN(viewCount) && viewCount < viewLimit) {
      console.log(`Hiding video with view count: ${viewCount}`);
      videoItem.style.display = "none";
    } else {
      videoItem.style.display = ""; // Reset display property if view count is greater
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

// Listen to changes in YouTube's internal state (necessary for single page apps)
window.addEventListener("yt-navigate-finish", function () {
  console.log("YouTube page changed, reapplying filters");
  hideVideosBasedOnViews();
});
