// This will execute as soon as the background script loads
(function initBackground() {
  console.log('[DealerQR] Background script initialized');
  
  // Log when the extension is installed or updated
  chrome.runtime.onInstalled.addListener((details) => {
    console.log('[DealerQR] Extension installed/updated:', details.reason);
  });
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'openPopup') {
      chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: 600,
        height: 800
      });
    }
  });
  
  // Listen for extension icon clicks
  chrome.action.onClicked.addListener(async (tab) => {
    console.log('[DealerQR] Extension icon clicked');
    
    if (!tab.id) {
      console.error('[DealerQR] No tab ID available');
      return;
    }

    // Check if we can inject scripts into this tab
    const url = tab.url || '';
    if (!url || url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) {
      console.warn('[DealerQR] Cannot inject scripts into this page:', url);
      return;
    }

    try {
      // First try to send a message to see if content script is already there
      console.log('[DealerQR] Attempting to message existing content script');
      try {
        await chrome.tabs.sendMessage(tab.id, { 
          action: 'ping'
        });
        console.log('[DealerQR] Content script already exists, sending toggle');
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });
      } catch (e) {
        // Content script doesn't exist yet, inject it
        console.log('[DealerQR] Content script not found, injecting...');
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js']
        });
        console.log('[DealerQR] Content script injected');
        
        // Wait a moment for the content script to initialize
        setTimeout(async () => {
          console.log('[DealerQR] Sending initial toggle message');
          await chrome.tabs.sendMessage(tab.id!, { action: 'toggleWidget' });
        }, 100);
      }
    } catch (error) {
      console.error('[DealerQR] Error in background script:', error);
    }
  });
})(); 