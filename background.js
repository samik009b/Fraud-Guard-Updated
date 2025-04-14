let phishingURLs = [];

fetch(chrome.runtime.getURL("data/phishing-urls.csv"))
  .then((response) => response.text())
  .then((data) => {
    const rows = data.split("\n");
    rows.forEach((row) => {
      const url = row.trim().split(",")[0];
      if (url) phishingURLs.push(url);
    });
  });

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getPhishingList") {
    sendResponse({ phishingList: phishingURLs });
  }

  if (message.fraudDetected) {
    console.log("⚠️ Fraud detected on tab:", sender.tab?.url);
    console.log("Reason:", message.reason);
  }

  // No tab-closing now, since we redirect instead
});
