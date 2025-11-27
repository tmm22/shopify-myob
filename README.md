# Shopify to MYOB Address Copier

A Tampermonkey userscript that copies customer address data from Shopify orders and pastes it into MYOB's customer creation form.

## Features

- Fetches order data from Shopify via JSON API
- Copies customer name, email, phone, billing address, and shipping address
- Auto-fills MYOB's "Create Customer" dialog
- Converts Australian state names to abbreviations (e.g., Victoria → VIC)
- Handles React-controlled inputs in MYOB

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Create a new script in Tampermonkey
3. Copy the contents of `shopify-myob.js` into the script
4. Save the script

## Usage

### In Shopify:
1. Navigate to an order page (`/orders/{order_id}`)
2. Click the "Copy Address (API)" button
3. An alert will show all copied data

### In MYOB:
1. Open the "Create Customer" dialog
2. Click the "Paste Address" button (top-left of dialog)
3. All fields will be auto-filled

## Requirements

- Tampermonkey browser extension
- Access to Shopify admin
- Access to MYOB
