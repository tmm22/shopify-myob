// ==UserScript==
// @name         Shopify API to MYOB
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fetch customer data from Shopify orders and paste to MYOB
// @author       You
// @match        https://admin.shopify.com/*
// @match        https://*.myob.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/tmm22/shopify-myob/main/shopify-myob.js
// @downloadURL  https://raw.githubusercontent.com/tmm22/shopify-myob/main/shopify-myob.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // CONFIGURATION
    // =========================================================
    const DEBUG = false; // Set to true to enable console logging
    const STORAGE_KEY = 'savedCustomerData';
    
    // Timing constants (in milliseconds)
    const TIMING = {
        ACCORDION_EXPAND: 800,      // Wait for accordions to expand
        FIELD_FILL_INTERVAL: 150,   // Delay between filling each field
        COMBOBOX_ARROW_DELAY: 50,   // Delay before pressing arrow down
        COMBOBOX_ENTER_DELAY: 50,   // Delay before pressing enter
        EMAIL_FILL_DELAY: 1800,     // Delay before filling email (after all other fields)
        EMAIL_ENTER_DELAY: 100      // Delay before pressing enter on email
    };

    // Helper for conditional logging
    const log = (...args) => { if (DEBUG) console.log('[Shopify-MYOB]', ...args); };

    const isShopify = window.location.hostname.includes('shopify');
    const isMYOB = window.location.hostname.includes('myob');

    // =========================================================
    // PART A: SHOPIFY (Fetch Data via JSON)
    // =========================================================
    if (isShopify) {
        // Only show button if we are potentially on an order page
        // (You might want to refine this check based on your specific URL structure)
        if (window.location.href.includes('/orders/')) {
            addFloatingButton('Copy Address (API)', async () => {
                try {
                    // 1. Construct the JSON URL
                    // Removes query parameters (like ?sort=...) and adds .json
                    let jsonUrl = window.location.href.split('?')[0];
                    if (!jsonUrl.endsWith('.json')) {
                        jsonUrl += '.json';
                    }

                    // 2. Fetch the data
                    // Since you are logged in, the browser sends your cookies automatically
                    const response = await fetch(jsonUrl);

                    if (!response.ok) {
                        throw new Error(`API Error: ${response.status}`);
                    }

                    const data = await response.json();

                    // 3. Extract data safely
                    // The structure is usually { order: { shipping_address: { ... } } }
                    if (!data.order || !data.order.shipping_address) {
                        alert('No shipping address found in this order data.');
                        return;
                    }

                    const shipping = data.order.shipping_address;
                    const billing = data.order.billing_address || shipping; // Fallback to shipping if no billing

                    // Create a clean object to save
                    const addressData = {
                        // Customer info
                        name: `${shipping.first_name || ''} ${shipping.last_name || ''}`.trim(),
                        email: data.order.email || '',
                        phone: data.order.phone || shipping.phone || billing.phone || (data.order.customer && data.order.customer.phone) || '',
                        
                        // Shipping address
                        shipping: {
                            street: shipping.address1 || '',
                            street2: shipping.address2 || '',
                            city: shipping.city || '',
                            state: shipping.province || '',
                            zip: shipping.zip || '',
                            country: shipping.country_code || ''
                        },
                        
                        // Billing address
                        billing: {
                            street: billing.address1 || '',
                            street2: billing.address2 || '',
                            city: billing.city || '',
                            state: billing.province || '',
                            zip: billing.zip || '',
                            country: billing.country_code || ''
                        }
                    };

                    // 4. Save to Tampermonkey storage
                    GM_setValue(STORAGE_KEY, JSON.stringify(addressData));
                    
                    const billingAddr = `${addressData.billing.street}${addressData.billing.street2 ? ' ' + addressData.billing.street2 : ''}\n${addressData.billing.city}, ${addressData.billing.state} ${addressData.billing.zip}`;
                    const shippingAddr = `${addressData.shipping.street}${addressData.shipping.street2 ? ' ' + addressData.shipping.street2 : ''}\n${addressData.shipping.city}, ${addressData.shipping.state} ${addressData.shipping.zip}`;
                    
                    alert(`Copied Customer Data:\n\nName: ${addressData.name}\nEmail: ${addressData.email || 'N/A'}\nPhone: ${addressData.phone || 'N/A'}\n\nBilling Address:\n${billingAddr}\n\nShipping Address:\n${shippingAddr}`);

                } catch (err) {
                    console.error(err);
                    alert('Failed to fetch order data. Ensure you are on a specific order page.');
                }
            });
        }
    }

    // =========================================================
    // PART B: MYOB (Paste Data)
    // =========================================================
    if (isMYOB) {
        const pasteHandler = () => {
            const storedData = GM_getValue(STORAGE_KEY);
            if (!storedData) {
                alert('No address found in storage. Please copy an address from Shopify first.');
                return;
            }

            let address;
            try {
                address = JSON.parse(storedData);
            } catch (err) {
                alert('Error reading stored data. Please copy the address from Shopify again.');
                log('JSON parse error:', err);
                return;
            }

            // Split name into first/last for MYOB
            const nameParts = address.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

            // MYOB Create Customer dialog fields
            setInput('input[name="firstName"]', firstName);
            setInput('input[name="lastName"]', lastName);

            // Expand both Billing and Shipping address accordions
            const accordions = document.querySelectorAll('[data-flx-comp="Accordion"]');
            accordions.forEach(accordion => {
                const heading = accordion.querySelector('[data-flx-comp="Heading"]');
                if (heading && (heading.textContent.includes('Billing address') || heading.textContent.includes('Shipping address'))) {
                    const toggleBtn = accordion.querySelector('button[aria-expanded]');
                    if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'false') {
                        toggleBtn.click();
                    }
                }
            });

            // Wait for accordions to expand, then fill fields
            setTimeout(() => {
                const dialog = document.querySelector('dialog[open]');
                if (!dialog) {
                    log('No open dialog found');
                    return;
                }

                // Get all inputs by name - billing comes first (index 0), shipping second (index 1)
                const streetInputs = Array.from(dialog.querySelectorAll('input[name="street"]'));
                const cityInputs = Array.from(dialog.querySelectorAll('input[name="city"]'));
                const stateInputs = Array.from(dialog.querySelectorAll('input[name="state"]'));
                const postcodeInputs = Array.from(dialog.querySelectorAll('input[name="postcode"]'));
                const phoneInputs = Array.from(dialog.querySelectorAll('[class*="PhoneNumberList"] input'));

                log('Found inputs:', {
                    street: streetInputs.length,
                    city: cityInputs.length,
                    state: stateInputs.length,
                    postcode: postcodeInputs.length,
                    phone: phoneInputs.length
                });

                // Fill fields sequentially with delays to prevent React overwriting
                const fillSequence = [
                    // Billing
                    [streetInputs[0], `${address.billing.street} ${address.billing.street2}`.trim()],
                    [cityInputs[0], address.billing.city],
                    [stateInputs[0], abbreviateState(address.billing.state)],
                    [postcodeInputs[0], address.billing.zip],
                    // Shipping
                    [streetInputs[1], `${address.shipping.street} ${address.shipping.street2}`.trim()],
                    [cityInputs[1], address.shipping.city],
                    [stateInputs[1], abbreviateState(address.shipping.state)],
                    [postcodeInputs[1], address.shipping.zip],
                    // Phone
                    [phoneInputs[0], address.phone]
                ];

                fillSequence.forEach(([el, val], index) => {
                    if (el && val) {
                        setTimeout(() => {
                            el.focus();
                            setInputEl(el, val);
                            
                            // For combobox fields (like state), simulate selecting from dropdown
                            if (el.getAttribute('data-input-type') === 'combobox' || el.getAttribute('aria-autocomplete')) {
                                setTimeout(() => {
                                    // Press down arrow to highlight first option, then Enter to select
                                    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, bubbles: true }));
                                    setTimeout(() => {
                                        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                                        el.blur();
                                    }, TIMING.COMBOBOX_ENTER_DELAY);
                                }, TIMING.COMBOBOX_ARROW_DELAY);
                            } else {
                                el.blur();
                            }
                            log(`Filled field ${index}:`, val);
                        }, index * TIMING.FIELD_FILL_INTERVAL);
                    }
                });

                // Fill email LAST (after all fields are done)
                setTimeout(() => {
                    if (address.email) {
                        const emailInputs = dialog.querySelectorAll('input[name="email"]');
                        if (emailInputs[0]) {
                            emailInputs[0].focus();
                            emailInputs[0].value = address.email;
                            emailInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                            setTimeout(() => {
                                emailInputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                                emailInputs[0].dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                                emailInputs[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                                emailInputs[0].blur();
                                log('Email filled');
                            }, TIMING.EMAIL_ENTER_DELAY);
                        }
                    }
                }, TIMING.EMAIL_FILL_DELAY);
            }, TIMING.ACCORDION_EXPAND);
        };

        // Watch for dialogs opening and add button inside them (not on main page)
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        // Check if a dialog was added or opened
                        const dialog = node.tagName === 'DIALOG' ? node : node.querySelector?.('dialog');
                        if (dialog && dialog.open && !dialog.querySelector('.tm-paste-btn')) {
                            addFloatingButton('Paste Address', pasteHandler, dialog);
                        }
                    }
                }
            }
            // Also check for dialogs that were opened (not added)
            document.querySelectorAll('dialog[open]').forEach(dialog => {
                if (!dialog.querySelector('.tm-paste-btn')) {
                    addFloatingButton('Paste Address', pasteHandler, dialog);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] });
    }

    // =========================================================
    // HELPER FUNCTIONS
    // =========================================================
    // Australian state name to abbreviation mapping
    const stateAbbreviations = {
        'new south wales': 'NSW',
        'victoria': 'VIC',
        'queensland': 'QLD',
        'south australia': 'SA',
        'western australia': 'WA',
        'tasmania': 'TAS',
        'northern territory': 'NT',
        'australian capital territory': 'ACT'
    };

    function abbreviateState(state) {
        if (!state) return '';
        const lower = state.toLowerCase().trim();
        return stateAbbreviations[lower] || state; // Return abbreviation or original if not found
    }

    function setInput(selector, value) {
        const el = document.querySelector(selector);
        if (el) {
            setInputEl(el, value);
        } else {
            console.log(`Skipped: Could not find ${selector}`);
        }
    }

    function setInputEl(el, value) {
        if (!el) return;
        
        // For React controlled inputs, we need to use the native value setter
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        
        // Clear first, then set
        nativeInputValueSetter.call(el, '');
        el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'deleteContentBackward' }));
        
        // Now set the value
        nativeInputValueSetter.call(el, value);
        
        // Dispatch InputEvent which React listens to more reliably
        el.dispatchEvent(new InputEvent('input', { 
            bubbles: true, 
            cancelable: true, 
            inputType: 'insertText',
            data: value
        }));
        
        // Also trigger change for good measure
        el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        
        // Try to update React's internal state by triggering the setter again after a microtask
        Promise.resolve().then(() => {
            if (el.value !== value) {
                nativeInputValueSetter.call(el, value);
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    function addFloatingButton(text, onClick, container = document.body) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = 'tm-paste-btn';
        const isDialog = container.tagName === 'DIALOG';
        Object.assign(btn.style, {
            position: isDialog ? 'absolute' : 'fixed',
            top: isDialog ? '20px' : 'auto',
            left: isDialog ? '20px' : 'auto',
            bottom: isDialog ? 'auto' : '20px',
            right: isDialog ? 'auto' : '20px',
            zIndex: '2147483647',
            padding: '12px 20px',
            backgroundColor: '#008060',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'background-color 0.2s, transform 0.1s'
        });
        
        // Hover effects
        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#006e52';
            btn.style.transform = 'scale(1.02)';
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = '#008060';
            btn.style.transform = 'scale(1)';
        };
        
        btn.onclick = onClick;
        container.appendChild(btn);
    }

})();