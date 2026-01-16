// Background service worker for Shopify API to MYOB extension
// Manifest V3 service worker

// Extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
    console.log('[Shopify-MYOB] Extension installed:', details);
    
    // Initialize storage with default values
    chrome.storage.local.get(['customerData'], (result) => {
        if (!result.customerData) {
            console.log('[Shopify-MYOB] No existing data found, extension ready for first use');
        }
    });
    
    // Initialize session storage
    chrome.storage.session.get(['debugMode'], (result) => {
        if (result.debugMode === undefined) {
            chrome.storage.session.set({ debugMode: false });
        }
    });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Shopify-MYOB] Message received:', message);
    
    switch (message.type) {
        case 'debugModeChange':
            // Handle debug mode change from popup
            chrome.storage.session.set({ debugMode: message.debugMode });
            sendResponse({ success: true });
            break;
            
        case 'getData':
            // Handle data request from content script
            chrome.storage.local.get(['customerData'], (result) => {
                sendResponse({ data: result.customerData });
            });
            return true; // Keep message channel open for async response
            
        case 'setData':
            // Handle data save from content script
            chrome.storage.local.set({ customerData: message.data }, () => {
                sendResponse({ success: true });
            });
            return true;
            
        case 'clearData':
            // Handle data clear from popup
            chrome.storage.local.remove(['customerData'], () => {
                sendResponse({ success: true });
            });
            return true;
            
        default:
            console.warn('[Shopify-MYOB] Unknown message type:', message.type);
            sendResponse({ error: 'Unknown message type' });
    }
});

// Storage change monitoring
chrome.storage.onChanged.addListener((changes, areaName) => {
    console.log('[Shopify-MYOB] Storage changed:', { areaName, changes });
    
    if (areaName === 'local' && changes.customerData) {
        // Notify all tabs about data changes
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (tab.url && (tab.url.includes('shopify.com') || tab.url.includes('myob.com'))) {
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'storageChanged',
                        data: changes.customerData.newValue
                    }).catch(() => {
                        // Ignore errors for tabs that don't have content script loaded
                    });
                }
            });
        });
    }
});

// Clean up on extension uninstall
chrome.runtime.onSuspend.addListener(() => {
    console.log('[Shopify-MYOB] Extension suspending');
});

// Handle extension icon click (optional - could open options or help)
chrome.action.onClicked.addListener((tab) => {
    // Default action is to open popup, but we can add custom behavior here if needed
    console.log('[Shopify-MYOB] Extension icon clicked on tab:', tab.url);
});