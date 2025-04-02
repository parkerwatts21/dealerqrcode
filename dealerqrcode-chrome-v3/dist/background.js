(function initBackground() {
  console.log("[DealerQR] Background script initialized");
  chrome.runtime.onInstalled.addListener((details) => {
    console.log("[DealerQR] Extension installed/updated:", details.reason);
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openPopup") {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 600,
        height: 800
      });
    }
  });
  chrome.action.onClicked.addListener(async (tab) => {
    console.log("[DealerQR] Extension icon clicked");
    if (!tab.id) {
      console.error("[DealerQR] No tab ID available");
      return;
    }
    const url = tab.url || "";
    if (!url || url.startsWith("chrome://") || url.startsWith("edge://") || url.startsWith("about:")) {
      console.warn("[DealerQR] Cannot inject scripts into this page:", url);
      return;
    }
    try {
      console.log("[DealerQR] Attempting to message existing content script");
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: "ping"
        });
        console.log("[DealerQR] Content script already exists, sending toggle");
        await chrome.tabs.sendMessage(tab.id, { action: "toggleWidget" });
      } catch (e) {
        console.log("[DealerQR] Content script not found, injecting...");
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["contentScript.js"]
        });
        console.log("[DealerQR] Content script injected");
        setTimeout(async () => {
          console.log("[DealerQR] Sending initial toggle message");
          await chrome.tabs.sendMessage(tab.id, { action: "toggleWidget" });
        }, 100);
      }
    } catch (error) {
      console.error("[DealerQR] Error in background script:", error);
    }
  });
})();
//# sourceMappingURL=background.js.map
