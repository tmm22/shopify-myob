# Shopify to MYOB Address Copier

A browser extension that copies customer address data from Shopify orders and pastes it into MYOB's customer creation form. Available as both a Tampermonkey userscript and a Chrome extension.

## Features

- Fetches order data from Shopify via JSON API
- Copies customer name, email, phone, billing address, and shipping address
- Auto-fills MYOB's "Create Customer" dialog
- Converts Australian state names to abbreviations (e.g., Victoria → VIC)
- Handles React-controlled inputs in MYOB
- Session-based debug mode for troubleshooting
- Local data storage with no external servers
- Professional Chrome Web Store ready

## Installation Options

### Option 1: Chrome Extension (Recommended)

#### Manual Installation:
1. Download the extension files from the `chrome-extension/` directory
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `chrome-extension` directory
5. The extension will appear in your toolbar

#### Chrome Web Store:
1. Visit the Chrome Web Store
2. Search for "Shopify API to MYOB"
3. Click "Add to Chrome"
4. Grant permissions when prompted

### Option 2: Tampermonkey Userscript

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Create a new script in Tampermonkey
3. Copy contents of `shopify-myob.js` into the script
4. Save the script

## Usage

### Chrome Extension:

#### In Shopify:
1. Navigate to any order page (`/orders/{order_id}`)
2. Click the "Copy Address (API)" button that appears
3. An alert will show all copied data
4. Extension icon in toolbar shows data status

#### In MYOB:
1. Open "Create Customer" dialog
2. Click the "Paste Address" button (top-left of dialog)
3. All fields will be auto-filled with proper timing
4. Use extension popup to manage data and debug mode

#### Extension Popup:
1. Click the extension icon in Chrome toolbar
2. View current stored data status
3. Enable/disable debug mode (session-based)
4. Clear all stored data if needed
5. View debug information when debug mode is enabled

### Tampermonkey Userscript:

#### In Shopify:
1. Navigate to an order page (`/orders/{order_id}`)
2. Click the "Copy Address (API)" floating button
3. An alert will show all copied data

#### In MYOB:
1. Open "Create Customer" dialog
2. Click the "Paste Address" button (top-left of dialog)
3. All fields will be auto-filled

## Requirements

### Chrome Extension:
- Chrome browser (latest version recommended)
- Access to Shopify admin
- Access to MYOB

### Tampermonkey:
- Tampermonkey browser extension
- Access to Shopify admin
- Access to MYOB

## Chrome Web Store Information

- **Publisher**: Mangan Distribution
- **Version**: 1.0.0
- **Privacy Policy**: See `chrome-extension/privacy-policy.html`
- **Permissions Required**:
  - `storage` - Local storage for customer data
  - Host permissions for Shopify and MYOB domains

## Data Storage & Privacy

- All data is stored locally in your browser
- No data is transmitted to external servers
- Data persists until manually cleared or extension is uninstalled
- Only necessary data is collected (name, email, phone, addresses)
- Debug mode logs only to browser console and cleared on session end

Full privacy policy available in `chrome-extension/privacy-policy.html`

## Troubleshooting

### General Issues:
1. **Buttons don't appear**: Refresh the page and ensure you're on the correct URLs
2. **Data doesn't paste**: Enable debug mode and check browser console
3. **Copy fails**: Ensure you're on a specific Shopify order page
4. **Extension not working**: Check Chrome extensions page for errors

### Debug Mode:
1. Enable debug mode in the extension popup
2. Check browser console (F12) for detailed logs
3. Debug mode is session-based (resets when browser closes)

### Chrome Extension Specific:
- **Permissions denied**: Check that the extension has the necessary permissions
- **Extension disabled**: Ensure the extension is enabled in Chrome extensions page

### Tampermonkey Specific:
- **Script not running**: Check Tampermonkey is enabled and script is active
- **Storage errors**: Ensure Tampermonkey has storage permissions

## Development

### Chrome Extension Development:
```bash
# Load extension in Chrome
1. Open chrome://extensions/
2. Enable Developer mode
3. Click "Load unpacked"
4. Select chrome-extension directory
```

### Tampermonkey Development:
```bash
# Edit shopify-myob.js
1. Make changes to the userscript
2. Save the file
3. Refresh the target webpage
```

## File Structure

```
shopify-myob/
├── shopify-myob.js                    # Original Tampermonkey script
├── chrome-extension/
│   ├── manifest.json                  # Chrome extension manifest
│   ├── background.js                   # Service worker
│   ├── content.js                     # Main functionality
│   ├── popup.html                     # Extension popup
│   ├── popup.js                       # Popup logic
│   ├── styles.css                     # Styling
│   ├── privacy-policy.html            # Privacy policy
│   ├── icons/                        # Extension icons
│   └── store-assets/                  # Store screenshots
├── README.md                        # This file
└── agents.md                        # AI development notes
```

## Version History

### Chrome Extension v1.0.0 (January 2026)
- Initial Chrome Web Store release
- Full feature parity with Tampermonkey version
- Added professional popup interface
- Session-based debug mode
- Chrome Web Store compliance
- Enhanced error handling

### Tampermonkey v3.0
- Added React input handling improvements
- Enhanced error handling and validation
- Added state abbreviation mapping
- Improved timing for field filling
- Added debug logging capabilities

## Support

For Chrome Extension issues:
1. Check the Chrome Web Store listing
2. Use the debug mode to gather information
3. Report issues through the Chrome Web Store contact methods

For Tampermonkey issues:
1. Check browser console for errors
2. Verify script is enabled in Tampermonkey
3. Report issues on GitHub repository

## License

This project is open source. See individual files for specific licensing information.

## Credits

**Publisher**: Mangan Distribution
**Original Developer**: tmm22
**Chrome Extension Development**: AI-assisted development using Chrome Extension API
**Testing and QA**: Manual testing on Shopify and MYOB platforms