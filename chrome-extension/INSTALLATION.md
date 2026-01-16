# Chrome Extension Installation Guide

## Quick Start

### Option 1: Load Unpacked (Development)

1. **Open Chrome Extensions Page**
   - Click the three dots in Chrome
   - Go to "More Tools" → "Extensions"
   - Or navigate directly to `chrome://extensions/`

2. **Enable Developer Mode**
   - Toggle "Developer mode" (top right)
   - This allows loading unpacked extensions

3. **Load Extension**
   - Click "Load unpacked"
   - Navigate to and select the `chrome-extension` directory
   - Click "Select"

4. **Verify Installation**
   - Extension should appear in your toolbar
   - Green S/M icon should be visible
   - Permission prompts may appear for Shopify/MYOB access

### Option 2: Install from Chrome Web Store (Future)

1. Visit Chrome Web Store
2. Search for "Shopify API to MYOB"
3. Click "Add to Chrome"
4. Review permissions and click "Add extension"

## Verification Steps

1. **Icon Check**
   - Look for green/blue split icon in Chrome toolbar
   - Click to open popup interface

2. **Shopify Test**
   - Navigate to any Shopify order page
   - Look for "Copy Address (API)" button
   - Button should appear in bottom right

3. **MYOB Test**
   - Open MYOB and start creating a customer
   - In the create dialog, look for "Paste Address" button
   - Button should appear in top left

4. **Popup Test**
   - Click extension icon
   - Should show "No data stored" initially
   - Debug toggle should work
   - Clear data button should work

## File Structure for Chrome Web Store

```
shopify-myob/
├── chrome-extension/
│   ├── manifest.json          # Extension configuration
│   ├── background.js           # Service worker
│   ├── content.js             # Main functionality
│   ├── popup.html             # Extension popup
│   ├── popup.js               # Popup logic
│   ├── styles.css             # Styling
│   ├── privacy-policy.html      # Privacy policy
│   ├── icons/                # Extension icons
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── store-assets/          # Store listing assets
│       ├── screenshot1.png
│       ├── screenshot2.png
│       ├── screenshot3.png
│       ├── screenshot4.png
│       ├── screenshot5.png
│       └── promotional.png
├── shopify-myob.js          # Original Tampermonkey script
├── README.md                # Complete documentation
└── agents.md               # AI development notes
```

## Chrome Web Store Submission Checklist

- [x] Extension files complete and functional
- [x] Icons in all required sizes (16, 48, 128px)
- [x] Privacy policy created
- [x] Store screenshots (5x 1280x800)
- [x] Promotional image (440x280)
- [x] Detailed description ready
- [x] Publisher: Mangan Distribution
- [x] Version: 1.0.0
- [x] Manifest V3 compliance
- [x] Minimal permissions
- [x] Content Security Policy

## Post-Installation Support

1. **Extension Not Working**
   - Refresh Shopify/MYOB pages
   - Check Chrome console for errors
   - Verify permissions are granted

2. **Buttons Not Appearing**
   - Ensure correct URL patterns (shopify.com/*, myob.com/*)
   - Check if other extensions are interfering
   - Try disabling other extensions

3. **Data Not Saving**
   - Check Chrome storage settings
   - Verify no browser cleanup extensions interfering

## Testing Guide

1. **Basic Flow Test**
   - Copy data from Shopify order
   - Navigate to MYOB create customer
   - Verify data pastes correctly

2. **Debug Mode Test**
   - Enable debug in extension popup
   - Check console for detailed logs
   - Verify debug info displays correctly

3. **Storage Test**
   - Copy customer data
   - Check popup shows data preview
   - Clear data and verify removal

4. **Cross-Platform Test**
   - Test on different Shopify order pages
   - Test on different MYOB pages
   - Verify React input handling works

## Chrome Web Store Submission Notes

**Category**: Productivity
**Language**: English
**Distribution**: All countries
**Privacy Policy URL**: Will be available in extension listing
**Support Email**: Use Chrome Web Store contact methods