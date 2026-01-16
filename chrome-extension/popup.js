document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'customerData';
    
    // DOM elements
    const statusIndicator = document.getElementById('statusIndicator');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    const dataPreview = document.getElementById('dataPreview');
    const debugModeCheckbox = document.getElementById('debugMode');
    const clearDataBtn = document.getElementById('clearData');
    const debugInfo = document.getElementById('debugInfo');
    const debugContent = document.getElementById('debugContent');
    
    // Initialize the popup
    initializePopup();
    
    function initializePopup() {
        // Load debug mode state
        chrome.storage.session.get(['debugMode'], (result) => {
            debugModeCheckbox.checked = result.debugMode || false;
            toggleDebugInfo();
        });
        
        // Load stored data
        loadStoredData();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Debug mode toggle
        debugModeCheckbox.addEventListener('change', (e) => {
            chrome.storage.session.set({ debugMode: e.target.checked });
            
            // Notify content script about debug mode change
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { 
                        type: 'debugModeChange', 
                        debugMode: e.target.checked 
                    });
                }
            });
            
            toggleDebugInfo();
        });
        
        // Clear data button
        clearDataBtn.addEventListener('click', clearAllData);
    }
    
    function loadStoredData() {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            const address = result[STORAGE_KEY];
            
            if (address) {
                updateStatus('Data stored', true);
                displayDataPreview(address);
            } else {
                updateStatus('No data stored', false);
                displayNoData();
            }
            
            // Update debug info
            updateDebugInfo(address);
        });
    }
    
    function updateStatus(text, hasData) {
        statusText.textContent = text;
        statusDot.className = `status-dot ${hasData ? 'active' : 'inactive'}`;
    }
    
    function displayDataPreview(address) {
        const html = `
            <div class="customer-info">
                <h4>Customer Information</h4>
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${escapeHtml(address.name || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${escapeHtml(address.email || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">${escapeHtml(address.phone || 'N/A')}</span>
                </div>
                
                <div class="addresses">
                    <div class="address-section">
                        <h5>Billing Address</h5>
                        <div class="address">${formatAddress(address.billing)}</div>
                    </div>
                    <div class="address-section">
                        <h5>Shipping Address</h5>
                        <div class="address">${formatAddress(address.shipping)}</div>
                    </div>
                </div>
            </div>
        `;
        
        dataPreview.innerHTML = `<div class="preview-content">${html}</div>`;
    }
    
    function displayNoData() {
        dataPreview.innerHTML = `
            <div class="preview-content">
                <p class="no-data">No customer data stored</p>
                <p class="hint">Copy data from Shopify first</p>
            </div>
        `;
    }
    
    function formatAddress(address) {
        if (!address) return 'No address';
        
        const lines = [];
        if (address.street) lines.push(escapeHtml(address.street));
        if (address.street2) lines.push(escapeHtml(address.street2));
        
        const cityStateZip = [];
        if (address.city) cityStateZip.push(escapeHtml(address.city));
        if (address.state) cityStateZip.push(escapeHtml(address.state));
        if (address.zip) cityStateZip.push(escapeHtml(address.zip));
        
        if (cityStateZip.length > 0) {
            lines.push(cityStateZip.join(', '));
        }
        
        return lines.join('<br>') || 'No address';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function toggleDebugInfo() {
        const isChecked = debugModeCheckbox.checked;
        debugInfo.style.display = isChecked ? 'block' : 'none';
    }
    
    function updateDebugInfo(address) {
        if (debugModeCheckbox.checked) {
            const info = {
                hasData: !!address,
                storageKey: STORAGE_KEY,
                timestamp: new Date().toISOString(),
                data: address || null
            };
            
            debugContent.innerHTML = `
                <pre>${JSON.stringify(info, null, 2)}</pre>
            `;
        } else {
            debugContent.innerHTML = '<p>Debug mode is off</p>';
        }
    }
    
    function clearAllData() {
        if (confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
            chrome.storage.local.remove([STORAGE_KEY], () => {
                displayNoData();
                updateStatus('No data stored', false);
                updateDebugInfo(null);
                
                // Show success message briefly
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = 'Data cleared successfully';
                document.body.appendChild(successMsg);
                
                setTimeout(() => {
                    successMsg.remove();
                }, 2000);
            });
        }
    }
    
    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes[STORAGE_KEY]) {
            loadStoredData();
        }
    });
    
    // Listen for debug mode changes from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'updateDebugInfo') {
            updateDebugInfo(message.data);
        }
    });
});