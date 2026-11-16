# NIORA Jewels Website (`@niora__jewels_`)

A responsive, aesthetic storefront for **NIORA Jewels** featuring online ordering, a shopping bag drawer, a contact form that submits to the built-in Admin Portal, and CSV export.

## Files Included
- `index.html` — Page structure, product showcase, checkout modal, contact form, and Admin Portal.
- `styles.css` — Editorial ivory, charcoal, and champagne-gold styling.
- `script.js` — Product catalog, cart/bag logic, online ordering, contact submission, and Admin Portal.
- `assets/` — Curated jewellery product imagery.

## Quick Customization
1. **Update Prices or Products:** Edit the `PRODUCTS` array at the top of `script.js`.
2. **Swap Photos:** Replace any image in `assets/` with your own Instagram product photos using the same filename (or update the `image` path in `PRODUCTS`).
3. **Receive Contact & Order Emails Directly:** Create a free access key at [Web3Forms](https://web3forms.com/) and paste it into `NIORA_CONFIG.web3formsKey` in `script.js`.
4. **Admin Portal:** Click **Admin** in the top navigation or footer and enter PIN `1111` (you can change `adminPin` in `NIORA_CONFIG`).
